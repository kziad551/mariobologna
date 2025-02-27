import {ActionFunctionArgs, json} from '@shopify/remix-oxygen';
import {resetCustomerPassword} from '~/utils/auth';

export async function action({request, context}: ActionFunctionArgs) {
  const {storefront, env} = context;
  const {id, password, confirmPassword} = (await request.json()) as {
    id: string;
    password: string;
    confirmPassword: string;
  };

  try {
    const response = await resetCustomerPassword(
      id,
      password,
      confirmPassword,
      env,
    );
    console.log('response', response);

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
    return json(
      {success: true},
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
