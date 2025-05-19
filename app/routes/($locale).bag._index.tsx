import {defer, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {
  Await,
  useLoaderData,
  type MetaFunction,
  NavLink,
} from '@remix-run/react';
import {Suspense, useEffect, useState} from 'react';
import useWindowDimensions from '~/hooks/useWindowDimensions';
import {useCustomContext} from '~/contexts/App';
import {CartForm, Money} from '@shopify/hydrogen';
import {FloatLabel} from 'primereact/floatlabel';
import {InputText} from 'primereact/inputtext';
import BagSection from '~/components/BagSection';
import {ProductsSection} from '~/components/ProductsSection';
import {useTranslation} from 'react-i18next';
import {OTHER_COLLECTION_QUERY} from '~/lib/queries';
import {tokenCookie} from '~/utils/auth';
import {
  CountryCode,
  CurrencyCode,
} from '@shopify/hydrogen/storefront-api-types';

// Define gtag on window
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}

export const meta: MetaFunction = () => {
  return [{title: 'Bag'}];
};

export async function loader({context, request}: LoaderFunctionArgs) {
  const {storefront} = context;
  const cookieHeader = request.headers.get('Cookie');
  let country: CountryCode = 'AE';
  if (cookieHeader) {
    const match = cookieHeader.match(/country=([^;]+)/);
    if (match) {
      try {
        // Parse the JSON string back into an object
        country = JSON.parse(decodeURIComponent(match[1])) as CountryCode;
      } catch (error) {
        console.error('Error parsing country cookie:', error);
      }
    }
  }
  const cart = await context.cart.get();
  const {collection: youMayAlsoLikeProducts} = await storefront.query(
    OTHER_COLLECTION_QUERY,
    {
      variables: {country, handle: 'recommended-products', first: 4},
    },
  );
  const token = await tokenCookie.parse(cookieHeader);

  return defer({
    cart,
    youMayAlsoLikeProducts,
    isLoggedIn: typeof token === 'string',
  });
}

