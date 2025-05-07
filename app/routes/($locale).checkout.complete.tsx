import {redirect, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {returnToCookie} from '~/utils/auth';

export async function loader({request}: LoaderFunctionArgs) {
  const cookieHeader = request.headers.get('Cookie');
  const url = new URL(request.url);
  
  // Check if this is a guest checkout return
  const isGuestRedirect = url.searchParams.get('guest_redirect') === 'true';
  
  if (isGuestRedirect) {
    // Get the return URL from the cookie
    const returnTo = await returnToCookie.parse(cookieHeader);
    
    if (returnTo) {
      // Clear the cookie and redirect to the original page
      return redirect(returnTo, {
        headers: {
          'Set-Cookie': await returnToCookie.serialize('', {maxAge: 0}),
        },
      });
    }
  }
  
  // Default fallback if no returnTo URL is found
  return redirect('/account/orders');
} 