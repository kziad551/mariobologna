import {json} from '@shopify/remix-oxygen';
import { tokenCookie } from '~/utils/auth';

export async function action() {
  return json(
    {success: true},
    {
      headers: {
        'Set-Cookie': await tokenCookie.serialize('', {maxAge: 0}),
      },
    },
  );
}
