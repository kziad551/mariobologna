import {
  defer,
  json,
  redirect,
  type LoaderFunctionArgs,
} from '@shopify/remix-oxygen';
import {
  NavLink,
  useFetcher,
  useLoaderData,
  useNavigate,
  type MetaFunction,
} from '@remix-run/react';
import {Money} from '@shopify/hydrogen';
import {RiArrowLeftLine} from 'react-icons/ri';
import {GoPencil, GoPlus, GoTrash} from 'react-icons/go';
import {PiMapPin} from 'react-icons/pi';
import React, {useEffect, useRef, useState} from 'react';
import {FaCircle} from 'react-icons/fa';
import ReasonReturnPopup from '~/components/Popup/PopupReasonReturn';
import {
  fetchCustomerDetails,
  fetchCustomerOrder,
  tokenCookie,
} from '~/utils/auth';
import {Image} from '@shopify/hydrogen';
import {
  CurrencyCode,
  Maybe,
  OrderLineItem,
} from '@shopify/hydrogen/storefront-api-types';
import {AddressFragment, CustomerFragment} from 'storefrontapi.generated';
import PopupAddressForm from '~/components/Popup/PopupAddress';
import {useCustomContext} from '~/contexts/App';
import {useTranslation} from 'react-i18next';
import {TFunction} from 'i18next';

export const meta: MetaFunction = () => {
  return [{title: 'Refund'}];
};

export async function loader({request, params, context}: LoaderFunctionArgs) {
  const {storefront, env} = context;
  const {handle} = params;
  const cookieHeader = request.headers.get('Cookie');

  const token = await tokenCookie.parse(cookieHeader);
  if (!token) {
    return redirect('/account/login');
  }

  if (!handle) {
    return redirect('/account');
  }

  const customer = await fetchCustomerDetails(token, storefront);
  if (!customer) {
    return redirect('/account/login', {
      headers: {
        'Set-Cookie': await tokenCookie.serialize('', {maxAge: 0}),
      },
    });
  }

  const queryParams = new URL(request.url).searchParams;
  const orderToken = queryParams.get('key');
  const orderId = orderToken
    ? `gid://shopify/Order/${handle}?key=${orderToken}`
    : `gid://shopify/Order/${handle}`;

  const order = await fetchCustomerOrder(storefront, orderId);

  if (
    order?.fulfillmentStatus !== 'FULFILLED' ||
    order?.financialStatus === 'REFUNDED'
  ) {
    return redirect('/account/orders');
  }

  const SHOPIFY_ADMIN_API_URL = `https://${env.PUBLIC_STORE_DOMAIN}/admin/api/${env.ADMIN_VERSION}`;
  const ADMIN_URL = `${SHOPIFY_ADMIN_API_URL}/orders/${handle}.json?fields=id,line_items,location_id,fulfillments`;

  let response = null;
  try {
    response = await fetch(ADMIN_URL, {
      method: 'GET',
      headers: {
        'X-Shopify-Access-Token': `${env.ADMIN_API_ACCESS_TOKEN}`,
      },
    });
  } catch (error) {
    console.log('error while getting order from Admin API', error);
  }
  const result: any = await response?.json();

  return json({
    orderId: handle,
    customer,
    order,
    orderFromAdminAPI: result.order,
  });
}

type ItemType = {
  line_item_id: number;
  location_id: number;
  price: string;
  quantity: number;
  currency: CurrencyCode;
  title: string;
  variant?: OrderLineItem['variant'];
};

