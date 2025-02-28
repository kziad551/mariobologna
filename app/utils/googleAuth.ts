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
const GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token';
const GOOGLE_USERINFO_URL = 'https://www.googleapis.com/oauth2/v2/userinfo';

function generateRandomState(): string {
  const array = new Uint8Array(32); // Increased from 16 to 32 bytes for better security
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

export async function initiateGoogleAuth(request: Request, session: any, env: any) {
  try {
    // Clear ALL existing OAuth related data
    session.unset('oauth2:state');
    session.unset('oauth2:returnTo');
    session.unset('oauth2:error');
    session.unset('oauth2:token');
    
    // Generate a new state
    const state = generateRandomState();
    
    console.log('Initiating Google Auth - Generated State:', state);
    
    // Store state in session and commit immediately
    session.set('oauth2:state', state);
    
    // Store return URL
    const url = new URL(request.url);
    const returnTo = url.searchParams.get('returnTo') || '/account';
    session.set('oauth2:returnTo', returnTo);
    
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

    // Commit session BEFORE redirect
    const headers = new Headers();
    headers.append('Set-Cookie', await session.commit());

    console.log('Redirecting to Google with params:', params.toString());
    
    return redirect(`${GOOGLE_AUTH_URL}?${params.toString()}`, {
      headers,
    });
  } catch (error) {
    console.error('Error initiating Google Auth:', error);
    return redirect('/account/login?error=auth_failed&reason=initiation_error');
  }
}

export async function handleGoogleCallback(request: Request, context: any, session: any) {
  try {
    const url = new URL(request.url);
    const code = url.searchParams.get('code');
    const state = url.searchParams.get('state');
    const error = url.searchParams.get('error');
    
    // Check for OAuth error response
    if (error) {
      console.error('Google OAuth Error:', {
        error,
        error_description: url.searchParams.get('error_description'),
        error_uri: url.searchParams.get('error_uri')
      });
      return redirect('/account/login?error=auth_failed&reason=' + error);
    }
    
    // Get stored state and return URL
    const storedState = session.get('oauth2:state');
    const returnTo = session.get('oauth2:returnTo') || '/account';

    console.log('Google Callback - Full URL:', url.toString());
    console.log('Google Callback - Received State:', state);
    console.log('Google Callback - Stored State:', storedState);
    console.log('Session Data:', {
      keys: Object.keys(session),
      storedState,
      returnTo,
      cookies: request.headers.get('Cookie'),
    });

    // Verify state parameter
    if (!code || !state || !storedState || state !== storedState) {
      console.error('OAuth state verification failed:', {
        receivedState: state,
        storedState,
        hasCode: !!code,
        sessionKeys: Object.keys(session),
        requestHeaders: Object.fromEntries(request.headers),
      });
      
      // Clear OAuth state from session
      session.unset('oauth2:state');
      session.unset('oauth2:returnTo');
      session.unset('oauth2:error');
      session.unset('oauth2:token');
      
      const headers = new Headers();
      headers.append('Set-Cookie', await session.commit());
      
      return redirect('/account/login?error=auth_failed&reason=state_mismatch', {
        headers,
      });
    }

    // Clear OAuth state from session
    session.unset('oauth2:state');
    session.unset('oauth2:returnTo');
    session.unset('oauth2:error');
    session.unset('oauth2:token');
    await session.commit();

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

    const headers = new Headers();

    // Store the password in session for first-time users
    if (isNewCustomer) {
      session.set('temp_password', password);
      headers.append('Set-Cookie', await session.commit());
      headers.append('Set-Cookie', await tokenCookie.serialize(accessToken, {maxAge}));
      
      return redirect('/account/onboarding', {
        headers,
      });
    }
    
    // For existing users, redirect to returnTo URL or homepage
    headers.append('Set-Cookie', await tokenCookie.serialize(accessToken, {maxAge}));
    
    return redirect(returnTo, {
      headers,
    });
  } catch (error) {
    console.error('Google auth error:', error);
    return redirect('/account/login?error=auth_failed&reason=server_error');
  }
}

async function exchangeCodeForTokens(code: string, env: any): Promise<GoogleTokens> {
  const response = await fetch(GOOGLE_TOKEN_URL, {
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
    const error = await response.text();
    console.error('Token exchange failed:', error);
    throw new Error('Failed to exchange code for tokens');
  }

  const data = await response.json();
  return data as GoogleTokens;
}

async function getUserInfo(accessToken: string): Promise<GoogleUserInfo> {
  const response = await fetch(GOOGLE_USERINFO_URL, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const error = await response.text();
    console.error('User info fetch failed:', error);
    throw new Error('Failed to get user info');
  }

  const data = await response.json();
  return data as GoogleUserInfo;
} 