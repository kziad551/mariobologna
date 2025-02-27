import {LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {handleGoogleCallback} from '~/utils/googleAuth';
import {redirect} from '@shopify/remix-oxygen';

export async function loader({request, context}: LoaderFunctionArgs) {
  try {
    return await handleGoogleCallback(request, context, context.session);
  } catch (error) {
    console.error('Google OAuth Error:', error);
    return redirect('/account/login?error=auth_failed');
  }
} 