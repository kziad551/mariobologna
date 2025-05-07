import {redirect, type LoaderFunctionArgs} from '@shopify/remix-oxygen';

export async function loader({context, request}: LoaderFunctionArgs) {
  const {session} = context;
  
  try {
    // Check if this is a guest checkout return by looking at the session
    const isGuestCheckout = await session.get('isGuestCheckout');
    
    if (isGuestCheckout) {
      // Get the stored return URL
      const guestReturnTo = await session.get('guestReturnTo');
      
      // Clear the session values
      session.unset('guestReturnTo');
      session.unset('isGuestCheckout');
      await session.commit();
      
      if (guestReturnTo) {
        console.log('Redirecting guest checkout to:', guestReturnTo);
        // Redirect back to the original page
        return redirect(guestReturnTo);
      }
    }
  } catch (error) {
    console.error('Error processing thank-you redirect:', error);
  }
  
  // Default fallback - if we can't redirect or there's no stored URL,
  // redirect to account/orders for logged in users, or bag for guest users
  return redirect('/bag');
}

// No component needed as we're just handling redirects
export default function ThankYou() {
  return null;
} 