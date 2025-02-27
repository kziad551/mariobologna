import {ActionFunctionArgs, json} from '@remix-run/server-runtime';
import {MailingAddressInput} from '@shopify/hydrogen/storefront-api-types';
import invariant from 'tiny-invariant';
import {
  addNewAddress,
  tokenCookie,
  updateAddress,
  verifyToken,
} from '~/utils/auth';

export async function action({request, context, params}: ActionFunctionArgs) {
  const {storefront} = context;
  const body = (await request.json()) as any;
  const cookieHeader = request.headers.get('Cookie');

  const token: string | null = await tokenCookie.parse(cookieHeader);
  if (!token) {
    return json('/account/login');
  }

  const customerID = await verifyToken(token, storefront);
  if (!customerID) {
    return json('/account/login', {
      headers: {
        'Set-Cookie': await tokenCookie.serialize('', {maxAge: 0}),
      },
    });
  }

  const addressId = body.addressId;
  try {
    invariant(typeof addressId === 'string', 'You must provide an address id.');
  } catch (error: any) {
    console.log('error', error);
    return json(
      {formError: error.message},
      {
        status: 400,
        headers: {
          'Set-Cookie': await context.session.commit(),
        },
      },
    );
  }

  if (request.method === 'DELETE') {
    const DELETE_ADDRESS_MUTATION = `#graphql
    mutation RouteCustomerAddressDelete($addressId: ID!, $token: String!) {
      customerAddressDelete(customerAccessToken: $token, id: $addressId) {
        deletedCustomerAddressId
        customerUserErrors {
          code
          field
          message
        }
      }
    }
    ` as const;

    try {
      const response = await storefront.mutate(DELETE_ADDRESS_MUTATION, {
        variables: {
          addressId,
          token,
        },
      });

      invariant(!response.errors?.length, response.errors?.[0]?.message);

      invariant(
        !response?.customerAddressDelete?.customerUserErrors?.length,
        response?.customerAddressDelete?.customerUserErrors?.[0]?.message,
      );

      return json(
        {success: true},
        {
          headers: {
            'Set-Cookie': await context.session.commit(),
          },
        },
      );
    } catch (error) {
      let errorMessage = 'Something went wrong while adding new address';
      if (error instanceof Error) {
        errorMessage = error.message;
      } else {
        console.log('Unknown error:', error);
      }
      return json(
        {formError: errorMessage},
        {
          status: 400,
          headers: {
            'Set-Cookie': await context.session.commit(),
          },
        },
      );
    }
  }
  const address: MailingAddressInput = {};

  const keys: (keyof MailingAddressInput)[] = [
    'firstName',
    'lastName',
    'company',
    'address1',
    'address2',
    'city',
    'country',
    'zip',
    'phone',
  ];

  for (const key of keys) {
    const value = body[key];
    if (typeof value === 'string') {
      address[key] = value;
    }
  }
  // address.country = body.country.name;
  if (addressId === 'add') {
    try {
      const response = await addNewAddress(token, storefront, address);
      if (typeof response === 'string') {
        return json(
          {formError: response},
          {
            status: 400,
            headers: {
              'Set-Cookie': await context.session.commit(),
            },
          },
        );
      }

      invariant(!response.errors?.length, response.errors?.[0]?.message);

      invariant(
        !response?.customerAddressCreate?.customerUserErrors?.length,
        response?.customerAddressCreate?.customerUserErrors?.[0]?.message,
      );

      return json(
        {
          success: true,
          insertedId: response.customerAddressCreate?.customerAddress
            ?.id as string,
        },
        {
          headers: {
            'Set-Cookie': await context.session.commit(),
          },
        },
      );
    } catch (error: any) {
      console.log('error', error);
      return json(
        {formError: error.message},
        {
          status: 400,
          headers: {
            'Set-Cookie': await context.session.commit(),
          },
        },
      );
    }
  } else {
    try {
      const response = await updateAddress(
        token,
        storefront,
        address,
        body.addressId,
        body.isDefaultAddress,
      );
      if (typeof response === 'string') {
        return json(
          {formError: response},
          {
            status: 400,
            headers: {
              'Set-Cookie': await context.session.commit(),
            },
          },
        );
      }

      invariant(!response.errors?.length, response.errors?.[0]?.message);
      invariant(
        !response?.customerAddressUpdate?.customerUserErrors?.length,
        response?.customerAddressUpdate?.customerUserErrors?.[0]?.message,
      );

      return json(
        {success: true},
        {
          headers: {
            'Set-Cookie': await context.session.commit(),
          },
        },
      );
    } catch (error: any) {
      console.log('error', error);
      return json(
        {formError: error.message},
        {
          status: 400,
          headers: {
            'Set-Cookie': await context.session.commit(),
          },
        },
      );
    }
  }
}
