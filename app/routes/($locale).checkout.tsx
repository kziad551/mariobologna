import {redirect, type LoaderFunctionArgs} from '@shopify/remix-oxygen';

export async function loader({request}: LoaderFunctionArgs) {
  const url = new URL(request.url);
  
  // Check for guest checkout parameter
  const guestRedirect = url.searchParams.get('guest_redirect') === 'true';
  
  // Redirect to our completion handler with the same guest_redirect parameter
  return redirect(`/checkout/complete?guest_redirect=${guestRedirect ? 'true' : 'false'}`);
} 