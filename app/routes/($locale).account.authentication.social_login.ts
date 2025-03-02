import {ActionFunctionArgs, json} from '@shopify/remix-oxygen';
import {User} from 'firebase/auth';
import {DocumentData} from 'firebase/firestore';
import invariant from 'tiny-invariant';
import {CUSTOMER_REGISTER_MUTATION} from '~/graphql/customer-account/CustomerCreateMutation';
import {CUSTOMER_LOGIN_MUTATION} from '~/graphql/customer-account/CustomerLoginMutation';
import {checkCustomerByEmail, tokenCookie} from '~/utils/auth';
import {getUserByEmail} from '~/utils/firestore';
import {updateDocument, addDocument} from '~/utils/firestore';

export async function action({request, context}: ActionFunctionArgs) {
  const {env, storefront} = context;
  
  try {
    const {user, isSignUp, shopifyPassword} = (await request.json()) as {
      user: User;
      isSignUp: boolean;
      shopifyPassword?: string;
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

    // For Signup: Create new account
    if (isSignUp) {
      if (!shopifyPassword) {
        return json(
          {error: 'Password is required for signup'},
          {
            status: 400,
            headers: {
              'Set-Cookie': await context.session.commit(),
            },
          },
        );
      }

      // Check if customer exists
      const customer = await checkCustomerByEmail(user.email, env);
      if (customer) {
        return json(
          {error: 'Account already exists. Please log in instead.'},
          {
            status: 400,
            headers: {
              'Set-Cookie': await context.session.commit(),
            },
          },
        );
      }

      try {
        // Create Shopify account
        const createResponse = await storefront.mutate(
          CUSTOMER_REGISTER_MUTATION,
          {
            variables: {
              input: {
                email: user.email,
                password: shopifyPassword,
                firstName: user.displayName?.split(' ')[0] || '',
                lastName: user.displayName?.split(' ').slice(1).join(' ') || '',
              },
            },
          },
        );

        if (createResponse.errors?.length || createResponse?.customerCreate?.customerUserErrors?.length) {
          const error = createResponse.errors?.[0] || createResponse?.customerCreate?.customerUserErrors?.[0];
          return json(
            {error: error.message || 'Failed to create account'},
            {
              status: 400,
              headers: {
                'Set-Cookie': await context.session.commit(),
              },
            },
          );
        }

        // Get customer ID from response
        const customerId = createResponse?.customerCreate?.customer?.id;

        // Log in the new user
        const loginResponse = await storefront.mutate(
          CUSTOMER_LOGIN_MUTATION,
          {
            variables: {
              input: {
                email: user.email,
                password: shopifyPassword,
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
            {
              success: true,
              isNewUser: true,
              customerId,
            },
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
      } catch (error) {
        console.error('Signup error:', error);
        throw error;
      }
    }

    // For Login: Check if user exists and log them in
    const customer = await checkCustomerByEmail(user.email, env);
    if (!customer) {
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

    // Get stored password from Firebase or use provided password
    const userDoc = await getUserByEmail(user.email);
    const password = shopifyPassword || userDoc?.shopifyPassword;

    if (!password) {
      console.log('No password found for user:', {
        email: user.email,
        hasFirebaseDoc: !!userDoc,
        hasProvidedPassword: !!shopifyPassword
      });
      
      // Generate a new password if none exists
      const newPassword = `Google-${user.uid}-${Math.random().toString(36).slice(-12)}`;
      
      // Try logging in with the new password
      try {
        const loginResponse = await storefront.mutate(
          CUSTOMER_LOGIN_MUTATION,
          {
            variables: {
              input: {
                email: user.email,
                password: newPassword,
              },
            },
          },
        );

        if (!loginResponse.errors?.length && !loginResponse.customerAccessTokenCreate?.customerUserErrors?.length) {
          // Login successful with new password, store it in Firebase
          if (userDoc) {
            // Update existing Firebase document
            await updateDocument({
              uid: user.uid,
              shopifyPassword: newPassword,
            });
          } else {
            // Create new Firebase document
            await addDocument({
              uid: user.uid,
              email: user.email,
              shopifyPassword: newPassword,
              createdAt: new Date().toISOString()
            });
          }

          const accessToken = loginResponse.customerAccessTokenCreate.customerAccessToken.accessToken;
          const expiresAt = loginResponse.customerAccessTokenCreate.customerAccessToken.expiresAt;
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
      } catch (error) {
        console.error('Login with new password failed:', error);
      }

      return json(
        {error: 'Unable to sign in. Please try resetting your password through the login form.'},
        {
          status: 400,
          headers: {
            'Set-Cookie': await context.session.commit(),
          },
        },
      );
    }

    // Log the login attempt for debugging
    console.log('Attempting login with:', {
      email: user.email,
      hasPassword: !!password,
      isSignUp,
      hasCustomer: !!customer
    });

    // Attempt to log in
    try {
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
      
      if (customerAccessTokenCreate?.customerUserErrors?.length) {
        console.error('Login errors:', customerAccessTokenCreate.customerUserErrors);
        return json(
          {error: customerAccessTokenCreate.customerUserErrors[0].message || 'Failed to sign in'},
          {
            status: 400,
            headers: {
              'Set-Cookie': await context.session.commit(),
            },
          },
        );
      }

      if (!customerAccessTokenCreate?.customerAccessToken?.accessToken) {
        console.error('No access token in response');
        return json(
          {error: 'Failed to create access token'},
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
      console.error('Login mutation error:', error);
      return json(
        {error: 'Failed to sign in. Please try again later.'},
        {
          status: 500,
          headers: {
            'Set-Cookie': await context.session.commit(),
          },
        },
      );
    }
  } catch (error) {
    console.error('Social login error:', error);
    return json(
      {error: error instanceof Error ? error.message : 'Something went wrong'},
      {
        status: 400,
        headers: {
          'Set-Cookie': await context.session.commit(),
        },
      },
    );
  }
}