export default function Bag() {
  const {t} = useTranslation();
  const {setCurrentPage, direction, currency} = useCustomContext();
  const {height, width} = useWindowDimensions(50);
  const {cart, youMayAlsoLikeProducts, isLoggedIn} =
    useLoaderData<typeof loader>();
  const [discountCode, setDiscountCode] = useState('');
  const [loadingDiscount, setLoadingDiscount] = useState(false);

  useEffect(() => {
    setCurrentPage('Shopping Bag');
  }, []);

  const submitDiscountCode = async ({cartId}: {cartId: string}) => {
    setLoadingDiscount(true);
    // setErrorMessage('');
    // setSuccessMessage('');

    try {
      const response = await fetch('/api/bag/discount_code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({cartId, discountCode}),
      });

      const data = await response.json();
      console.log('data', data);

      if (response.ok) {
        // setSuccessMessage('Discount code applied successfully!');
      } else {
        // setErrorMessage(
        //   data.error || 'An error occurred while applying the discount.',
        // );
      }
    } catch (error) {
      console.log('error', error);
      // setErrorMessage('An unexpected error occurred.');
    } finally {
      setLoadingDiscount(false);
    }
  };

  // Function to trigger GA4 begin_checkout event
  const handleCheckoutClick = () => {
    if (typeof window !== 'undefined' && window.gtag && cart) {
      // Prepare cart items for GA4
      const items = cart.lines?.nodes.map(line => ({
        item_id: line.merchandise.id.split('/').pop() || '',
        item_name: line.merchandise.product?.title || '',
        quantity: line.quantity,
        price: parseFloat(line.cost?.amountPerQuantity?.amount || '0'),
        currency: currency.currency['en']
      })) || [];

      // Send begin_checkout event
      window.gtag('event', 'begin_checkout', {
        currency: currency.currency['en'],
        value: parseFloat(cart.cost.totalAmount.amount),
        items: items,
      });

      console.log('GA4 begin_checkout event sent from bag page:', {
        value: parseFloat(cart.cost.totalAmount.amount),
        items_count: items.length
      });
    }
  };
  
  return (
    <div className="bag">
      <div className="pt-12 px-0 sm:px-4 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-45.5">
          <BagSection t={t} cart={cart} showBagTitle={width >= 1024} />
          {cart && cart.lines && cart.lines.nodes.length > 0 && (
            <div className="flex flex-col items-stretch justify-start flex-1 px-4 lg:px-0 max-w-134.5">
              <h2 className="sm:text-2xl mb-8">{t('Order Summary')}</h2>
              <div className="flex items-center justify-between gap-4">
                <p className="sm:text-2xl">{t('Item Subtotal')}</p>
                <Money
                  className="sm:text-2xl"
                  data={{
                    amount: (
                      parseFloat(cart.cost.subtotalAmount.amount) *
                      currency.exchange_rate
                    ).toString(),
                    currencyCode: currency.currency['en'] as CurrencyCode,
                  }}
                />
              </div>
              {cart.cost.totalTaxAmount ? (
                <>
                  <div className="my-4 h-0.25 bg-primary-P-40"></div>
                  <div className="flex items-center justify-between gap-4">
                    <p className="sm:text-2xl">{t('Total Tax')}</p>
                    <Money
                      className="sm:text-2xl"
                      data={{
                        amount: (
                          parseFloat(cart.cost.totalTaxAmount.amount) *
                          currency.exchange_rate
                        ).toString(),
                        currencyCode: currency.currency['en'] as CurrencyCode,
                      }}
                    />
                  </div>
                </>
              ) : (
                <></>
              )}
              <div className="my-4 h-0.25 bg-primary-P-40"></div>
              <div className="flex items-center justify-between gap-4">
                <p className="sm:text-2xl">{t('Total')}</p>
                <Money
                  className="sm:text-2xl"
                  data={{
                    amount: (
                      parseFloat(cart.cost.totalAmount.amount) *
                      currency.exchange_rate
                    ).toString(),
                    currencyCode: currency.currency['en'] as CurrencyCode,
                  }}
                />
              </div>
              <div
                className={`${direction === 'rtl' ? 'rtl-container' : ''} flex mt-6 mb-10 sm:mt-8.5 sm:mb-12`}
              >
                <FloatLabel>
                  <InputText
                    id="discount_code"
                    type="text"
                    value={discountCode}
                    onChange={(e) => setDiscountCode(e.target.value)}
                    className="!bg-transparent p-2 xs:p-4 w-full rounded border border-neutral-N-50 focus:shadow-none focus:outline-none"
                  />
                  <label
                    className="text-sm xs:text-base !leading-none ml-2 -mt-2"
                    htmlFor="discount_code"
                  >
                    {t('Gift card discount code')}
                  </label>
                </FloatLabel>
                <CartForm
                  route="/cart" // This is the route for cart updates
                  action={CartForm.ACTIONS.DiscountCodesUpdate} // Action for updating discount codes
                  inputs={{
                    discountCodes: [discountCode], // Shopify expects an array of discount codes
                  }}
                >
                  <button
                    disabled={loadingDiscount}
                    type="submit"
                    className="p-2 xs:p-4 rounded border border-neutral-N-50 text-primary-P-40"
                    // onClick={() => submitDiscountCode({cartId: cart.id})}
                  >
                    {loadingDiscount ? t('Applying...') : t('Apply')}
                  </button>
                </CartForm>
              </div>
              <div className="flex flex-col items-stretch justify-start">
                <NavLink
                  to={isLoggedIn ? cart.checkoutUrl : '/bag/checkout?guest=true'}
                  className="px-6 py-2.5 text-center text-sm font-medium bg-primary-P-40 text-white rounded-lg border border-transparent"
                  onClick={handleCheckoutClick}
                >
                  {isLoggedIn ? t('Buy Now') : t('Checkout')}
                </NavLink>
                <div className="flex flex-wrap items-center justify-start gap-6 mt-3 mb-4">
                  <img className="" src="/icons/payments/visa_card.svg" />
                  <img className="" src="/icons/payments/paypal.svg" />
                  <img className="" src="/icons/payments/master_card.svg" />
                  <img className="" src="/icons/payments/google_pay.svg" />
                  <img className="" src="/icons/payments/apple_pay.svg" />
                  <img
                    className=""
                    src="/icons/payments/american_express.svg"
                  />
                </div>
                <div className="flex flex-col gap-2 text-sm">
                  <span>{t('Free shipping')}</span>
                </div>
                <div className="flex flex-col items-start mt-5 gap-2">
                  <p className="font-medium text-xl">{t('Disclaimer')}</p>
                  <div className="flex flex-col text-sm gap-1">
                    <p>{t('disclaimer_one')}</p>
                    <p>{t('disclaimer_two')}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        {youMayAlsoLikeProducts &&
        youMayAlsoLikeProducts.products.nodes.length > 0 ? (
          <ProductsSection
            t={t}
            direction={direction}
            title={t('You May Also Like')}
            viewAllLink={youMayAlsoLikeProducts?.handle}
            width={width}
            height={height}
            products={youMayAlsoLikeProducts?.products.nodes}
            containerClassName="px-4 sm:px-0"
          />
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}