const AccountRefundPurchases = () => {
  const {
    orderId,
    order,
    orderFromAdminAPI,
    customer: initialCustomer,
  } = useLoaderData<typeof loader>();
  const {t} = useTranslation();
  const {setCurrentPage, direction} = useCustomContext();
  const [returnSteps, setReturnSteps] = useState(false);
  const [openPopup, setOpenPopup] = useState(false);
  const [currentSection, setCurrentSection] = useState('make_return');
  const [returnReason, setReturnReason] = useState('');
  const [selectedItems, setSelectedItems] = useState<ItemType[]>([]);
  const [lineItems, setLineItems] = useState<ItemType[]>([]);
  const [allSelected, setAllSelected] = useState(false);
  const fetcher = useFetcher<Maybe<{customer: CustomerFragment | undefined}>>();
  const [customer, setCustomer] = useState(initialCustomer);

  if (!order || !orderFromAdminAPI) {
    return (
      <div className="account-refund">
        <div className="flex flex-col items-start justify-start px-8 pt-14 pb-40 ml-93.5">
          <p className="text-neutral-N-30 font-semibold">
            {t('Failed to fetch Order details')}
          </p>
        </div>
      </div>
    );
  }

  function combineOrderData(
    storefrontOrder: OrderLineItem[],
    adminOrder: any,
  ): ItemType[] {
    const combinedItems: ItemType[] = [];

    // Create a map for quick lookup of line items from storefront order
    const storefrontItemsMap = new Map<string, OrderLineItem>();
    storefrontOrder.forEach((item: any) => {
      const [variantID, key] = item.variant.id.split('/').pop()!.split('?');
      storefrontItemsMap.set(variantID, item);
    });

    // Loop through line items in the admin order
    adminOrder.line_items.forEach((adminItem: any) => {
      const storefrontItem = storefrontItemsMap.get(
        adminItem.variant_id.toFixed(0),
      );
      if (storefrontItem) {
        combinedItems.push({
          line_item_id: adminItem.id,
          location_id:
            adminOrder.fulfillments[0].location_id ?? adminItem.location_id,
          price: storefrontItem.discountedTotalPrice.amount,
          quantity: storefrontItem.currentQuantity,
          currency: storefrontItem.discountedTotalPrice.currencyCode,
          title: storefrontItem.title,
          variant: storefrontItem.variant,
        });
      }
    });

    return combinedItems;
  }

  useEffect(() => {
    setCurrentPage('Return');
    const combine = combineOrderData(
      order.lineItems.nodes as OrderLineItem[],
      orderFromAdminAPI,
    );
    setLineItems(combine);
  }, []);

  useEffect(() => {
    const counter = order.lineItems.nodes.filter(
      (item) => item.currentQuantity !== 0,
    ).length;
    if (selectedItems.length === counter) {
      setAllSelected(true);
    } else {
      setAllSelected(false);
    }
  }, [selectedItems]);

  useEffect(() => {
    if (fetcher.data && fetcher.data.customer) {
      setCustomer((fetcher.data as {customer: CustomerFragment}).customer);
    }
  }, [fetcher.data]);

  const handleRefetchCustomerDetails = () => {
    fetcher.load('/account/details');
  };

  function handleShowSections(section: string) {
    if (!returnSteps) {
      setReturnSteps(true);
    } else {
      setCurrentSection(section);
    }
  }

  function handlePopupSections(section: string) {
    if (!openPopup && returnReason !== '') {
      setOpenPopup(false);
      setCurrentSection(section);
    } else {
      setOpenPopup(true);
    }
  }

  const handleRefundSubmit = async () => {
    const response = await fetch('/api/account/orders/refund', {
      method: 'POST',
      body: JSON.stringify({
        orderId,
        lineItems: selectedItems,
        allSelected,
        note: returnReason,
      }),
      headers: {
        'Content-Type': 'application/json',
        Accept: 'Application/json',
      },
    });
    const result = (await response.json()) as any;
    if (result.success) {
      setCurrentSection('refund_succeeded');
    } else {
      console.log('result', result);
      setCurrentSection('refund_failed');
    }
  };

  return (
    <div className="account-refund">
      <div
        className={`${direction === 'ltr' ? 'md:ml-93.5' : ' md:mr-93.5'} flex flex-col items-start justify-start px-8 pt-3 md:pt-14 pb-14 md:pb-40`}
      >
        {currentSection !== 'refund_succeeded' &&
        currentSection !== 'refund_failed' ? (
          <NavLink
            to="/account/orders"
            className={`${direction === 'ltr' ? 'pr-4' : ' pl-4'} hidden md:flex items-center justify-start gap-2 py-2.5`}
          >
            <RiArrowLeftLine
              className={`${direction === 'rtl' ? 'rotate-180' : ''} w-4 h-4`}
            />
            <span className="text-sm">{t('Back to my purchases')}</span>
          </NavLink>
        ) : (
          <></>
        )}
        {currentSection === 'make_return' ? (
          <MakeReturnSection
            t={t}
            returnSteps={returnSteps}
            handleShowSections={handleShowSections}
          />
        ) : (
          <></>
        )}
        {currentSection === 'selected_items' ? (
          <SelectItemsSection
            t={t}
            handleShowSections={handlePopupSections}
            selectedItems={selectedItems}
            setSelectedItems={setSelectedItems}
            lineItems={lineItems}
          />
        ) : (
          <></>
        )}
        {currentSection === 'select_address' ? (
          <SelectAddressSection
            t={t}
            direction={direction}
            setCurrentSection={setCurrentSection}
            customer={customer}
            handleRefetchCustomerDetails={handleRefetchCustomerDetails}
          />
        ) : (
          <></>
        )}
        {currentSection === 'return_summary' ? (
          <ReturnSummarySection
            t={t}
            setCurrentSection={setCurrentSection}
            selectedItems={selectedItems}
            address={customer.defaultAddress as AddressFragment}
            handleRefundRequest={handleRefundSubmit}
          />
        ) : (
          <></>
        )}
        {currentSection === 'refund_succeeded' ? (
          <RefundSucceededSection t={t} />
        ) : (
          <></>
        )}
        {currentSection === 'refund_failed' ? (
          <RefundFailedSection t={t} />
        ) : (
          <></>
        )}
      </div>
      <ReasonReturnPopup
        t={t}
        direction={direction}
        openPopup={openPopup}
        setOpenPopup={setOpenPopup}
        returnReason={returnReason}
        setReturnReason={setReturnReason}
      />
    </div>
  );
};

