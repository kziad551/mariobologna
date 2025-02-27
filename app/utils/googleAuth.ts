import {redirect} from '@shopify/remix-oxygen';
import {CUSTOMER_REGISTER_MUTATION} from '~/graphql/customer-account/CustomerCreateMutation';
import {CUSTOMER_LOGIN_MUTATION} from '~/graphql/customer-account/CustomerLoginMutation';
import {tokenCookie} from '~/utils/auth';

declare global {
  interface Env {
    GOOGLE_CLIENT_ID: string;
    GOOGLE_CLIENT_SECRET: string;
    GOOGLE_REDIRECT_URI: string;
  }
}

const GOOGLE_AUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth';
const GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token';

interface GoogleTokenResponse {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
  token_type: string;
}

interface GoogleUserInfo {
  id: string;
  email: string;
  verified_email: boolean;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  locale: string;
}

export async function initiateGoogleAuth(request: Request, session: any, env: any) {
  // Generate a random state
  const state = Math.random().toString(36).substring(7);
  
  // Store state in session
  await session.set('oauth2:state', state);
  
  // Store return URL and mode (login/signup)
  const url = new URL(request.url);
  const returnTo = url.searchParams.get('returnTo') || '/';
  const mode = url.pathname.includes('signup') ? 'signup' : 'login';
  await session.set('oauth2:returnTo', returnTo);
  await session.set('oauth2:mode', mode);
  
  // Make sure to commit session changes
  await session.commit();

  // Build OAuth URL with state
  const params = new URLSearchParams({
    client_id: env.GOOGLE_CLIENT_ID,
    redirect_uri: env.GOOGLE_REDIRECT_URI,
    response_type: 'code',
    scope: 'email profile',
    state,
    access_type: 'offline',
    prompt: 'consent',
  });

  return redirect(`${GOOGLE_AUTH_URL}?${params.toString()}`);
}

export async function handleGoogleCallback(request: Request, context: any, session: any) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  
  // Get stored state, return URL and mode
  const storedState = await session.get('oauth2:state');
  const returnTo = await session.get('oauth2:returnTo') || '/';
  const mode = await session.get('oauth2:mode') || 'login';

  // Verify state parameter
  if (!code || !state || !storedState || state !== storedState) {
    console.error('OAuth state verification failed:', {
      receivedState: state,
      storedState,
      hasCode: !!code
    });
    return redirect('/account/login?error=auth_failed&reason=state_mismatch');
  }

  // Clear session data
  await session.unset('oauth2:state');
  await session.unset('oauth2:returnTo');
  await session.unset('oauth2:mode');
  await session.commit();

  try {
    // Exchange code for tokens
    const tokenResponse = await fetch(GOOGLE_TOKEN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        code,
        client_id: context.env.GOOGLE_CLIENT_ID,
        client_secret: context.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: context.env.GOOGLE_REDIRECT_URI,
        grant_type: 'authorization_code',
      }),
    });

    if (!tokenResponse.ok) {
      console.error('Token exchange failed:', await tokenResponse.text());
      return redirect('/account/login?error=auth_failed&reason=token_exchange');
    }

    const tokens = await tokenResponse.json() as GoogleTokenResponse;

    // Get user info
    const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        Authorization: `Bearer ${tokens.access_token}`,
      },
    });

    if (!userInfoResponse.ok) {
      console.error('User info fetch failed:', await userInfoResponse.text());
      return redirect('/account/login?error=auth_failed&reason=user_info');
    }

    const userInfo = await userInfoResponse.json() as GoogleUserInfo;

    // Find existing customer
    const customerResponse = await context.storefront.query(
      `query GetCustomerByEmail($email: String!) {
        customers(first: 1, query: $email) {
          edges {
            node {
              id
              email
              firstName
              lastName
            }
          }
        }
      }`,
      {
        variables: {
          email: userInfo.email,
        },
      },
    );

    const existingCustomer = customerResponse.customers.edges[0]?.node;

    // Handle login mode
    if (mode === 'login') {
      if (!existingCustomer) {
        return redirect('/account/login?error=auth_failed&reason=no_account');
      }
    }
    // Handle signup mode
    else if (mode === 'signup') {
      if (existingCustomer) {
        return redirect('/account/login?error=auth_failed&reason=account_exists');
      }
    }

    let customerId;
    let password;
    let isNewCustomer = false;
    
    if (!existingCustomer) {
      isNewCustomer = true;
      // Generate a consistent password based on user's Google ID
      password = `Google-${userInfo.id}-${Math.random().toString(36).slice(-12)}`;
      
      // Create new customer
      const createResponse = await context.storefront.mutate(
        CUSTOMER_REGISTER_MUTATION,
        {
          variables: {
            input: {
              email: userInfo.email,
              password: password,
              firstName: userInfo.given_name,
              lastName: userInfo.family_name,
              acceptsMarketing: true,
            },
          },
        },
      );

      if (createResponse.customerCreate?.customerUserErrors?.length > 0) {
        console.error('Customer creation failed:', createResponse.customerCreate.customerUserErrors);
        return redirect('/account/login?error=auth_failed&reason=customer_creation');
      }
      
      customerId = createResponse.customerCreate.customer.id;
    } else {
      customerId = existingCustomer.id;
      password = `Google-${userInfo.id}-${Math.random().toString(36).slice(-12)}`;
      
      // Update customer password for Google login
      try {
        await context.storefront.mutate(
          `mutation customerReset($id: ID!, $input: CustomerResetInput!) {
            customerReset(id: $id, input: $input) {
              customerAccessToken {
                accessToken
                expiresAt
              }
              customerUserErrors {
                code
                field
                message
              }
            }
          }`,
          {
            variables: {
              id: customerId,
              input: {
                password: password,
                resetToken: tokens.access_token
              }
            }
          }
        );
      } catch (error) {
        console.error('Failed to update customer password:', error);
      }
    }

    // Create access token
    const tokenResult = await context.storefront.mutate(
      CUSTOMER_LOGIN_MUTATION,
      {
        variables: {
          input: {
            email: userInfo.email,
            password: password,
          },
        },
      },
    );

    if (tokenResult.customerAccessTokenCreate?.customerUserErrors?.length > 0) {
      console.error('Token creation failed:', tokenResult.customerAccessTokenCreate.customerUserErrors);
      return redirect('/account/login?error=auth_failed&reason=token_creation');
    }

    const {accessToken, expiresAt} = tokenResult.customerAccessTokenCreate.customerAccessToken;

    // Set token in cookie
    const maxAge = Math.floor((new Date(expiresAt).getTime() - Date.now()) / 1000);
    
    // Store the password in session for first-time users
    if (isNewCustomer) {
      await session.set('temp_password', password);
      await session.commit();
      
      return redirect('/account/onboarding', {
        headers: {
          'Set-Cookie': await tokenCookie.serialize(accessToken, {maxAge}),
        },
      });
    }
    
    // For existing users, redirect to returnTo URL or homepage
    return redirect(returnTo, {
      headers: {
        'Set-Cookie': await tokenCookie.serialize(accessToken, {maxAge}),
      },
    });
  } catch (error) {
    console.error('OAuth flow failed:', error);
    return redirect('/account/login?error=auth_failed&reason=oauth_flow');
  }
} 