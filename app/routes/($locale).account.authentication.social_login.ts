import {ActionFunctionArgs, json} from '@shopify/remix-oxygen';
import {User} from 'firebase/auth';
import {DocumentData} from 'firebase/firestore';
import invariant from 'tiny-invariant';
import {CUSTOMER_REGISTER_MUTATION} from '~/graphql/customer-account/CustomerCreateMutation';
import {CUSTOMER_LOGIN_MUTATION} from '~/graphql/customer-account/CustomerLoginMutation';
import {checkCustomerByEmail, tokenCookie} from '~/utils/auth';
import {getUserByEmail} from '~/utils/firestore';

export async function action({request, context}: ActionFunctionArgs) {
  const {env, storefront} = context;
  
  try {
    const {user, isSignUp} = (await request.json()) as {
      user: User;
      isSignUp: boolean;
    };

    if (!user || !user.email) {
      return json(
        {error: 'Invalid user data'},
        {
          status: 400,
          headers: {
            'Set-Cookie': await context.session.commit(),
          },
        },
      );
    }

    // Check if user exists in both systems
    const userDoc = await getUserByEmail(user.email);
    const customer = await checkCustomerByEmail(user.email, env);

    // For Login: User must exist in both Firebase and Shopify
    if (!isSignUp) {
      if (!customer || !userDoc) {
        return json(
          {error: 'No account found with this email. Please sign up first.'},
          {
            status: 400,
            headers: {
              'Set-Cookie': await context.session.commit(),
            },
          },
        );
      }

      // Attempt to log in with stored password
      const loginResponse = await storefront.mutate(
        CUSTOMER_LOGIN_MUTATION,
        {
          variables: {
            input: {
              email: user.email,
              password: userDoc.password,
            },
          },
        },
      );

      const {customerAccessTokenCreate} = loginResponse;
      
      if (!loginResponse.errors?.length && !customerAccessTokenCreate?.customerUserErrors?.length) {
        const accessToken = customerAccessTokenCreate.customerAccessToken.accessToken;
        const expiresAt = customerAccessTokenCreate.customerAccessToken.expiresAt;
        const maxAge = Math.floor(
          (new Date(expiresAt).getTime() - Date.now()) / 1000,
        );

        return json(
          {success: true, isNewUser: false},
          {
            headers: {
              'Set-Cookie': await tokenCookie.serialize(accessToken, {maxAge}),
            },
          },
        );
      }
      
      console.error('Login error:', loginResponse.errors?.[0] || customerAccessTokenCreate?.customerUserErrors?.[0]);
      return json(
        {error: 'Failed to sign in. Please try again.'},
        {
          status: 400,
          headers: {
            'Set-Cookie': await context.session.commit(),
          },
        },
      );
    }

    // For Signup: User must not exist in either system
    if (isSignUp) {
      if (customer || userDoc) {
        return json(
          {error: 'An account with this email already exists. Please log in instead.'},
          {
            status: 400,
            headers: {
              'Set-Cookie': await context.session.commit(),
            },
          },
        );
      }

      // Generate password for new account
      const password = Array(16)
        .fill(0)
        .map(() => {
          const chars =
            'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
          return chars[Math.floor(Math.random() * chars.length)];
        })
        .join('');

      // Create Shopify account
      const createResponse = await storefront.mutate(
        CUSTOMER_REGISTER_MUTATION,
        {
          variables: {
            input: {
              email: user.email,
              password,
            },
          },
        },
      );

      if (createResponse.errors?.length || createResponse?.customerCreate?.customerUserErrors?.length) {
        const error = createResponse.errors?.[0] || createResponse?.customerCreate?.customerUserErrors?.[0];
        console.error('Create account error:', error);
        return json(
          {error: 'Failed to create account. Please try again.'},
          {
            status: 400,
            headers: {
              'Set-Cookie': await context.session.commit(),
            },
          },
        );
      }

      // Log in the new user
      const loginResponse = await storefront.mutate(
        CUSTOMER_LOGIN_MUTATION,
        {
          variables: {
            input: {
              email: user.email,
              password,
            },
          },
        },
      );

      const {customerAccessTokenCreate} = loginResponse;
      
      if (!loginResponse.errors?.length && !customerAccessTokenCreate?.customerUserErrors?.length) {
        const accessToken = customerAccessTokenCreate.customerAccessToken.accessToken;
        const expiresAt = customerAccessTokenCreate.customerAccessToken.expiresAt;
        const maxAge = Math.floor(
          (new Date(expiresAt).getTime() - Date.now()) / 1000,
        );

        return json(
          {success: true, isNewUser: true, password},
          {
            headers: {
              'Set-Cookie': await tokenCookie.serialize(accessToken, {maxAge}),
            },
          },
        );
      }

      return json(
        {error: 'Account created but failed to sign in. Please try logging in.'},
        {
          status: 400,
          headers: {
            'Set-Cookie': await context.session.commit(),
          },
        },
      );
    }

    return json(
      {error: 'Invalid request'},
      {
        status: 400,
        headers: {
          'Set-Cookie': await context.session.commit(),
        },
      },
    );
  } catch (error) {
    console.error('Social login error:', error);
    return json(
      {error: 'Something went wrong. Please try again.'},
      {
        status: 400,
        headers: {
          'Set-Cookie': await context.session.commit(),
        },
      },
    );
  }
}
