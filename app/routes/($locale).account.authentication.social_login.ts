import {ActionFunctionArgs, json} from '@shopify/remix-oxygen';
import {User} from 'firebase/auth';
import {DocumentData} from 'firebase/firestore';
import invariant from 'tiny-invariant';
import {CUSTOMER_REGISTER_MUTATION} from '~/graphql/customer-account/CustomerCreateMutation';
import {CUSTOMER_LOGIN_MUTATION} from '~/graphql/customer-account/CustomerLoginMutation';
import {checkCustomerByEmail, tokenCookie} from '~/utils/auth';
import {getUserByEmail} from '~/utils/firestore';
import {updateDocumentUsingEmail} from '~/utils/firestore';

export async function action({request, context}: ActionFunctionArgs) {
  const {env, storefront} = context;
  
  try {
    const {user, isSignUp, existingPassword} = (await request.json()) as {
      user: User;
      isSignUp: boolean;
      existingPassword?: string;
    };

    console.log('Social login request:', { email: user.email, isSignUp });

    if (!user || !user.email) {
      console.error('Invalid user data:', user);
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
    
    console.log('User existence check:', { 
      hasFirebaseUser: !!userDoc, 
      hasShopifyCustomer: !!customer,
      hasStoredPassword: !!userDoc?.shopifyPassword || !!existingPassword
    });

    // For Login: User must exist in Shopify
    if (!isSignUp) {
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

      // Use existing password from Firebase or passed from frontend
      let password = existingPassword || userDoc?.shopifyPassword;
      
      if (!password) {
        // If no password stored, try to get it from the request
        console.log('No stored password found for user:', user.email);
        // Generate a new password and update it
        password = Array(16)
          .fill(0)
          .map(() => {
            const chars =
              'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join('');
          
        // Store the new password in Firebase
        try {
          await updateDocumentUsingEmail(user.email, password);
        } catch (error) {
          console.error('Failed to update password in Firebase:', error);
          // Continue with login attempt anyway
        }
      }

      // Attempt to log in with stored password
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

        console.log('Login response:', {
          hasErrors: !!loginResponse.errors?.length,
          hasUserErrors: !!loginResponse?.customerAccessTokenCreate?.customerUserErrors?.length
        });

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
        
        console.error('Login error details:', {
          errors: loginResponse.errors,
          userErrors: customerAccessTokenCreate?.customerUserErrors
        });
        
        return json(
          {error: 'Failed to sign in. Please try again.'},
          {
            status: 400,
            headers: {
              'Set-Cookie': await context.session.commit(),
            },
          },
        );
      } catch (loginError) {
        console.error('Login mutation error:', loginError);
        throw loginError;
      }
    }

    // For Signup: User must not exist in Shopify
    if (isSignUp) {
      // Double check customer doesn't exist
      const doubleCheckCustomer = await checkCustomerByEmail(user.email, env);
      if (doubleCheckCustomer) {
        console.log('Customer exists during signup, switching to login flow');
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

      // Generate password for new account
      const password = Array(16)
        .fill(0)
        .map(() => {
          const chars =
            'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
          return chars[Math.floor(Math.random() * chars.length)];
        })
        .join('');

      try {
        // Create Shopify account
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

        console.log('Create account response:', {
          hasErrors: !!createResponse.errors?.length,
          hasUserErrors: !!createResponse?.customerCreate?.customerUserErrors?.length
        });

        if (createResponse.errors?.length || createResponse?.customerCreate?.customerUserErrors?.length) {
          const error = createResponse.errors?.[0] || createResponse?.customerCreate?.customerUserErrors?.[0];
          console.error('Create account error details:', error);
          
          // Handle existing account error
          if (error.message?.includes('taken')) {
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
          
          return json(
            {error: error.message || 'Failed to create account. Please try again.'},
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
                password,
              },
            },
          },
        );

        console.log('New user login response:', {
          hasErrors: !!loginResponse.errors?.length,
          hasUserErrors: !!loginResponse?.customerAccessTokenCreate?.customerUserErrors?.length
        });

        const {customerAccessTokenCreate} = loginResponse;
        
        if (!loginResponse.errors?.length && !customerAccessTokenCreate?.customerUserErrors?.length) {
          const accessToken = customerAccessTokenCreate.customerAccessToken.accessToken;
          const expiresAt = customerAccessTokenCreate.customerAccessToken.expiresAt;
          const maxAge = Math.floor(
            (new Date(expiresAt).getTime() - Date.now()) / 1000,
          );

          return json(
            {success: true, isNewUser: true, password, customerId},
            {
              headers: {
                'Set-Cookie': await tokenCookie.serialize(accessToken, {maxAge}),
              },
            },
          );
        }

        console.error('New user login error details:', {
          errors: loginResponse.errors,
          userErrors: customerAccessTokenCreate?.customerUserErrors
        });

        return json(
          {error: 'Account created but failed to sign in. Please try logging in.'},
          {
            status: 400,
            headers: {
              'Set-Cookie': await context.session.commit(),
            },
          },
        );
      } catch (signupError) {
        console.error('Signup process error:', signupError);
        throw signupError;
      }
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
      {error: error instanceof Error ? error.message : 'Something went wrong. Please try again.'},
      {
        status: 400,
        headers: {
          'Set-Cookie': await context.session.commit(),
        },
      },
    );
  }
}