type MakeReturnSectionType = {
  returnSteps: boolean;
  handleShowSections: (section: string) => void;
  t: TFunction<'translation', undefined>;
};

function MakeReturnSection({
  t,
  returnSteps,
  handleShowSections,
}: MakeReturnSectionType) {
  const {currency} = useCustomContext();
  return (
    <>
      <h1 className="text-2xl mb-5.5 md:my-8">
        {t('How Do You Want to Make Your Return?')}
      </h1>
      <div className="p-4 flex flex-col gap-2 border border-neutral-N-50 rounded">
        <h4 className="text-neutral-N-30 font-bold">
          {t('Pick up from home')}
        </h4>
        <span>{t('The carrier will pick up your items from your home')}</span>
        <Money
          as="span"
          data={{
            amount: (50 * currency.exchange_rate).toString(),
            currencyCode: currency.currency['en'] as CurrencyCode,
          }}
        />
      </div>
      {!returnSteps ? (
        <>
          {/* <button className="flex items-center justify-start gap-2 py-2.5 pr-4 pl-3 mt-4">
          <GoPlus className="w-4 h-4" />
          <span className="text-sm">{t('Add new address')}</span>
        </button> */}
        </>
      ) : (
        <div className="flex flex-col gap-3 mt-10">
          <h3 className="text-2xl">
            {t('These are the steps for making a return by postal address')}
          </h3>
          <ul className="list-disc list-outside mr-4 max-w-120">
            <li>{t('Select the items that you would like to return')}</li>
            <li>{t('Enter the address for package collection')}</li>
            <li>
              {t(
                "Put the items into an envelope or box and follow the instructions on the label which you'll receive by email",
              )}
            </li>
            <li>
              {t(
                'The carrier will collect the package at the designated address',
              )}
            </li>
            <li>
              {t("Once we've received the order,")}{' '}
              <b>{t("you'll receive your refund in 14 days")}</b>.{' '}
              {t('The return costs will be deducted from your refund amount')}
            </li>
          </ul>
        </div>
      )}
      <div className="flex flex-col gap-2 my-10">
        <p className="font-medium max-w-110">
          {t(
            "Don't forget you can also return items at any of our stores by showing the QR for the order at the counter",
          )}
        </p>
        <button className="flex items-center justify-start gap-2 py-2.5 pr-4 pl-3">
          <PiMapPin className="w-4 h-4" />
          <span className="text-sm">{t('Find your nearest Store')}</span>
        </button>
      </div>
      <button
        onClick={() => handleShowSections('selected_items')}
        className="px-6 py-2.5 w-full md:w-77.5 text-center text-sm text-white bg-primary-P-40 border border-transparent rounded-md font-medium"
      >
        {t('Start Return Request')}
      </button>
    </>
  );
}

