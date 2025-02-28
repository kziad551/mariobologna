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

    // Check if user exists in Shopify
    const customer = await checkCustomerByEmail(user.email, env);

    // If user exists and trying to sign up, redirect to sign in
    if (customer && isSignUp) {
      return json(
        {error: 'Account already exists. Please use Log In with Google instead.'},
        {
          status: 400,
          headers: {
            'Set-Cookie': await context.session.commit(),
          },
        },
      );
    }

    // If user doesn't exist and trying to sign in, redirect to sign up
    if (!customer && !isSignUp) {
      return json(
        {error: 'No account found. Please Sign Up with Google first.'},
        {
          status: 400,
          headers: {
            'Set-Cookie': await context.session.commit(),
          },
        },
      );
    }

    // For existing users, attempt to sign in
    if (customer) {
      try {
        // Get stored password from Firebase
        const userDoc = await getUserByEmail(user.email);
        if (!userDoc?.password) {
          return json(
            {error: 'No password found for this account. Please Sign Up with Google first.'},
            {
              status: 400,
              headers: {
                'Set-Cookie': await context.session.commit(),
              },
            },
          );
        }

        const loginResponse = await context.storefront.mutate(
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
        
        if (loginResponse.errors?.length || customerAccessTokenCreate?.customerUserErrors?.length) {
          console.error('Login error:', loginResponse.errors?.[0] || customerAccessTokenCreate?.customerUserErrors?.[0]);
          return json(
            {error: 'Failed to sign in. Please try again later.'},
            {
              status: 400,
              headers: {
                'Set-Cookie': await context.session.commit(),
              },
            },
          );
        }

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
      } catch (error) {
        console.error('Sign in error:', error);
        return json(
          {error: 'Failed to sign in. Please try again later.'},
          {
            status: 400,
            headers: {
              'Set-Cookie': await context.session.commit(),
            },
          },
        );
      }
    }

    // For new users, create account
    try {
      // Generate a strong password for Shopify
      const password = Array(16)
        .fill(0)
        .map(() => {
          const chars =
            'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
          return chars[Math.floor(Math.random() * chars.length)];
        })
        .join('');

      const createUserResponse = await context.storefront.mutate(
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

      if (createUserResponse.errors?.length || createUserResponse?.customerCreate?.customerUserErrors?.length) {
        const error = createUserResponse.errors?.[0] || createUserResponse?.customerCreate?.customerUserErrors?.[0];
        console.error('Create user error:', error);
        
        if ((error as {message?: string})?.message?.includes('Email has already been taken')) {
          return json(
            {error: 'Account already exists. Please use Log In with Google instead.'},
            {
              status: 400,
              headers: {
                'Set-Cookie': await context.session.commit(),
              },
            },
          );
        }
        
        if (error.message?.includes('Limit exceeded')) {
          return json(
            {error: 'We are experiencing high traffic. Please try again in a few minutes.'},
            {
              status: 429,
              headers: {
                'Set-Cookie': await context.session.commit(),
              },
            },
          );
        }
        
        return json(
          {error: 'Failed to create account. Please try again later.'},
          {
            status: 400,
            headers: {
              'Set-Cookie': await context.session.commit(),
            },
          },
        );
      }

      // Log in the newly created user
      const loginResponse = await context.storefront.mutate(
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
      
      if (loginResponse.errors?.length || customerAccessTokenCreate?.customerUserErrors?.length) {
        console.error('Login error after signup:', loginResponse.errors?.[0] || customerAccessTokenCreate?.customerUserErrors?.[0]);
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
    } catch (error) {
      console.error('Signup error:', error);
      return json(
        {error: 'Failed to create account. Please try again later.'},
        {
          status: 400,
          headers: {
            'Set-Cookie': await context.session.commit(),
          },
        },
      );
    }
  } catch (error) {
    console.error('General error:', error);
    return json(
      {error: (error as {message?: string})?.message || 'Something went wrong'},
      {
        status: 400,
        headers: {
          'Set-Cookie': await context.session.commit(),
        },
      },
    );
  }
}
