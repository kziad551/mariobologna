import {ActionFunctionArgs, json} from '@shopify/remix-oxygen';
import {CUSTOMER_LOGIN_MUTATION} from '~/graphql/customer-account/CustomerLoginMutation';
import {tokenCookie} from '~/utils/auth';

export async function action({request, context}: ActionFunctionArgs) {
  const {email, password} = (await request.json()) as {
    email: string;
    password: string;
  };

  const response = await context.storefront.mutate(CUSTOMER_LOGIN_MUTATION, {
    variables: {
      input: {
        email,
        password,
      },
    },
  });

  const {customerAccessTokenCreate} = response;

  if (customerAccessTokenCreate.customerUserErrors.length > 0) {
    console.log(
      'customerAccessTokenCreate.customerUserErrors',
      customerAccessTokenCreate.customerUserErrors,
    );
    return json(
      {error: customerAccessTokenCreate.customerUserErrors[0].message},
      {status: 401},
    );
  }

  const {accessToken, expiresAt} =
    customerAccessTokenCreate.customerAccessToken;

  const maxAge = Math.floor(
    (new Date(expiresAt).getTime() - Date.now()) / 1000,
  );

  // Set the token in an HTTP-only cookie
  return json(
    {success: true},
    {
      headers: {
        'Set-Cookie': await tokenCookie.serialize(accessToken, {maxAge}),
      },
    },
  );
}
