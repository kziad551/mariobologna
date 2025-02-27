import type {LoaderFunctionArgs} from '@shopify/remix-oxygen';

export async function loader({request, context}: LoaderFunctionArgs) {
  console.log('LOGIN STARTED');
  return context.customerAccount.login();
}
