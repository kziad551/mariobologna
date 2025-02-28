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
    const {user, userDoc} = (await request.json()) as {
      user: User;
      userDoc: DocumentData | null;
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

    // Check if the user exists in your system
    const customer = await checkCustomerByEmail(user.email, env);

    let isNewUser = !customer;
    let accessToken = null;
    let expiresAt = null;
    let password = Math.random().toString(36).slice(-8);
    let success = false;

    if (isNewUser) {
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
      invariant(
        !createUserResponse.errors?.length,
        createUserResponse.errors?.[0]?.message,
      );
      invariant(
        !createUserResponse?.customerCreate?.customerUserErrors?.length,
        createUserResponse?.customerCreate?.customerUserErrors?.[0]?.message,
      );

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

      invariant(
        !loginResponse.errors?.length,
        loginResponse.errors?.[0]?.message,
      );
      invariant(
        !customerAccessTokenCreate?.customerUserErrors?.length,
        customerAccessTokenCreate?.customerUserErrors?.[0]?.message,
      );

      accessToken = customerAccessTokenCreate.customerAccessToken.accessToken;
      expiresAt = customerAccessTokenCreate.customerAccessToken.expiresAt;

      const maxAge = Math.floor(
        (new Date(expiresAt).getTime() - Date.now()) / 1000,
      );

      success = true;

      return json(
        {success, isNewUser, password},
        {
          headers: {
            'Set-Cookie': await tokenCookie.serialize(accessToken, {maxAge}),
          },
        },
      );
    }

    return json(
      {success: true, isNewUser},
      {
        headers: {
          'Set-Cookie': await context.session.commit(),
        },
      },
    );

  } catch (error: any) {
    console.error('error', error);
    return json(
      {error: error.message || 'Something went wrong'},
      {
        status: 400,
        headers: {
          'Set-Cookie': await context.session.commit(),
        },
      },
    );
  }
}