type SelectItemsSectionType = {
  handleShowSections: (section: string) => void;
  selectedItems: ItemType[];
  setSelectedItems: React.Dispatch<React.SetStateAction<ItemType[]>>;
  lineItems: ItemType[];
  t: TFunction<'translation', undefined>;
};

function SelectItemsSection({
  t,
  handleShowSections,
  selectedItems,
  setSelectedItems,
  lineItems,
}: SelectItemsSectionType) {
  const handleCheckboxChange = (currentItem: ItemType) => {
    setSelectedItems((prevSelectedItems) =>
      prevSelectedItems.includes(currentItem)
        ? prevSelectedItems.filter((item) => item !== currentItem)
        : [...prevSelectedItems, currentItem],
    );
  };
  const {currency} = useCustomContext();

  return (
    <>
      <h1 className="text-2xl mb-5.5 md:my-8">
        {t('Select the items that you would like to return')}
      </h1>
      <div className="flex flex-wrap items-start justify-start gap-2 md:gap-10 mb-10">
        {lineItems.map((item, index) =>
          item.quantity !== 0 ? (
            <label
              key={index}
              className="z-10 block hover:no-underline group rounded-xl border bg-white border-neutral-N-80 overflow-hidden w-43.75 h-73.75 md:w-87.5 md:h-110 hover:shadow-md hover:shadow-black/30 active:shadow-none"
            >
              <div className="p-2">
                <input
                  type="checkbox"
                  name="selectedItems"
                  checked={selectedItems.includes(item)}
                  onChange={() => handleCheckboxChange(item)}
                  className="group w-5 h-5 md:w-6 md:h-6 ml-auto mr-1 my-2 md:mr-2 md:my-4 block transition-all hover:bg-neutral-N-92 active:bg-neutral-N-90 rounded-full"
                />
              </div>
              {item.variant?.image ? (
                <Image
                  data={item.variant?.image}
                  className="w-auto max-h-36.25 md:max-h-57.5 m-auto px-4 pb-4 md:px-10 md:pb-10 object-cover"
                />
              ) : (
                <img
                  src="/no_image.png"
                  className="w-auto max-h-30 md:max-h-57.5 m-auto px-4 pb-4 md:px-10 md:pb-10 object-cover"
                />
              )}
              <div className="p-4 w-full flex md:flex-col items-start justify-between md:justify-start gap-5 bg-[#F5F5F5] group-hover:bg-neutral-N-92 transition-all duration-300">
                <div className="flex flex-col">
                  <h4 className="text-neutral-N-10">{item.title}</h4>
                  <Money
                    className="text-neutral-N-30 text-sm"
                    as="span"
                    data={{
                      amount: (
                        parseFloat(item.price) * currency.exchange_rate
                      ).toString(),
                      currencyCode: currency.currency['en'] as CurrencyCode,
                    }}
                  />
                  <span className="text-neutral-N-30 text-sm">
                    {item.variant?.selectedOptions[0].value}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <FaCircle
                    className="w-5 h-5"
                    style={{color: `${item.variant?.selectedOptions[1].value}`}}
                  />
                </div>
              </div>
            </label>
          ) : (
            <></>
          ),
        )}
      </div>
      <button
        disabled={selectedItems.length === 0}
        onClick={() => handleShowSections('select_address')}
        className={`${selectedItems.length === 0 ? 'opacity-30 cursor-not-allowed' : ''} px-6 py-2.5 w-full md:w-77.5 text-center text-sm text-white bg-primary-P-40 border border-transparent rounded-md font-medium`}
      >
        {t('Continue')}
      </button>
    </>
  );
}

