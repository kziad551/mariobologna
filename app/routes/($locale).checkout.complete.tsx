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

export default function CheckoutComplete() {
  // This component won't render as the loader redirects,
  // but we include it for client-side tracking purposes
  if (typeof window !== 'undefined') {
    // Check URL parameters for Shopify success indicators
    const url = new URL(window.location.href);
    const isComplete = url.pathname.includes('/checkout/complete');
    const orderStatus = url.searchParams.get('checkout_completion_status');
    
    // If checkout completed successfully
    if (isComplete && (!orderStatus || orderStatus === 'success')) {
      // Get transaction data from URL if available
      const orderId = url.searchParams.get('order_id') || `order_${Date.now()}`;
      const orderAmount = url.searchParams.get('amount') || 0;
      const currency = url.searchParams.get('currency') || 'AED';
      
      // Send purchase event to GA4
      if (window.gtag) {
        window.gtag('event', 'purchase', {
          transaction_id: orderId,
          value: parseFloat(orderAmount as string),
          currency: currency,
          items: [] // Ideally would contain actual items but not available at this point
        });
      }
    }
  }
  
  return null;
} 