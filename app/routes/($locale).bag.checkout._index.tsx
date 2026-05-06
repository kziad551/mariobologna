import {defer, redirect, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {useLoaderData, useNavigate, type MetaFunction} from '@remix-run/react';
import {useEffect} from 'react';
import {useCustomContext} from '~/contexts/App';
import {fetchCustomerDetails, tokenCookie, returnToCookie} from '~/utils/auth';
import {useTranslation} from 'react-i18next';
import type {CartLineInput} from '@shopify/hydrogen/storefront-api-types';
import {resolveCountry} from '~/lib/utils';

export const meta: MetaFunction = () => {
  return [{title: 'Checkout'}];
};

export async function loader({context, request}: LoaderFunctionArgs) {
  const {storefront, cart, session} = context;
  const url = new URL(request.url);
  const isGuest = url.searchParams.get('guest') === 'true';
  const isGuestCheckout = url.searchParams.get('is_guest_checkout') === 'true';
  const returnTo = url.searchParams.get('returnTo');
  const pendingLines = url.searchParams.get('pendingLines');
  
  const cookieHeader = request.headers.get('Cookie');
  const countryCode = resolveCountry(cookieHeader);

  // Handle pending checkout lines from Buy Now if present
  if (pendingLines) {
    try {
      const lines = JSON.parse(decodeURIComponent(pendingLines)) as {
        merchandiseId: string;
        quantity: number;
      }[];

      // Create a new cart bound to the user's market so checkout
      // doesn't fall back to a market where products aren't published.
      const result = await cart.create({
        lines,
        buyerIdentity: {countryCode},
      });

      const createdCart = result?.cart;
      if (createdCart?.id && createdCart.checkoutUrl) {
        const headers = cart.setCartId(createdCart.id);
        if ((isGuest || isGuestCheckout) && returnTo) {
          session.set('guestReturnTo', returnTo);
          session.set('isGuestCheckout', true);
        }
        headers.append('Set-Cookie', await session.commit());

        const checkoutUrl = new URL(createdCart.checkoutUrl);
        checkoutUrl.searchParams.set('redirect_url', '/thank-you');
        return redirect(checkoutUrl.toString(), {headers});
      }
    } catch (error) {
      console.error('Error creating cart from pending lines:', error);
      // Fall through to the existing-cart path
    }
  }

  const currentCart = await cart.get();

  // If cart is empty, redirect to bag page
  if (!currentCart || currentCart.lines.nodes.length === 0) {
    return redirect('/bag');
  }

  const token = await tokenCookie.parse(cookieHeader);
  
  // For logged-in users, go directly to the cart checkout URL
  if (token && !isGuest) {
    const customer = await fetchCustomerDetails(token, storefront);
    if (customer) {
      return redirect(currentCart.checkoutUrl);
    }
    
    // If token is invalid, clear it
    return defer({
      cart: currentCart,
      customer: null
    }, {
      headers: {
        'Set-Cookie': await tokenCookie.serialize('', {maxAge: 0}),
      },
    });
  }
  
  // For guest users, handle returnTo parameter if present
  if ((isGuest || isGuestCheckout) && returnTo) {
    // Store the returnTo URL in the session
    session.set('guestReturnTo', returnTo);
    session.set('isGuestCheckout', true);
    await session.commit();
    
    // Modify the checkout URL to add our redirect_url parameter
    let checkoutUrl = new URL(currentCart.checkoutUrl);
    checkoutUrl.searchParams.append('redirect_url', '/thank-you');
    
    // Redirect to the modified checkout URL
    return redirect(checkoutUrl.toString());
  }
  
  // For guest users without returnTo, also redirect to checkout URL
  return redirect(currentCart.checkoutUrl);
}

export default function BagCheckout() {
  const {setCurrentPage} = useCustomContext();
  const {t} = useTranslation();
  const {cart} = useLoaderData<typeof loader>();
  const navigate = useNavigate();

  useEffect(() => {
    setCurrentPage('Checkout');
    
    // In case the redirect doesn't happen at loader level
    if (cart?.checkoutUrl) {
      window.location.href = cart.checkoutUrl;
    } else {
      navigate('/bag');
    }
  }, []);

  // This should rarely render as we're redirecting in the loader
  return (
    <div className="bag-checkout">
      <div className="pt-24 px-8 text-center">
        <p>{t('Redirecting to checkout...')}</p>
      </div>
    </div>
  );
}
