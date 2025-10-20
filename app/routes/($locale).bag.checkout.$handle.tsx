import {defer, redirect, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {NavLink, useLoaderData, type MetaFunction} from '@remix-run/react';
import {useEffect} from 'react';
import useWindowDimensions from '~/hooks/useWindowDimensions';
import {useCustomContext} from '~/contexts/App';
import {Money} from '@shopify/hydrogen';
import BagSection from '~/components/BagSection';
import {FaCheck, FaTruckFast} from 'react-icons/fa6';
import {OTHER_COLLECTION_QUERY} from '~/lib/queries';
import {resolveCountry} from '~/lib/utils';
import {useTranslation} from 'react-i18next';
import {ProductsSection} from '~/components/ProductsSection';
import {CountryCode} from '@shopify/hydrogen/storefront-api-types';

export const meta: MetaFunction = () => {
  return [{title: 'Checkout'}];
};

export async function loader({context, params, request}: LoaderFunctionArgs) {
  const {handle} = params;

  if (!handle) {
    return redirect('/bag');
  }

  const {storefront, cart} = context;
  const cartPromise = await cart.get();
  const cookies = request.headers.get('Cookie');
  const country = resolveCountry(cookies);

  const {collection: moreItemsFromMarioBologna} = await storefront.query(
    OTHER_COLLECTION_QUERY,
    {
      variables: {country, handle: 'recommended-products', first: 4},
    },
  );

  return defer({cart: cartPromise, handle, moreItemsFromMarioBologna});
}

export default function CheckoutConfirmation() {
  const {t} = useTranslation();
  const {setCurrentPage, language, direction} = useCustomContext();
  const {height, width} = useWindowDimensions(50);
  const {cart, handle, moreItemsFromMarioBologna} =
    useLoaderData<typeof loader>();

  useEffect(() => {
    setCurrentPage(handle);
  }, []);
  return (
    <div className={`bag-checkout-${handle}`}>
      <div className="pt-14 px-8 flex flex-col items-center justify-start">
        <div className="max-w-181.75 mb-33">
          <div className="flex flex-col gap-4 mb-36">
            <h1 className="text-5xl font-semibold">
              {t('Your Order Is Confirmed')}
            </h1>
            <h3 className="text-2xl">{t('Thank You For Your Order!')}</h3>
            <p className="text-2xl">
              {t(
                'We have received your order and will contact you as soon as your package is shipped. You can find your purchase information below.',
              )}
            </p>
          </div>
          <div className="flex items-center justify-center w-full gap-5">
            <FaCheck className="w-10 h-10 rounded-full bg-primary-P-40 text-white p-2" />
            <div className="h-0.25 bg-neutral-N-80 flex-1"></div>
            <FaTruckFast className="w-10 h-10 rounded-full bg-primary-P-40/10 text-white p-2" />
            <div className="h-0.25 bg-neutral-N-80 flex-1"></div>
            <FaCheck className="w-10 h-10 rounded-full bg-primary-P-40/10 text-white p-2" />
          </div>
          <NavLink
            to="/account/orders"
            className="block w-full text-center bg-primary-P-40 text-white border border-transparent font-medium text-sm rounded-md px-6 py-2.5 mt-14 mb-24"
          >
            {t('Track Order')}
          </NavLink>
          <div className="w-full">
            <BagSection t={t} cart={cart} showEditSection={false} />
            {cart && cart.lines && cart.lines.nodes.length > 0 && (
              <div className="self-stretch max-w-181.75 flex flex-col items-stretch justify-start border-t border-t-neutral-N-80 pt-15">
                <div className="flex items-center justify-between gap-4 mb-8">
                  <h2 className="text-2xl font-semibold">
                    {t('Shipping Cost')}
                  </h2>
                  {cart.cost.checkoutChargeAmount ? (
                    <Money
                      className="text-2xl"
                      data={cart.cost.checkoutChargeAmount}
                    />
                  ) : (
                    <Money
                      className="text-2xl"
                      data={{
                        amount: '0',
                        currencyCode: cart.cost.totalAmount.currencyCode,
                      }}
                    />
                  )}
                </div>
                <div className="flex items-center justify-between gap-4">
                  <p className="text-2xl font-semibold">{t('Tax')}</p>
                  {cart.cost.totalTaxAmount ? (
                    <Money
                      className="text-2xl"
                      data={cart.cost.totalTaxAmount}
                    />
                  ) : (
                    <Money
                      className="text-2xl"
                      data={{
                        amount: '0',
                        currencyCode: cart.cost.totalAmount.currencyCode,
                      }}
                    />
                  )}
                </div>
                <div className="my-4 h-0.25 bg-primary-P-40"></div>
                <div className="flex items-center justify-between gap-4">
                  <p className="text-2xl font-semibold">{t('Total')}</p>
                  <Money className="text-2xl" data={cart.cost.totalAmount} />
                </div>
              </div>
            )}
          </div>
          <div className="mt-29 flex flex-col gap-4">
            <h2 className="text-3xl font-medium">{t('Billing & Shipping')}</h2>
            <div className="flex items-start justify-between gap-13.5">
              <div className="flex-1 flex flex-col gap-2">
                <h4 className="text-xl">{t('Billing Address')}</h4>
                <div className="flex flex-col gap-1">
                  <p>{t('Street')} Hasan Khaled</p>
                  <p>{t('Postal Code')}: 123456</p>
                  <p>{t('City')}: Jeddah</p>
                </div>
              </div>
              <div className="flex-1 flex flex-col gap-2">
                <h4 className="text-xl">{t('Payment Method')}</h4>
                <div className="flex flex-col gap-1">
                  <p>
                    {t('COD')}
                    {language === 'en' ? '(Cash on Delivery)' : ''}
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <h4 className="text-xl">{t('Shipping Method')}</h4>
                <div className="flex flex-col gap-1">
                  <p className="max-w-76">
                    {t('2-Day-shipping')}
                    {t(
                      'Within 2 business day after dispatch - not available for PO BOX, APO/ FPO/ DPO',
                    )}
                  </p>
                  <p>{t('25.00 AED')}</p>
                </div>
              </div>
            </div>
            <button className="w-full bg-primary-P-40 text-white border border-transparent font-medium text-sm rounded-md px-6 py-2.5 mb-24">
              {t('Track Order')}
            </button>
          </div>
          <div className="flex flex-col gap-4">
            <h2 className="text-3xl font-medium">
              {t('Estimated Shipping Time')}
            </h2>
            <p className="max-w-102.5">
              {t(
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique.',
              )}
            </p>
            <h2 className="text-3xl font-medium">{t('Returns Policy')}</h2>
            <p className="max-w-102.5">
              {t(
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique.',
              )}
            </p>
          </div>
        </div>
        {moreItemsFromMarioBologna &&
        moreItemsFromMarioBologna.products.nodes.length > 0 ? (
          <ProductsSection
            t={t}
            direction={direction}
            title={t('More Items From Mario Bologna')}
            viewAllLink="#"
            width={width}
            height={height}
            products={moreItemsFromMarioBologna.products.nodes}
            showViewAll={false}
          />
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}
