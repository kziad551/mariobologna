import {defer, redirect, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {
  Await,
  useLoaderData,
  useNavigate,
  type MetaFunction,
} from '@remix-run/react';
import {Suspense, useEffect, useState} from 'react';
import useWindowDimensions from '~/hooks/useWindowDimensions';
import {useCustomContext} from '~/contexts/App';
import {Money} from '@shopify/hydrogen';
import BagSection from '~/components/BagSection';
import AddressFormInputs from '~/components/AddressFormInputs';
import {InputText} from 'primereact/inputtext';
import {FloatLabel} from 'primereact/floatlabel';
import BillingFormInputs from '~/components/BillingFormInputs';
import {CartBuyerIdentityInput} from '@shopify/hydrogen/storefront-api-types';
import {fetchCustomerDetails, tokenCookie} from '~/utils/auth';
import {useTranslation} from 'react-i18next';

export const meta: MetaFunction = () => {
  return [{title: 'Checkout'}];
};

export async function loader({context, request}: LoaderFunctionArgs) {
  const {storefront, cart} = context;

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

  return defer({cart: await cart.get(), customer});
}

export default function BagCheckout() {
  const navigate = useNavigate();
  const {t} = useTranslation();
  const {setCurrentPage, direction} = useCustomContext();
  const {height, width} = useWindowDimensions(50);
  const {cart, customer} = useLoaderData<typeof loader>();
  const [discountCode, setDiscountCode] = useState('');
  const [packaging, setPackaging] = useState('eco_friendly');
  const [shippingMethod, setShippingMethod] = useState('free_shipping');
  const [addressForm, setAddressForm] = useState<{[x: string]: string}>({});
  const [billingForm, setBillingForm] = useState<{[x: string]: string}>({});

  useEffect(() => {
    setCurrentPage('Checkout');
  }, []);

  if (!cart || cart.lines.nodes.length === 0) {
    return (
      <div className="bag-checkout">
        <div className="pt-24 px-8">
          <BagSection t={t} cart={cart} />
        </div>
      </div>
    );
  }

  const handleCheckoutSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    const buyerIdentity: CartBuyerIdentityInput = {
      email: addressForm.email,
      phone: addressForm.phone,
      countryCode: (addressForm.country as any).code,
    };

    const cartId = cart.id;

    try {
      const response = await fetch('/api/bag/checkout/update_cart', {
        method: 'POST',
        body: JSON.stringify({buyerIdentity, cartId}),
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
        const checkoutUrl = result.data.checkoutUrl;
        window.location.href = checkoutUrl;
      }
    } catch (error: any) {
      console.log(error.message);
    }
    // navigate('/bag/checkout/confirmation');
  };

  return (
    <div className="bag-checkout">
      <div className="pt-12 px-4 sm:pt-24 sm:px-8">
        <div className="flex flex-col lg:flex-row gap-36">
          <form
            onSubmit={handleCheckoutSubmit}
            className="max-w-133.5 w-full flex flex-col gap-8"
          >
            <AddressFormInputs
              addressForm={addressForm}
              setAddressForm={setAddressForm}
              showEmailInput
              t={t}
              direction={direction}
            />
            <div className="flex flex-col gap-3">
              <p className="xs:mb-4 text-neutral-N-30">{t('Packaging')}</p>
              <div className="flex flex-col xs:flex-row xs:items-start justify-start gap-2 xs:gap-8">
                <button
                  type="button"
                  onClick={() => setPackaging('eco_friendly')}
                  className={`${packaging === 'eco_friendly' ? 'text-white bg-primary-P-40 border-transparent' : 'text-primary-P-40 bg-transparent border-primary-P-40'} px-6 py-2.5 text-sm border rounded-md font-medium`}
                >
                  {t('Eco friendly')}
                </button>
                <button
                  type="button"
                  onClick={() => setPackaging('premium_packaging')}
                  className={`${packaging === 'premium_packaging' ? 'text-white bg-primary-P-40 border-transparent' : 'text-primary-P-40 bg-transparent border-primary-P-40'} px-6 py-2.5 text-sm border rounded-md font-medium`}
                >
                  {t('Premium packaging')}
                </button>
              </div>
              <div>
                <div
                  className={`${direction === 'rtl' ? 'rtl-container' : ''} flex`}
                >
                  <FloatLabel>
                    <InputText
                      id="discount_code"
                      type="text"
                      value={discountCode}
                      onChange={(e) => setDiscountCode(e.target.value)}
                      className="!bg-transparent p-4 w-full rounded border border-neutral-N-50 focus:shadow-none focus:outline-none"
                    />
                    <label className="ml-2 -mt-2" htmlFor="discount_code">
                      {t('Gift Note')}
                    </label>
                  </FloatLabel>

                  <button
                    type="button"
                    className="p-4 rounded border border-neutral-N-50 text-primary-P-40"
                  >
                    {t('Apply')}
                  </button>
                </div>
                <p className="max-w-50 xs:w-full text-xs mt-1 ml-4 text-neutral-N-30">
                  {t(
                    'Item/s will be gift wrapped together and 1 gift note included.',
                  )}
                </p>
                <p className="max-w-50 xs:w-full text-xs mt-1 ml-4 text-neutral-N-30">
                  {t(
                    'Invoice will be excluded from the order, and sent to you via e-mail.',
                  )}
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <div>
                <p className="text-neutral-N-30">{t('Shipping Method')}</p>
                <p className="text-xs text-neutral-N-30">
                  {t('How to ship the package?')}
                </p>
              </div>
              <div className="flex flex-col gap-5">
                <label className="custom-radio flex items-center justify-start gap-3">
                  <input
                    type="radio"
                    checked={shippingMethod === 'free_shipping'}
                    value="free_shipping"
                    onChange={(e) => setShippingMethod(e.target.value)}
                    name="shipping_method"
                    className="w-6 h-6"
                    required
                  />
                  <div className="flex flex-col">
                    <p className="text-neutral-N-10">{t('Ground Shipping')}</p>
                    <span className="text-neutral-N-30 text-xs max-w-67.5">
                      {t('Within 2 business day after dispatch')}
                    </span>
                    <span className="text-neutral-N-30 text-xs max-w-67.5">
                      {t('Free')}
                    </span>
                  </div>
                </label>
                <label className="custom-radio flex items-center justify-start gap-3">
                  <input
                    type="radio"
                    checked={shippingMethod === 'two_days_shipping'}
                    value="two_days_shipping"
                    onChange={(e) => setShippingMethod(e.target.value)}
                    name="shipping_method"
                    className="w-6 h-6"
                    required
                  />
                  <div className="flex flex-col">
                    <p className="text-neutral-N-10">{t('2-Day-shipping')}</p>
                    <span className="text-neutral-N-30 text-xs max-w-67.5">
                      {t(
                        'Within 2 business day after dispatch - not available for PO BOX, APO/ FPO/ DPO',
                      )}
                    </span>
                    <span className="text-neutral-N-30 text-xs max-w-67.5">
                      {t('25.00 AED')}
                    </span>
                  </div>
                </label>
                <label className="custom-radio flex items-center justify-start gap-3">
                  <input
                    type="radio"
                    checked={shippingMethod === 'one_day_shipping'}
                    value="one_day_shipping"
                    onChange={(e) => setShippingMethod(e.target.value)}
                    name="shipping_method"
                    className="w-6 h-6"
                    required
                  />
                  <div className="flex flex-col">
                    <p className="text-neutral-N-10">{t('1-Day-shipping')}</p>
                    <span className="text-neutral-N-30 text-xs max-w-67.5">
                      {t(
                        'Within 1 business day after dispatch - not available for PO BOX, APO/ FPO/ DPO',
                      )}
                    </span>
                    <span className="text-neutral-N-30 text-xs max-w-67.5">
                      {t('35.00 AED')}
                    </span>
                  </div>
                </label>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <div>
                <p className="text-neutral-N-30">{t('Payment')}</p>
                <p className="text-xs text-neutral-N-30">
                  {t('All transaction are secure and encrypted')}
                </p>
                <p className="text-xs text-neutral-N-30">
                  {t('Choose payment method')}
                </p>
              </div>
              <div className="flex flex-col gap-3">
                <BillingFormInputs
                  t={t}
                  direction={direction}
                  newBillingForm={billingForm}
                  setNewBillingForm={setBillingForm}
                />
              </div>
            </div>
            <input
              type="submit"
              value="Buy Now"
              className="py-2.5 px-6 border-transparent text-white bg-primary-P-40 rounded font-medium text-sm"
            />
          </form>
          <div className="h-fit w-full sticky top-58.5 flex flex-col items-stretch justify-start">
            <BagSection t={t} cart={cart} />
            {cart && cart.lines && cart.lines.nodes.length > 0 && (
              <div className="self-stretch max-w-181.75 flex flex-col items-stretch justify-start border-t border-t-neutral-N-80 pt-15">
                <div className="flex items-center justify-between gap-4 mb-8">
                  <h2 className="text-2xl font-semibold">
                    {t('Shipping Cost')}
                  </h2>
                  {cart && cart.cost && cart.cost.checkoutChargeAmount ? (
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
                  {cart && cart.cost && cart.cost.totalTaxAmount ? (
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
                  {cart && cart.cost ? (
                    <Money className="text-2xl" data={cart.cost.totalAmount} />
                  ) : (
                    <></>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