type SelectAddressSectionType = {
  setCurrentSection: React.Dispatch<React.SetStateAction<string>>;
  customer: CustomerFragment;
  handleRefetchCustomerDetails: () => void;
  t: TFunction<'translation', undefined>;
  direction: 'rtl' | 'ltr';
};

function SelectAddressSection({
  t,
  direction,
  setCurrentSection,
  customer,
  handleRefetchCustomerDetails,
}: SelectAddressSectionType) {
  const navigate = useNavigate();
  const [newAddressForm, setNewAddressForm] = useState<{[x: string]: string}>(
    {},
  );
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [isDefaultAddress, setIsDefaultAddress] = useState(false);
  const [initialDefaultAddress, setInitialDefaultAddress] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const addressRef = useRef<{
    openTrigger: () => void;
    closeTrigger: () => void;
  }>({
    openTrigger: () => {},
    closeTrigger: () => {},
  });

  const handleEditAddress = (
    address: AddressFragment,
    isDefault: boolean = false,
  ) => {
    setNewAddressForm({
      addressId: address.id,
      firstName: address.firstName ?? '',
      lastName: address.lastName ?? '',
      company: address.company ?? '',
      phone: address.phone ?? '',
      address1: address.address1 ?? '',
      zip: address.zip ?? '',
      city: address.city ?? '',
      country: {name: address.country, code: address.countryCodeV2} as any,
    });
    setIsDefaultAddress(isDefault);
    setInitialDefaultAddress(isDefault);
    addressRef.current.openTrigger();
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
    addressId: string,
  ) => {
    e.preventDefault();
    setLoadingSubmit(true);
    setErrorMessage('');
    const address = {
      ...newAddressForm,
      addressId,
      isDefaultAddress,
    };
    const response = await fetch('/api/account/details/address', {
      method: 'POST',
      body: JSON.stringify(address),
      headers: {
        'Content-Type': 'application/json',
        Accept: 'Application/json',
      },
    });

    const result = (await response.json()) as any;
    if (typeof result === 'string') {
      navigate(result, {replace: true});
    }

    if (result.success) {
      setNewAddressForm({});
      addressRef.current.closeTrigger();
      handleRefetchCustomerDetails();
    } else {
      console.log('result', result);
      setErrorMessage(result.formError);
    }
    setLoadingSubmit(false);
  };

  return (
    <>
      <PopupAddressForm
        t={t}
        direction={direction}
        ref={addressRef}
        email={customer.email as string}
        addressForm={newAddressForm}
        setAddressForm={setNewAddressForm}
        loadingSubmit={loadingSubmit}
        handleSubmit={(e: React.FormEvent<HTMLFormElement>) =>
          handleSubmit(e, newAddressForm.addressId)
        }
        title={t('Update Address')}
        initialDefaultAddress={initialDefaultAddress}
        isDefaultAddress={isDefaultAddress}
        setIsDefaultAddress={setIsDefaultAddress}
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
      />
      <h1 className="text-2xl mb-5.5 md:my-8">
        {t('Select collection address')}
      </h1>
      <div className="self-stretch flex flex-col items-start justify-start gap-4 mb-10">
        <div className="self-stretch flex flex-col xs:flex-row items-stretch justify-between gap-4 px-4 py-2 border border-neutral-N-50 rounded max-w-120">
          <div className="flex flex-col items-start justify-start gap-2">
            <p>{customer.defaultAddress?.firstName}</p>
            <p className="break-all">{customer.email}</p>
            {customer.defaultAddress?.phone ? (
              <p>
                {t('Street')} {customer.defaultAddress?.address1}
              </p>
            ) : (
              <></>
            )}
            <p>{customer.defaultAddress?.city}</p>
            <p>{customer.defaultAddress?.country}</p>
            {customer.defaultAddress?.phone ? (
              <p>
                {t('Mobile phone:')} {customer.defaultAddress?.phone}
              </p>
            ) : (
              <></>
            )}
          </div>
          <div className="flex flex-col items-end justify-between">
            <button
              onClick={() =>
                handleEditAddress(
                  customer.defaultAddress as AddressFragment,
                  true,
                )
              }
              className="flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-primary-P-40"
            >
              <GoPencil className="w-4.5 h-4.5" />
              <span>{t('Edit')}</span>
            </button>
          </div>
        </div>
        {/* <button className="flex items-center justify-start gap-2 py-2.5 pr-4 pl-3 mt-4">
          <GoPlus className="w-4 h-4" />
          <span className="text-sm">{t('Add new address')}</span>
        </button> */}
      </div>
      <button
        onClick={() => setCurrentSection('return_summary')}
        className="px-6 py-2.5 w-full md:w-77.5 text-center text-sm text-white bg-primary-P-40 border border-transparent rounded-md font-medium"
      >
        {t('Continue')}
      </button>
    </>
  );
}

