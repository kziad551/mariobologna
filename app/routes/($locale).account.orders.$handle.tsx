import {defer, redirect, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {NavLink, useLoaderData, type MetaFunction} from '@remix-run/react';
import {Money} from '@shopify/hydrogen';
import BannerContentLayout from '~/components/BannerContentLayout';
import {RiArrowLeftLine} from 'react-icons/ri';
import {
  fetchCustomerDetails,
  fetchCustomerOrder,
  tokenCookie,
} from '~/utils/auth';
import {OrderFragment} from 'storefrontapi.generated';
import {formatDateToDM} from '~/lib/utils';
import {Image} from '@shopify/hydrogen';
import {useCustomContext} from '~/contexts/App';
import {useTranslation} from 'react-i18next';
import {TFunction} from 'i18next';
import {useEffect} from 'react';
import {CurrencyCode} from '@shopify/hydrogen/storefront-api-types';

export const meta: MetaFunction = () => {
  return [{title: 'Order'}];
};

export async function loader({request, params, context}: LoaderFunctionArgs) {
  const {storefront} = context;
  const cookieHeader = request.headers.get('Cookie');
  const {handle} = params;

  if (!handle) {
    return redirect('/account');
  }

  const queryParams = new URL(request.url).searchParams;
  const orderToken = queryParams.get('key');
  const orderId = orderToken
    ? `gid://shopify/Order/${handle}?key=${orderToken}`
    : `gid://shopify/Order/${handle}`;

  const token = await tokenCookie.parse(cookieHeader);
  if (!token) {
    return redirect('/account/login');
  }

  const customer = await fetchCustomerDetails(token, storefront);
  if (!customer) {
    return redirect('/account/login', {
      headers: {
        'Set-Cookie': await tokenCookie.serialize('', {maxAge: 0}),
      },
    });
  }

  const order = await fetchCustomerOrder(storefront, orderId);
  if (!order) {
    return redirect('/account');
  }

  return defer({handle, customer, order: order as ExtendedOrderFragment});
}

const AccountPurchases = () => {
  const {t} = useTranslation();
  const {setCurrentPage, direction} = useCustomContext();
  const {handle, customer, order} = useLoaderData<typeof loader>();

  useEffect(() => {
    setCurrentPage('My Purchases');
  }, []);

  return (
    <div className="account-purchases">
      <BannerContentLayout
        t={t}
        direction={direction}
        customer={customer}
        selectedPage="purchases"
      >
        <OrderDetails
          t={t}
          direction={direction}
          handle={handle}
          order={order}
        />
      </BannerContentLayout>
    </div>
  );
};

type ExtendedOrderFragment = OrderFragment & {
  financialStatus: 'PAID' | 'PARTIALLY_REFUNDED' | 'REFUNDED';
  fulfillmentStatus: 'FULFILLED' | 'UNFULFILLED';
  orderNumber: string;
  billingAddress?: {
    firstName?: string;
    address1?: string;
    city?: string;
    country?: string;
    phone?: string;
    zip?: string;
  };
  totalShippingPrice: { amount: string };
  currentTotalTax: { amount: string };
  currentTotalPrice: { amount: string };
  lineItems: {
    nodes: Array<{
      title: string;
      discountedTotalPrice: { amount: string };
      variant?: {
        image?: { height: number; width: number; url: string; id: string; altText?: string };
        selectedOptions: Array<{ value: string }>;
      };
    }>;
  };
};

type OrderDetailsProps = {
  handle: string;
  order: ExtendedOrderFragment;
  t: TFunction<'translation', undefined>;
  direction: 'rtl' | 'ltr';
};

function OrderDetails({handle, order, t, direction}: OrderDetailsProps) {
  const {currency} = useCustomContext();

  const [legacyOrderId, key] = order.id.split('/').pop()!.split('?');
  const url = key
    ? `/account/orders/refund/${legacyOrderId}?${key}`
    : `/account/orders/refund/${legacyOrderId}`;

  return (
    <div className="flex-1 flex flex-col items-start justify-start gap-8">
      <NavLink
        to="/account/orders"
        className="flex items-center justify-start gap-2 py-2.5 pr-4"
      >
        <RiArrowLeftLine
          className={`${direction === 'rtl' ? 'rotate-180' : ''} w-4 h-4`}
        />
        <span className="text-sm">{t('Back to my purchases')}</span>
      </NavLink>
      <h1 className="text-2xl">{t('Purchases Summary')}</h1>
      {order.financialStatus === 'PAID' ||
      order.financialStatus === 'PARTIALLY_REFUNDED' ? (
        order.fulfillmentStatus === 'FULFILLED' ? (
          <div className="flex flex-col items-start justify-start gap-2">
            <h3 className="text-2xl">{t('Delivered')}</h3>
            <p className="text-medium">
              {t('You received this order on')}{' '}
              {formatDateToDM(order.processedAt)}
            </p>
            <p className="text-medium">
              {t('You have until')} {formatDateToDM(order.processedAt, 30)}{' '}
              {t('to return any item')}
            </p>
          </div>
        ) : order.fulfillmentStatus === 'UNFULFILLED' ? (
          <div className="flex flex-col items-start justify-start gap-2">
            <h3 className="text-2xl">{t('In Preparation')}</h3>
            <p className="text-medium">
              {t("We're preparing your order in our warehouses")}
            </p>
            <p className="text-medium">
              {t('You will receive it between')}{' '}
              {formatDateToDM(order.processedAt)} {t('and')}{' '}
              {formatDateToDM(order.processedAt, 4)}
            </p>
          </div>
        ) : (
          <></>
        )
      ) : order.financialStatus === 'REFUNDED' ? (
        <div className="flex flex-col items-start justify-start gap-2">
          <h3 className="text-2xl">{t('Refunded')}</h3>
          <p className="text-medium">{t('You refunded this order')}</p>
        </div>
      ) : (
        <></>
      )}
      <div className="flex flex-col items-start justify-start gap-2">
        <h3 className="text-2xl">
          {t('Order no')} {order.orderNumber}
        </h3>
        <p className="text-medium">
          {order.lineItems.nodes.length}{' '}
          {order.lineItems.nodes.length > 1 ? t('items') : t('item')}
        </p>
        <div className="flex items-stretch flex-wrap justify-start gap-3">
          {order.lineItems.nodes.map((item, index) => (
            <div
              key={index}
              className="overflow-hidden max-w-max max-h-41.25 flex items-stretch justify-center bg-white rounded-lg border border-neutral-N-50"
            >
              {item.variant?.image ? (
                <Image
                  data={item.variant?.image}
                  className="max-w-26 xs:max-w-34 h-auto object-contain bg-white py-4 xs:py-8 px-1.5"
                />
              ) : (
                <img
                  src="/no_image.png"
                  className="max-w-26 xs:max-w-34 h-auto object-cover bg-white py-4 xs:py-8 px-1.5"
                />
              )}
              <div className="xs:min-w-36.5 flex flex-col items-start justify-center p-4 xs:p-8 bg-[#F5F5F5]">
                <span>{item.title}</span>
                <Money
                  className="text-neutral-N-30 text-sm"
                  as="span"
                  data={{
                    amount: (
                      parseFloat((item as any).discountedTotalPrice.amount) *
                      currency.exchange_rate
                    ).toString(),
                    currencyCode: currency.currency['en'] as CurrencyCode,
                  }}
                />
                {(item.variant as any)?.selectedOptions?.map((option: { value: string }, index: number) => (
                  <span key={index} className="text-neutral-N-30 text-sm">
                    {option.value}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="h-0.25 w-full bg-neutral-N-80" />
      <div className="w-full flex items-start justify-between flex-wrap gap-4">
        <div className="flex flex-col items-start justify-start gap-8">
          <div className="flex flex-col items-start justify-start gap-2">
            <h3 className="text-2xl">{t('Delivery Method')}</h3>
            <span className="font-medium">
              {t('Standard Delivery PayOnDelivery')}
            </span>
          </div>
          <div className="xs:w-75 flex flex-col items-start justify-start gap-2">
            <h3 className="text-2xl">{t('Delivery Address')}</h3>
            <div className="flex flex-col">
              <span className="font-medium">
                {order.shippingAddress?.firstName}
              </span>
              {order.shippingAddress?.address1 ? (
                <span className="font-medium">
                  {t('Street')} {order.shippingAddress.address1}
                </span>
              ) : (
                <></>
              )}
              <span className="font-medium">{order.shippingAddress?.city}</span>
              <span className="font-medium">
                {order.shippingAddress?.country}
              </span>
              {order.shippingAddress?.phone ? (
                <span className="font-medium">
                  {t('Mobile phone:')} {order.shippingAddress.phone}
                </span>
              ) : (
                <></>
              )}
              {order.shippingAddress?.zip ? (
                <span className="font-medium">
                  {t('Postal Code')}: {order.shippingAddress.zip}
                </span>
              ) : (
                <></>
              )}
            </div>
          </div>
        </div>
        <div className="flex flex-col items-start justify-start gap-8">
          <div className="flex flex-col items-start justify-start gap-2">
            <h3 className="text-2xl">{t('Payment Method')}</h3>
            <span className="font-medium">{t('COD')}</span>
          </div>
          <div className="xs:w-75 flex flex-col items-start justify-start gap-2">
            <h3 className="text-2xl">{t('Billing Address')}</h3>
            <div className="flex flex-col">
              <span className="font-medium">
                {order.billingAddress?.firstName}
              </span>
              {order.billingAddress?.address1 ? (
                <span className="font-medium">
                  {t('Street')} {order.billingAddress.address1}
                </span>
              ) : (
                <></>
              )}
              <span className="font-medium">{order.billingAddress?.city}</span>
              <span className="font-medium">
                {order.billingAddress?.country}
              </span>
              {order.billingAddress?.phone ? (
                <span className="font-medium">
                  {t('Mobile phone:')} {order.billingAddress.phone}
                </span>
              ) : (
                <></>
              )}
              {order.billingAddress?.zip ? (
                <span className="font-medium">
                  {t('Postal Code')}: {order.billingAddress.zip}
                </span>
              ) : (
                <></>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="h-0.25 w-full bg-neutral-N-80" />
      <div className="w-full flex items-start justify-between gap-2">
        <h3 className="text-2xl">{t('Shipping Cost')}</h3>
        <Money
          className="font-medium"
          as="span"
          data={{
            amount: (
              parseFloat(order.totalShippingPrice.amount) *
              currency.exchange_rate
            ).toString(),
            currencyCode: currency.currency['en'] as CurrencyCode,
          }}
        />
      </div>
      <div className="w-full flex flex-col items-stretch justify-start gap-5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-2xl">{t('Tax')}</h3>
          <Money
            className="font-medium"
            as="span"
            data={{
              amount: (
                parseFloat(order.currentTotalTax.amount) *
                currency.exchange_rate
              ).toString(),
              currencyCode: currency.currency['en'] as CurrencyCode,
            }}
          />
        </div>
        <div className="h-0.25 w-full bg-neutral-N-80" />
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-2xl">{t('Total')}</h3>
          <Money
            className="font-medium"
            as="span"
            data={{
              amount: (
                parseFloat(order.currentTotalPrice.amount) *
                currency.exchange_rate
              ).toString(),
              currencyCode: currency.currency['en'] as CurrencyCode,
            }}
          />
        </div>
      </div>
      <div className="w-full mt-6 flex flex-wrap items-stretch justify-start gap-8">
        {(order.financialStatus === 'PAID' ||
          order.financialStatus === 'PARTIALLY_REFUNDED') &&
        order.fulfillmentStatus === 'FULFILLED' ? (
          <NavLink
            to={url}
            className="px-6 py-2.5 w-77.5 text-center text-sm border border-neutral-N-50 rounded-md text-primary-P-40 font-medium"
          >
            {t('Making an Online Return')}
          </NavLink>
        ) : (
          <></>
        )}
        {/* <button className="px-6 py-2.5 w-77.5 text-center text-sm border border-neutral-N-50 rounded-md text-primary-P-40 font-medium">
          {t('View Invoice')}
        </button> */}
      </div>
    </div>
  );
}

export default AccountPurchases;
