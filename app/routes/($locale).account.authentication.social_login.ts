import {ActionFunctionArgs, json} from '@shopify/remix-oxygen';
import {User} from 'firebase/auth';
import {DocumentData} from 'firebase/firestore';
import invariant from 'tiny-invariant';
import {CUSTOMER_REGISTER_MUTATION} from '~/graphql/customer-account/CustomerCreateMutation';
import {CUSTOMER_LOGIN_MUTATION} from '~/graphql/customer-account/CustomerLoginMutation';
import {checkCustomerByEmail, tokenCookie} from '~/utils/auth';

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

    // Check if the user exists in Shopify
    const customer = await checkCustomerByEmail(user.email, env);
    
    // If user exists and trying to sign up, return error
    if (customer && isSignUp) {
      return json(
        {error: 'Email has already been taken. Please sign in instead.'},
        {
          status: 400,
          headers: {
            'Set-Cookie': await context.session.commit(),
          },
        },
      );
    }
    
    // If user doesn't exist and trying to sign in, return error
    if (!customer && !isSignUp) {
      return json(
        {error: 'No account found with this email. Please sign up instead.'},
        {
          status: 400,
          headers: {
            'Set-Cookie': await context.session.commit(),
          },
        },
      );
    }

    // For new user signup
    if (isSignUp && !customer) {
      try {
        // Generate a simple password for Shopify - limit to 40 chars
        const password = (user.uid + Date.now().toString()).substring(0, 40);

        // Create new customer in Shopify
        const createResponse = await storefront.mutate(
          CUSTOMER_REGISTER_MUTATION,
          {
            variables: {
              input: {
                email: user.email,
                password,
                firstName: user.displayName?.split(' ')[0] || '',
                lastName: user.displayName?.split(' ').slice(1).join(' ') || '',
              },
            },
          },
        );

        // Handle Shopify rate limit errors
        if (createResponse.errors?.length) {
          const error = createResponse.errors[0];
          if (error.message.includes('Creating Customer Limit exceeded')) {
            return json(
              {error: 'We\'re processing too many signups right now. Please try again in a few minutes.'},
              {
                status: 429,
                headers: {
                  'Set-Cookie': await context.session.commit(),
                },
              },
            );
          }
          
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

        if (createResponse?.customerCreate?.customerUserErrors?.length) {
          const error = createResponse.customerCreate.customerUserErrors[0];
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

        // Log in the newly created user
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
            {
              success: true,
              isNewUser: true,
              password,
            },
            {
              headers: {
                'Set-Cookie': await tokenCookie.serialize(accessToken, {maxAge}),
              },
            },
          );
        }
      } catch (error) {
        console.error('Account creation error:', error);
        // Check for rate limit error in the exception
        if (error instanceof Error && error.message.includes('Creating Customer Limit exceeded')) {
          return json(
            {error: 'We\'re processing too many signups right now. Please try again in a few minutes.'},
            {
              status: 429,
              headers: {
                'Set-Cookie': await context.session.commit(),
              },
            },
          );
        }
        
        return json(
          {error: error instanceof Error ? error.message : 'Unknown error occurred'},
          {
            status: 400,
            headers: {
              'Set-Cookie': await context.session.commit(),
            },
          },
        );
      }
    }

    // For existing user login, we'll let the frontend handle it
    return json(
      {
        success: true,
        isNewUser: false,
      },
      {
        headers: {
          'Set-Cookie': await context.session.commit(),
        },
      },
    );

  } catch (error) {
    console.error('Social login error:', error);
    let errorMessage = 'Something went wrong during authentication.';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    
    return json(
      {error: errorMessage},
      {
        status: 400,
        headers: {
          'Set-Cookie': await context.session.commit(),
        },
      },
    );
  }
}