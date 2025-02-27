import {
  createCookie,
  defer,
  redirect,
  type LoaderFunctionArgs,
} from '@shopify/remix-oxygen';
import {
  Link,
  NavLink,
  useFetcher,
  useLoaderData,
  useNavigate,
  type MetaFunction,
} from '@remix-run/react';
import React, {useEffect, useState} from 'react';
import {Money} from '@shopify/hydrogen';
import BannerContentLayout from '~/components/BannerContentLayout';
import {useCustomContext} from '~/contexts/App';
import {fetchCustomerDetails, tokenCookie} from '~/utils/auth';
import {CustomerFragment, OrderCardFragment} from 'storefrontapi.generated';
import {Image} from '@shopify/hydrogen';
import {formatDateToDM, usePrefixPathWithLocale} from '~/lib/utils';
import {useTranslation} from 'react-i18next';
import {TFunction} from 'i18next';
import {CurrencyCode, Maybe} from '@shopify/hydrogen/storefront-api-types';
import {currencyType} from '~/data/currencies';

export const meta: MetaFunction = () => {
  return [{title: 'Orders'}];
};

export async function loader({context, request}: LoaderFunctionArgs) {
  const {storefront} = context;
  const cookieHeader = request.headers.get('Cookie');

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

  return defer({customer});
}

const Account = () => {
  const {setCurrentPage, setShowHeaderFooter, setShowBoardingPage, direction} =
    useCustomContext();
  const {t} = useTranslation();
  const {customer: initialCustomer} = useLoaderData<typeof loader>();
  const fetcher = useFetcher<Maybe<{customer: CustomerFragment | undefined}>>();

  const [selectedPurchases, setSelectedPurchases] = useState('online');
  const [customer, setCustomer] = useState(initialCustomer);

  useEffect(() => {
    setCurrentPage('My Purchases');
    setShowHeaderFooter(true);
    setShowBoardingPage(false);
  }, []);

  useEffect(() => {
    if (fetcher.data && fetcher.data.customer) {
      setCustomer((fetcher.data as {customer: CustomerFragment}).customer);
    }
  }, [fetcher.data]);

  const handleRefetchCustomerDetails = () => {
    fetcher.load('/account/details');
  };

  return (
    <div className="account">
      <BannerContentLayout
        selectedPage="purchases"
        customer={customer}
        t={t}
        direction={direction}
      >
        <MyPurchases
          orders={customer.orders}
          selectedPurchases={selectedPurchases}
          setSelectedPurchases={setSelectedPurchases}
          t={t}
          handleRefetchCustomerDetails={handleRefetchCustomerDetails}
        />
      </BannerContentLayout>
    </div>
  );
};

type MyPurchasesProps = {
  selectedPurchases: string;
  setSelectedPurchases: React.Dispatch<React.SetStateAction<string>>;
  orders: CustomerFragment['orders'];
  t: TFunction<'translation', undefined>;
  handleRefetchCustomerDetails: () => void;
};

