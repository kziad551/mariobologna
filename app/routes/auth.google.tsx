import {LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {initiateGoogleAuth} from '~/utils/googleAuth';

export async function loader({request, context}: LoaderFunctionArgs) {
  return initiateGoogleAuth(request, context.session, context.env);
} 