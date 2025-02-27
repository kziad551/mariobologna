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
  
  // Store return URL
  const url = new URL(request.url);
  const returnTo = url.searchParams.get('returnTo') || '/';
  await session.set('oauth2:returnTo', returnTo);
  
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
  
  // Get stored state and return URL
  const storedState = await session.get('oauth2:state');
  const returnTo = await session.get('oauth2:returnTo') || '/';

  // Verify state parameter
  if (!code || !state || !storedState || state !== storedState) {
    console.error('OAuth state verification failed:', {
      receivedState: state,
      storedState,
      hasCode: !!code
    });
    return redirect('/account/login?error=auth_failed');
  }

  // Clear session data
  await session.unset('oauth2:state');
  await session.unset('oauth2:returnTo');
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
      return redirect('/account/login?error=token_exchange_failed');
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
      return redirect('/account/login?error=user_info_failed');
    }

    const userInfo = await userInfoResponse.json() as GoogleUserInfo;

    // Find or create customer
    const customerResponse = await context.storefront.query(
      `query GetCustomerByEmail($email: String!) {
        customers(first: 1, query: $email) {
          edges {
            node {
              id
              email
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

    let customerId;
    
    if (customerResponse.customers.edges.length === 0) {
      // Create new customer
      const createResponse = await context.storefront.mutate(
        CUSTOMER_REGISTER_MUTATION,
        {
          variables: {
            input: {
              email: userInfo.email,
              firstName: userInfo.given_name,
              lastName: userInfo.family_name,
            },
          },
        },
      );
      
      customerId = createResponse.customerCreate.customer.id;
    } else {
      customerId = customerResponse.customers.edges[0].node.id;
    }

    // Create access token
    const tokenResult = await context.storefront.mutate(
      CUSTOMER_LOGIN_MUTATION,
      {
        variables: {
          input: {
            email: userInfo.email,
          },
        },
      },
    );

    const {accessToken, expiresAt} = tokenResult.customerAccessTokenCreate.customerAccessToken;

    // Set token in cookie
    const maxAge = Math.floor((new Date(expiresAt).getTime() - Date.now()) / 1000);
    
    return redirect(returnTo, {
      headers: {
        'Set-Cookie': await tokenCookie.serialize(accessToken, {maxAge}),
      },
    });
  } catch (error) {
    console.error('OAuth flow failed:', error);
    return redirect('/account/login?error=oauth_flow_failed');
  }
} 