function MyPurchases({
  t,
  selectedPurchases,
  setSelectedPurchases,
  orders,
  handleRefetchCustomerDetails,
}: MyPurchasesProps) {
  return (
    <div className="flex-1 flex flex-col items-stretch justify-start">
      <h1 className="text-2xl">{t('My Purchases')}</h1>
      <div className="flex items-start justify-start my-8 md:mt-5 md:mb-10">
        <button
          className={`${selectedPurchases === 'online' ? 'border-primary-P-40 text-black' : 'border-transparent text-neutral-N-30'} w-full md:w-45 px-4 py-3.5 border-b-2`}
          onClick={(e) => setSelectedPurchases('online')}
        >
          {t('Online')}
        </button>
        {/* <button
          className={`${selectedPurchases === 'store' ? 'border-primary-P-40 text-black' : 'border-transparent text-neutral-N-30'} w-full md:w-45 px-4 py-3.5 border-b-2`}
          onClick={(e) => setSelectedPurchases('store')}
        >
          {t('In store')}
        </button> */}
      </div>
      {selectedPurchases === 'online' ? (
        <div className="flex flex-col items-stretch gap-5">
          {orders.nodes.length > 0 ? (
            orders.nodes.map((order) => (
              <PurchaseOrder
                key={order.id}
                id={order.id}
                order={order}
                t={t}
                handleRefetchCustomerDetails={handleRefetchCustomerDetails}
              />
            ))
          ) : (
            <EmptyOrders t={t} />
          )}
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}

function EmptyOrders({t}: {t: TFunction<'translation', undefined>}) {
  return (
    <div className="flex flex-col items-start justify-start">
      <p className="mb-1">{t("You haven't placed any orders yet.")}</p>
      <Link
        className="w-73.5 text-center text-primary-P-40 py-2.5 px-6 mt-3 font-medium border border-primary-P-40 rounded"
        to={usePrefixPathWithLocale('/')}
      >
        {t('Start Shopping')}
      </Link>
    </div>
  );
}

type PurchaseOrderType = {
  id: string;
  order: Exclude<OrderCardFragment, 'id'>;
  t: TFunction<'translation', undefined>;
  handleRefetchCustomerDetails: () => void;
};

function PurchaseOrder({
  id,
  order,
  t,
  handleRefetchCustomerDetails,
}: PurchaseOrderType) {
  const [legacyOrderId, key] = id.split('/').pop()!.split('?');
  const url = key
    ? `/account/orders/${legacyOrderId}?${key}`
    : `/account/orders/${legacyOrderId}`;

  const [loading, setLoading] = useState(false);
  const {currency} = useCustomContext();

  const handleCancelingOrder = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    setLoading(true);
    const refundAmount = order.totalPrice.amount;
    const response = await fetch('/api/account/orders/cancel', {
      method: 'POST',
      body: JSON.stringify({
        orderId: legacyOrderId,
        refundAmount,
      }),
      headers: {
        'Content-Type': 'application/json',
        Accept: 'Application/json',
      },
    });
    const result = (await response.json()) as any;
    if (result.success) {
      handleRefetchCustomerDetails();
    } else {
      console.log('result', result);
    }
    setLoading(false);
  };

  return (
    <div className="py-3 px-6 bg-white border border-neutral-N-50 rounded">
      <Link
        to={url}
        className="flex items-start flex-col md:flex-row justify-between gap-8"
      >
        {order.financialStatus === 'PAID' ? (
          order.fulfillmentStatus === 'FULFILLED' ? (
            <PaidFulfilledOrder
              order={order}
              formatDateToDM={formatDateToDM}
              t={t}
              currency={currency}
            />
          ) : (
            <PaidUnfulfilledOrder
              order={order}
              formatDateToDM={formatDateToDM}
              t={t}
              currency={currency}
            />
          )
        ) : order.financialStatus === 'REFUNDED' ? (
          order.fulfillmentStatus === 'FULFILLED' ? (
            <RefundedOrder order={order} t={t} currency={currency} />
          ) : (
            <CanceledOrder order={order} t={t} currency={currency} />
          )
        ) : order.financialStatus === 'PARTIALLY_REFUNDED' ? (
          <PartiallyRefundedOrder
            order={order}
            formatDateToDM={formatDateToDM}
            t={t}
            currency={currency}
          />
        ) : (
          <></>
        )}
        <div className="w-full flex items-start md:justify-end flex-wrap gap-2">
          {order.lineItems.nodes.map((lineItem, index) =>
            lineItem.variant && lineItem.variant.image ? (
              <Image
                key={index}
                data={lineItem.variant.image}
                aspectRatio="1/1"
                className="border border-black/20 max-w-30 h-31 object-cover rounded-none"
                sizes="auto"
                loading="lazy"
              />
            ) : (
              <img
                src="/no_image.png"
                className="w-full border border-black/20 max-w-30 h-31 object-contain"
              />
            ),
          )}
        </div>
      </Link>
      {order.financialStatus === 'PAID' &&
      order.fulfillmentStatus === 'UNFULFILLED' ? (
        <button
          onClick={handleCancelingOrder}
          className="md:w-73.5 text-primary-P-40 text-sm py-2 md:py-2.5 px-6 mt-3 font-medium border border-primary-P-40 rounded"
        >
          {loading ? t('Processing...') : t('Cancel This Delivery')}
        </button>
      ) : (
        <></>
      )}
    </div>
  );
}

const PaidUnfulfilledOrder = ({
  order,
  formatDateToDM,
  t,
  currency,
}: {
  order: OrderCardFragment;
  formatDateToDM: (date: string, range?: number) => string;
  t: TFunction<'translation', undefined>;
  currency: currencyType;
}) => {
  return (
    <div className="w-full flex flex-col items-start gap-2">
      <div className="flex items-center justify-center gap-2">
        <img src="/icons/package_pending.svg" alt="pending" />
        <p className="md:text-xl">{t('In Preparation')}</p>
      </div>
      <div className="flex flex-col gap-0.5 md:gap-1">
        <p className="text-sm md:text-base font-medium">
          {t("We're preparing your order in our warehouses")}
        </p>
        <p className="text-sm md:text-base font-medium">
          {t('You will receive it between')} {formatDateToDM(order.processedAt)}{' '}
          {t('and')} {formatDateToDM(order.processedAt, 4)}
        </p>
      </div>
      <Money
        className="md:text-xl"
        data={{
          amount: (
            parseFloat(order.totalPrice.amount) * currency.exchange_rate
          ).toString(),
          currencyCode: currency.currency['en'] as CurrencyCode,
        }}
      />
    </div>
  );
};

const PaidFulfilledOrder = ({
  order,
  formatDateToDM,
  t,
  currency,
}: {
  order: OrderCardFragment;
  formatDateToDM: (date: string, range?: number) => string;
  t: TFunction<'translation', undefined>;
  currency: currencyType;
}) => {
  return (
    <div className="w-full flex flex-col items-start gap-2">
      <div className="flex items-center justify-center gap-2">
        <img src="/icons/package_delivered.svg" alt="delivered" />
        <p className="md:text-xl">{t('Delivered')}</p>
      </div>
      <p className="text-sm md:text-base font-medium">
        {t('You received it on')} {formatDateToDM(order.processedAt)}
      </p>
      <Money
        className="md:text-xl"
        data={{
          amount: (
            parseFloat(order.totalPrice.amount) * currency.exchange_rate
          ).toString(),
          currencyCode: currency.currency['en'] as CurrencyCode,
        }}
      />
    </div>
  );
};

const RefundedOrder = ({
  order,
  t,
  currency,
}: {
  order: OrderCardFragment;
  t: TFunction<'translation', undefined>;
  currency: currencyType;
}) => {
  return (
    <div className="w-full flex flex-col items-start gap-2">
      <div className="flex items-center justify-center gap-2">
        <img
          src="/icons/package_refunded.svg"
          alt="refunded"
          width={27}
          height={27}
        />
        <p className="md:text-xl">{t('Refunded')}</p>
      </div>
      <div className="flex flex-col gap-0.5 md:gap-1">
        <p className="text-sm md:text-base font-medium">
          {t('This order refunded by the customer')}
        </p>
        <p className="text-sm md:text-base font-medium">
          {t('Total refunded price:')}
        </p>
      </div>
      <Money
        className="md:text-xl"
        data={{
          amount: (
            parseFloat(order.totalRefunded.amount) * currency.exchange_rate
          ).toString(),
          currencyCode: currency.currency['en'] as CurrencyCode,
        }}
      />
    </div>
  );
};

const PartiallyRefundedOrder = ({
  order,
  formatDateToDM,
  t,
  currency,
}: {
  order: OrderCardFragment;
  formatDateToDM: (date: string, range?: number) => string;
  t: TFunction<'translation', undefined>;
  currency: currencyType;
}) => {
  return (
    <div className="w-full flex flex-col items-start gap-2">
      <div className="flex items-center justify-center gap-2">
        <img
          src="/icons/package_delivered.svg"
          alt="partially refunded"
          width={27}
          height={27}
        />
        <p className="md:text-xl">{t('Partially Refunded')}</p>
      </div>
      <div className="flex flex-col gap-0.5 md:gap-1">
        <p className="text-sm md:text-base font-medium">
          {t('You received it on')} {formatDateToDM(order.processedAt)}
        </p>
        <p className="text-sm md:text-base font-medium">
          {t('Total refunded price:')}
        </p>
        <Money
          className="md:text-xl"
          data={{
            amount: (
              parseFloat(order.totalRefunded.amount) * currency.exchange_rate
            ).toString(),
            currencyCode: currency.currency['en'] as CurrencyCode,
          }}
        />
      </div>
    </div>
  );
};

const CanceledOrder = ({
  order,
  t,
  currency,
}: {
  order: OrderCardFragment;
  t: TFunction<'translation', undefined>;
  currency: currencyType;
}) => {
  return (
    <div className="w-full flex flex-col items-start gap-2">
      <div className="flex items-center justify-center gap-2">
        <img
          src="/icons/package_refunded.svg"
          alt="refunded"
          width={27}
          height={27}
        />
        <p className="md:text-xl">{t('Canceled')}</p>
      </div>
      <div className="flex flex-col gap-0.5 md:gap-1">
        <p className="text-sm md:text-base font-medium">
          {t('This order canceled by the customer')}
        </p>
        <p className="text-sm md:text-base font-medium">
          {t('Total returned price:')}
        </p>
      </div>
      <Money
        className="md:text-xl"
        data={{
          amount: (
            parseFloat(order.totalRefunded.amount) * currency.exchange_rate
          ).toString(),
          currencyCode: currency.currency['en'] as CurrencyCode,
        }}
      />
    </div>
  );
};

export default Account;
