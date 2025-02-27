import crypto from 'crypto';
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

interface GoogleTokens {
  access_token: string;
  id_token: string;
  refresh_token?: string;
  expires_in: number;
  token_type: string;
  scope: string;
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

const GOOGLE_AUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth';

export async function initiateGoogleAuth(request: Request, session: any, env: any) {
  // Generate a cryptographically secure random state
  const state = crypto.randomBytes(16).toString('hex');
  
  console.log('Initiating Google Auth - Generated State:', state);
  
  // Store state in session
  await session.setOAuthState(state);
  
  // Store return URL
  const url = new URL(request.url);
  const returnTo = url.searchParams.get('returnTo') || '/account';
  await session.set('oauth2:returnTo', returnTo);
  
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

  console.log('Redirecting to Google with params:', params.toString());

  return redirect(`${GOOGLE_AUTH_URL}?${params.toString()}`);
}

export async function handleGoogleCallback(request: Request, context: any, session: any) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  
  // Get stored state and return URL
  const storedState = await session.getOAuthState();
  const returnTo = await session.get('oauth2:returnTo') || '/account';

  console.log('Google Callback - Received State:', state);
  console.log('Google Callback - Stored State:', storedState);

  // Verify state parameter
  if (!code || !state || !storedState || state !== storedState) {
    console.error('OAuth state verification failed:', {
      receivedState: state,
      storedState,
      hasCode: !!code,
      sessionKeys: Object.keys(session),
    });
    
    // Clear OAuth state from session
    await session.clearOAuthState();
    await session.unset('oauth2:returnTo');
    
    return redirect('/account/login?error=auth_failed&reason=state_mismatch');
  }

  try {
    // Clear OAuth state from session
    await session.clearOAuthState();
    await session.unset('oauth2:returnTo');

    // Exchange code for tokens
    const tokens = await exchangeCodeForTokens(code, context.env);
    const userInfo = await getUserInfo(tokens.access_token);

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
    console.error('Google auth error:', error);
    return redirect('/account/login?error=auth_failed&reason=server_error');
  }
}

async function exchangeCodeForTokens(code: string, env: any): Promise<GoogleTokens> {
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      code,
      client_id: env.GOOGLE_CLIENT_ID,
      client_secret: env.GOOGLE_CLIENT_SECRET,
      redirect_uri: env.GOOGLE_REDIRECT_URI,
      grant_type: 'authorization_code',
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to exchange code for tokens');
  }

  const data = await response.json();
  return data as GoogleTokens;
}

async function getUserInfo(accessToken: string): Promise<GoogleUserInfo> {
  const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to get user info');
  }

  const data = await response.json();
  return data as GoogleUserInfo;
} 