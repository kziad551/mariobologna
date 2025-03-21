import {LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {handleGoogleCallback} from '~/utils/googleAuth';

export async function loader({request, context}: LoaderFunctionArgs) {
  return handleGoogleCallback(request, context, context.session);
} 