type ReturnSummarySectionType = {
  t: TFunction<'translation', undefined>;
  setCurrentSection: React.Dispatch<React.SetStateAction<string>>;
  handleRefundRequest: () => void;
  selectedItems: ItemType[];
  address: AddressFragment;
};

function ReturnSummarySection({
  t,
  setCurrentSection,
  selectedItems,
  address,
  handleRefundRequest,
}: ReturnSummarySectionType) {
  return (
    <>
      <h1 className="text-2xl mb-5.5 md:my-8">{t('Return summary')}</h1>
      <div className="self-stretch max-w-201 flex flex-col items-start justify-start gap-4">
        <div className="flex flex-wrap gap-4">
          {selectedItems.map((item, index) =>
            item.variant?.image ? (
              <Image
                key={index}
                data={item.variant?.image}
                alt="product"
                className="max-w-30 h-30 md:max-w-65 md:h-65 object-cover border border-neutral-N-50 rounded"
              />
            ) : (
              <img
                key={index}
                src="/no_image.png"
                alt="product"
                className="max-w-30 h-30 md:max-w-65 md:h-65 object-cover border border-neutral-N-50 rounded"
              />
            ),
          )}
        </div>
        <div className="flex flex-wrap md:flex-nowrap items-start justify-between gap-4 w-full">
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <h3 className="md:text-2xl">{t('Billing address')}</h3>
              <div className="flex flex-col items-start justify-start gap-1">
                {address.address1 ? (
                  <p className="text-sm md:text-base">
                    {t('Street')} {address.address1}
                  </p>
                ) : (
                  <></>
                )}
                <p className="text-sm md:text-base">{address.city}</p>
                <p className="text-sm md:text-base">{address.country}</p>
                {address.phone ? (
                  <p className="text-sm md:text-base">
                    {t('Mobile phone:')} {address.phone}
                  </p>
                ) : (
                  <></>
                )}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="md:text-2xl">{t('Return method')}</h3>
              <p className="text-sm md:text-base">{t('Pick up from home')}</p>
            </div>
          </div>
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <h3 className="md:text-2xl">{t('Number of packages')}</h3>
              <p className="text-sm md:text-base">
                {selectedItems.length}{' '}
                {selectedItems.length > 1 ? t('packages') : t('package')}
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="md:text-2xl">{t('Refund method')}</h3>
              <p className="text-sm md:text-base max-w-77">
                {t(
                  'The return will be processed using the same payment method used for the order',
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
      <p className="text-sm md:text-base mt-8 mb-10 font-medium max-w-131.5">
        {t(
          "You'll receive the refund within 14 days of us receiving your order at our warehouses. the return costs will be deducted from your refund amount",
        )}
      </p>
      <button
        onClick={handleRefundRequest}
        className="px-6 py-2.5 w-full md:w-77.5 text-center text-sm text-white bg-primary-P-40 border border-transparent rounded-md font-medium"
      >
        {t('Request a return')}
      </button>
    </>
  );
}

type RefundSucceededSectionType = {
  t: TFunction<'translation', undefined>;
};
function RefundSucceededSection({t}: RefundSucceededSectionType) {
  const {currency} = useCustomContext();

  return (
    <>
      <h1 className="text-2xl md:text-5xl font-medium">
        {t('Refund Request Submitted Successfully!')}
      </h1>
      <div className="flex flex-col items-start justify-start gap-5 md:gap-8 my-10">
        <div className="flex flex-col gap-1">
          <h2 className="text-xl md:text-3xl">{t('Order details')}</h2>
          <p className="text-sm md:text-base">{t('Order no')} 40112688121</p>
        </div>
        <div className="flex flex-col gap-1">
          <h2 className="text-xl md:text-3xl">{t('Items for Refund')}</h2>
          <p className="text-sm md:text-base">Stoney x1</p>
        </div>
        <div className="flex flex-col gap-1">
          <h2 className="text-xl md:text-3xl">{t('Refund Amount')}</h2>
          <Money
            className="text-sm md:text-base"
            as="p"
            data={{
              amount: (75 * currency.exchange_rate).toString(),
              currencyCode: currency.currency['en'] as CurrencyCode,
            }}
          />
        </div>
        <div className="flex flex-col gap-1">
          <h2 className="text-xl md:text-3xl">{t('Processing Time')}</h2>
          <p className="text-sm md:text-base max-w-96">
            {t(
              'Your refund will be processed within 14 business days. You will receive an email notification once the refund has been processed.',
            )}
          </p>
        </div>
        <div className="flex flex-col gap-1">
          <h2 className="text-xl md:text-3xl">{t('Contact Us')}</h2>
          <p className="text-sm md:text-base max-w-96">
            {t('If you have any questions or concerns,')} {t('please')}{' '}
            {t(
              'contact our customer support team at customercare@mariobologna.net or call us at 1-800-123-4567. Please reference your order number #123456789 for faster assistance, or visit a store near you here.',
            )}
          </p>
        </div>
      </div>
      <h1 className="text-2xl md:text-5xl font-medium mb-10">
        {t('Thank you for shopping with us')}
      </h1>
      <NavLink
        to="/account/orders"
        className="px-6 py-2.5 w-full md:w-77.5 text-center text-sm text-white bg-primary-P-40 border border-transparent rounded-md font-medium"
      >
        {t('Done')}
      </NavLink>
    </>
  );
}

type RefundFailedSectionType = {
  t: TFunction<'translation', undefined>;
};
function RefundFailedSection({t}: RefundFailedSectionType) {
  return (
    <>
      <h1 className="text-2xl md:text-5xl font-medium">
        {t('An error has occurred')}
      </h1>
      <div className="flex flex-col items-start justify-start gap-8 my-10">
        <div className="flex flex-col gap-1">
          <h2 className="text-xl md:text-3xl">{t('Contact Us')}</h2>
          <p className="text-sm md:text-base max-w-96">
            {t('Please')}{' '}
            {t(
              'contact our customer support team at customercare@mariobologna.net or call us at 1-800-123-4567. Please reference your order number #123456789 for faster assistance, or visit a store near you here.',
            )}
          </p>
        </div>
      </div>
      <NavLink
        to="/account/orders"
        className="px-6 py-2.5 w-full md:w-77.5 text-center text-sm text-white bg-primary-P-40 border border-transparent rounded-md font-medium"
      >
        {t('Done')}
      </NavLink>
    </>
  );
}

export default AccountRefundPurchases;
