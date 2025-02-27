import {ActionFunctionArgs, json} from '@shopify/remix-oxygen';
import invariant from 'tiny-invariant';
import {CUSTOMER_LOGIN_MUTATION} from '~/graphql/customer-account/CustomerLoginMutation';
import {checkCustomerByEmail, tokenCookie} from '~/utils/auth';

export async function action({request, context}: ActionFunctionArgs) {
  const {storefront, env} = context;
  const {email} = (await request.json()) as {
    email: string;
  };

  try {
    const response = await checkCustomerByEmail(email as string, env);

    if (response.error) {
      return json(
        {success: false, error: response.error},
        {
          status: 400,
          headers: {
            'Set-Cookie': await context.session.commit(),
          },
        },
      );
    }
    if (response.data.length === 0) {
      return json(
        {success: false, error: 'email not found'},
        {
          status: 404,
          headers: {
            'Set-Cookie': await context.session.commit(),
          },
        },
      );
    }
    return json(
      {success: true, data: response.data[0]},
      {
        headers: {
          'Set-Cookie': await context.session.commit(),
        },
      },
    );
  } catch (error) {
    let errorMessage = 'Something went wrong while checking customer';
    if (error instanceof Error) {
      errorMessage = error.message;
    } else {
      console.log('Unknown error:', error);
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
