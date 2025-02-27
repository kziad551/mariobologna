import {defer, redirect, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {
  NavigateFunction,
  useFetcher,
  useLoaderData,
  useNavigate,
  type MetaFunction,
} from '@remix-run/react';
import React, {useEffect, useRef, useState} from 'react';
import {GoPencil, GoPlus, GoTrash} from 'react-icons/go';
import {MdClose} from 'react-icons/md';
import {FloatLabel} from 'primereact/floatlabel';
import {InputText} from 'primereact/inputtext';
import {IoMdRefresh} from 'react-icons/io';
import BannerContentLayout from '~/components/BannerContentLayout';
import AddressFormInputs from '~/components/AddressFormInputs';
import BillingFormInputs from '~/components/BillingFormInputs';
import {useCustomContext} from '~/contexts/App';
import {tokenCookie, verifyToken, fetchCustomerDetails} from '~/utils/auth';
import {AddressFragment, CustomerFragment} from 'storefrontapi.generated';
import PopupAddressForm from '~/components/Popup/PopupAddress';
import {Maybe} from '@shopify/hydrogen/storefront-api-types';
import {FaSpinner} from 'react-icons/fa6';
import {allDesigners} from '~/data/languages';
import {useTranslation} from 'react-i18next';
import {TFunction} from 'i18next';
import {toggleDesigner} from '~/lib/utils';
import {countries} from '~/data/selectCountries';
import {updateDocumentUsingEmail} from '~/utils/firestore';
import {useRootLoaderData} from '~/root';
// import ReCAPTCHA from 'react-google-recaptcha';

export const meta: MetaFunction = () => {
  return [{title: 'Account Details'}];
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

const AccountDetails = () => {
  const navigate = useNavigate();
  const {customer: initialCustomer} = useLoaderData<typeof loader>();
  const {setCurrentPage, language, direction} = useCustomContext();
  const {t} = useTranslation();
  const fetcher = useFetcher<Maybe<{customer: CustomerFragment | undefined}>>();
  const [customer, setCustomer] = useState(initialCustomer);

  useEffect(() => {
    setCurrentPage('Personal Details');
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
    <div className="account-details">
      <BannerContentLayout
        customer={customer}
        selectedPage="details"
        t={t}
        direction={direction}
      >
        <PersonalDetails
          customer={customer}
          navigate={navigate}
          handleRefetchCustomerDetails={handleRefetchCustomerDetails}
          t={t}
          direction={direction}
          language={language}
        />
      </BannerContentLayout>
    </div>
  );
};

type PersonalDetailsProps = {
  customer: CustomerFragment;
  navigate: NavigateFunction;
  handleRefetchCustomerDetails: () => void;
  t: TFunction<'translation', undefined>;
  direction: 'ltr' | 'rtl';
  language: string;
};

function PersonalDetails({
  t,
  direction,
  language,
  customer,
  navigate,
  handleRefetchCustomerDetails,
}: PersonalDetailsProps) {
  const {header} = useRootLoaderData();
  const {menu} = header;
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [selectedDesigners, setSelectedDesigners] = useState<
    {[key: string]: string}[]
  >(() => {
    if (typeof window !== 'undefined') {
      // Read from local storage on initial load
      const savedDesigners = localStorage.getItem('designers');
      return savedDesigners
        ? (JSON.parse(savedDesigners) as {[key: string]: string}[])
        : [];
    }
    return [];
  });
  const [allDesigners, setAllDesigners] = useState<any | null>(null);
  const [toggleForm, setToggleForm] = useState<{[x: string]: boolean}>({});
  const [emailForm, setEmailForm] = useState<{[x: string]: string}>({});
  const [passwordForm, setPasswordForm] = useState<{[x: string]: string}>({});
  const [newAddressForm, setNewAddressForm] = useState<{[x: string]: string}>(
    {},
  );
  const [newBillingForm, setNewBillingForm] = useState<{[x: string]: string}>(
    {},
  );
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

  // const siteKey = import.meta.env.RECAPTCHA_SITE_KEY;
  // const [captchaVerified, setCaptchaVerified] = useState(false);

  // const verifyCallback = (response: string | null) => {
  //   if (response) {
  //     setCaptchaVerified(true);
  //   } else {
  //     setCaptchaVerified(false);
  //   }
  // };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('designers', JSON.stringify(selectedDesigners));
    }
  }, [selectedDesigners]);

  useEffect(() => {
    if (menu) {
      const designers =
        menu.items.find((item) => item.title === 'Designers') ?? null;
      if (designers) {
        const allDesigners =
          designers.items.find((item) => item.title === 'All Designers')
            ?.items ?? null;
        setAllDesigners(allDesigners);
      }
    }
  }, [menu]);

  const handleEditAddress = (
    address: AddressFragment,
    isDefault: boolean = false,
  ) => {
    const country = countries.find((item) => item.value === address.country);
    setNewAddressForm({
      addressId: address.id,
      firstName: address.firstName ?? '',
      lastName: address.lastName ?? '',
      company: address.company ?? '',
      phone: address.phone ?? '',
      address1: address.address1 ?? '',
      zip: address.zip ?? '',
      city: address.city ?? '',
      country: address.country ?? '',
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
    setErrorMessage('');
    setLoadingSubmit(true);
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
      setToggleForm({personal_address: false});
      setNewAddressForm({});
      addressRef.current.closeTrigger();
      handleRefetchCustomerDetails();
    } else {
      console.log('result', result);
      setErrorMessage(result.formError);
    }
    setLoadingSubmit(false);
  };

  const handleDeleteAddress = async (addressId: string) => {
    setLoadingSubmit(true);
    const response = await fetch('/api/account/details/address', {
      method: 'DELETE',
      body: JSON.stringify({addressId}),
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
      handleRefetchCustomerDetails();
    } else {
      console.log('result', result);
    }
    setLoadingSubmit(false);
  };

  return (
    <div className="flex-1 flex flex-col items-stretch gap-8 md:gap-5">
      <h1 className="text-2xl md:mb-10">{t('Access Your Account')}</h1>
      <div className="flex flex-col gap-8">
        <EmailSection
          toggleForm={toggleForm}
          setToggleForm={setToggleForm}
          emailForm={emailForm}
          setEmailForm={setEmailForm}
          currentEmail={customer.email as string}
          handleRefetchCustomerDetails={handleRefetchCustomerDetails}
          navigate={navigate}
          t={t}
          direction={direction}
        />
        <div className="h-0.25 bg-neutral-N-80" />
        <PasswordSection
          email={customer.email as string}
          toggleForm={toggleForm}
          setToggleForm={setToggleForm}
          passwordForm={passwordForm}
          setPasswordForm={setPasswordForm}
          navigate={navigate}
          t={t}
          direction={direction}
        />
        <div className="h-0.25 bg-neutral-N-80" />
        <div className="flex flex-col mt-2 md:mt-0 gap-2">
          <p className="md:text-xl">{t('Personal Information')}</p>
          {/* <p className="text-sm md:text-base max-w-123.5">
            {t('address_note')}
          </p> */}
        </div>
        <div className="flex flex-col gap-2">
          <p className="md:text-xl">{t('My Addresses')}</p>
          {customer.defaultAddress ? (
            <div className="relative flex items-stretch justify-between gap-2">
              <div className="text-sm md:text-base flex flex-col">
                {customer.defaultAddress.firstName ? (
                  <p>{customer.defaultAddress.firstName}</p>
                ) : (
                  <></>
                )}
                {customer.defaultAddress.lastName ? (
                  <p>{customer.defaultAddress.lastName}</p>
                ) : (
                  <></>
                )}
                {customer.defaultAddress.address1 ? (
                  <p>
                    {t('Street')} {customer.defaultAddress.address1}
                  </p>
                ) : (
                  <></>
                )}
                {customer.defaultAddress.zip ? (
                  <p>
                    {t('Postal Code')}: {customer.defaultAddress.zip}
                  </p>
                ) : (
                  <></>
                )}
                {customer.defaultAddress.city ? (
                  <p>{customer.defaultAddress.city}</p>
                ) : (
                  <></>
                )}
                {customer.defaultAddress.country ? (
                  <p>{customer.defaultAddress.country}</p>
                ) : (
                  <></>
                )}
                {customer.defaultAddress.phone ? (
                  <p>
                    {t('Mobile phone:')} {customer.defaultAddress.phone}
                  </p>
                ) : (
                  <></>
                )}
              </div>
              <p className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-[30deg] text-neutral-N-80/20 text-5xl font-black">
                {t('DEFAULT')}
              </p>
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
          ) : (
            <></>
          )}
          {customer.addresses.nodes.map((address) =>
            customer.defaultAddress?.id !== address.id ? (
              <div
                key={address.id}
                className="flex items-stretch justify-between gap-2"
              >
                <div className="text-sm md:text-base flex flex-col">
                  {address.firstName ? <p>{address.firstName}</p> : <></>}
                  {address.lastName ? <p>{address.lastName}</p> : <></>}
                  {address.address1 ? (
                    <p>
                      {t('Street:')} {address.address1}
                    </p>
                  ) : (
                    <></>
                  )}
                  {address.zip ? (
                    <p>
                      {t('Postal Code')}: {address.zip}
                    </p>
                  ) : (
                    <></>
                  )}
                  {address.city ? <p>{address.city}</p> : <></>}
                  {address.country ? <p>{address.country}</p> : <></>}
                  {address.phone ? (
                    <p>
                      {t('Mobile phone:')} {address.phone}
                    </p>
                  ) : (
                    <></>
                  )}
                </div>
                <div className="flex flex-col items-end justify-between">
                  <button
                    onClick={() => handleEditAddress(address)}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-primary-P-40"
                  >
                    <GoPencil className="w-4.5 h-4.5" />
                    <span>{t('Edit')}</span>
                  </button>
                  <button
                    disabled={loadingSubmit}
                    onClick={() => handleDeleteAddress(address.id)}
                    className={`${loadingSubmit ? 'opacity-50' : ''} flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-primary-P-40`}
                  >
                    {!loadingSubmit ? (
                      <GoTrash className="w-4.5 h-4.5" />
                    ) : (
                      <FaSpinner className="w-4.5 h-4.5 animate-spin" />
                    )}
                    <span>
                      {!loadingSubmit ? t('Delete') : t('Loading...')}
                    </span>
                  </button>
                </div>
              </div>
            ) : (
              <></>
            ),
          )}
        </div>
        <div className="h-0.25 bg-neutral-N-80" />
        <AddNewAddressSection
          t={t}
          direction={direction}
          toggleForm={toggleForm}
          setToggleForm={setToggleForm}
          newAddressForm={newAddressForm}
          setNewAddressForm={setNewAddressForm}
          customer={customer}
          email={customer.email as string}
          navigate={navigate}
          handleRefetchCustomerDetails={handleRefetchCustomerDetails}
        />
        {/* <div className="h-0.25 bg-neutral-N-80" /> */}
        {/* <div className="flex items-start justify-between gap-2">
          <div className="flex flex-col gap-2">
            <p className="md:text-xl">{t('Billing Details')}</p>
            <p className="text-sm md:text-base max-w-123.5">
              {t('billing_note')}
            </p>
          </div>
        </div> */}
        {/* <div className="flex flex-col gap-2">
          <p className="md:text-xl">{t('My Payment')}</p>
        </div> */}
        {/* <div className="h-0.25 bg-neutral-N-80" /> */}
        {/* <AddNewBillingSection
          t={t}
          direction={direction}
          toggleForm={toggleForm}
          setToggleForm={setToggleForm}
          newBillingForm={newBillingForm}
          setNewBillingForm={setNewBillingForm}
        /> */}
        <div className="h-0.25 bg-neutral-N-80" />
        <p className="md:text-xl">{t('Favourite Designers')}</p>
        <div className="flex flex-wrap gap-2">
          {allDesigners ? (
            allDesigners.map((designer: any) => (
              <button
                key={designer.title}
                className={`${
                  selectedDesigners.some((d) => d === designer.title)
                    ? 'bg-secondary-S-90 text-white border-transparent'
                    : 'bg-transparent text-neutral-N-30 border-neutral-N-50'
                } px-3 py-1.5 border rounded-lg text-sm font-medium transition-all`}
                onClick={() =>
                  toggleDesigner(setSelectedDesigners, designer.title)
                }
              >
                <span className="text-sm md:text-base flex items-center gap-2">
                  {t(designer.title)}
                  <MdClose
                    className={`${selectedDesigners.includes(designer) ? 'block' : 'hidden'} w-4.5 h-4.5`}
                  />
                </span>
              </button>
            ))
          ) : (
            <></>
          )}
        </div>
        <div className="h-0.25 bg-neutral-N-80" />
      </div>
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
    </div>
  );
}

type EmailSectionType = {
  toggleForm: {[x: string]: boolean};
  setToggleForm: React.Dispatch<
    React.SetStateAction<{
      [x: string]: boolean;
    }>
  >;
  emailForm: {[x: string]: string};
  setEmailForm: React.Dispatch<
    React.SetStateAction<{
      [x: string]: string;
    }>
  >;
  currentEmail: string;
  navigate: NavigateFunction;
  handleRefetchCustomerDetails: () => void;
  t: TFunction<'translation', undefined>;
  direction: 'ltr' | 'rtl';
};

function EmailSection({
  t,
  direction,
  toggleForm,
  setToggleForm,
  emailForm,
  setEmailForm,
  currentEmail,
  navigate,
  handleRefetchCustomerDetails,
}: EmailSectionType) {
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [submitAvailable, setSubmitAvailable] = useState(false);

  const handleNewEmailSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoadingSubmit(true);
    const newEmail = emailForm['new_email'];
    const response = await fetch('/api/account/details/update', {
      method: 'POST',
      body: JSON.stringify({email: newEmail}),
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
      setToggleForm({email: false});
      setEmailForm({});
      setSubmitAvailable(false);
      handleRefetchCustomerDetails();
    } else {
      console.log('result', result);
    }
    setLoadingSubmit(false);
  };

  return (
    <>
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="flex flex-col gap-2">
          <p className="md:text-xl">{t('Your Email Address')}</p>
          <input
            readOnly
            disabled
            type="email"
            name="email"
            id="email"
            value={currentEmail}
            className="outline-none border-none text-sm md:text-base bg-transparent cursor-text"
          />
        </div>
        <button
          onClick={(e) => setToggleForm({email: !toggleForm['email']})}
          className="flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-primary-P-40"
        >
          {!toggleForm['email'] ? (
            <GoPencil className="w-4.5 h-4.5" />
          ) : (
            <MdClose className="w-4.5 h-4.5" />
          )}
          <span>{!toggleForm['email'] ? t('Change Email') : t('Close')}</span>
        </button>
      </div>
      {toggleForm['email'] ? (
        <form
          onSubmit={handleNewEmailSubmit}
          className="max-w-133.5 flex flex-col items-stretch gap-4 md:gap-8"
        >
          <p className="text-sm md:text-base font-medium">{t('email_note')}</p>
          <div className={direction === 'rtl' ? 'rtl-container' : ''}>
            <FloatLabel>
              <InputText
                required
                id="new_email"
                type="email"
                value={emailForm['new_email'] ?? ''}
                onChange={(e) =>
                  setEmailForm((prevSelected) => ({
                    ...prevSelected,
                    ['new_email']: e.target.value,
                  }))
                }
                className="!bg-transparent p-4 w-full rounded border border-neutral-N-50 focus:shadow-none focus:outline-none"
              />
              <label className="ml-2 -mt-2" htmlFor="new_email">
                {t('Enter a new email address')}
              </label>
            </FloatLabel>
          </div>
          <div className={direction === 'rtl' ? 'rtl-container' : ''}>
            <FloatLabel>
              <InputText
                required
                id="code"
                invalid={emailForm['code'] !== undefined && !submitAvailable}
                type="text"
                value={emailForm['code'] ?? ''}
                onChange={(e) => {
                  setEmailForm((prevSelected) => ({
                    ...prevSelected,
                    ['code']: e.target.value,
                  }));
                  if (e.target.value === 'hfxfpq') {
                    setSubmitAvailable(true);
                  } else {
                    setSubmitAvailable(false);
                  }
                }}
                className="!bg-transparent p-4 w-full rounded border border-neutral-N-50 focus:shadow-none focus:outline-none"
              />
              <label className="ml-2 -mt-2" htmlFor="code">
                {t('Enter text in the image')}
              </label>
            </FloatLabel>
          </div>
          <div className="flex items-center justify-start gap-2">
            <img src="/recaptcha.png" alt="captcha" />
            <button type="button">
              <IoMdRefresh className="w-6 h-6" />
            </button>
          </div>
          <input
            type="submit"
            value={!loadingSubmit ? t('Save') : t('Saving')}
            disabled={loadingSubmit || !submitAvailable}
            className={`${loadingSubmit || !submitAvailable ? 'opacity-50' : ''} py-2.5 px-6 border-transparent text-white bg-primary-P-40 rounded font-medium text-sm`}
          />
        </form>
      ) : (
        <></>
      )}
    </>
  );
}

type PasswordSectionType = {
  email: string;
  toggleForm: {[x: string]: boolean};
  setToggleForm: React.Dispatch<
    React.SetStateAction<{
      [x: string]: boolean;
    }>
  >;
  passwordForm: {[x: string]: string};
  setPasswordForm: React.Dispatch<
    React.SetStateAction<{
      [x: string]: string;
    }>
  >;
  navigate: NavigateFunction;
  t: TFunction<'translation', undefined>;
  direction: 'ltr' | 'rtl';
};

function PasswordSection({
  t,
  direction,
  email,
  toggleForm,
  setToggleForm,
  passwordForm,
  setPasswordForm,
  navigate,
}: PasswordSectionType) {
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [submitAvailable, setSubmitAvailable] = useState(false);

  const handleNewPasswordSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();
    setLoadingSubmit(true);
    const newPassword = passwordForm['new_password'];
    const response = await fetch('/api/account/details/update', {
      method: 'POST',
      body: JSON.stringify({password: newPassword}),
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
      await updateDocumentUsingEmail(email, newPassword);
      setToggleForm({password: false});
      setPasswordForm({});
      setSubmitAvailable(false);
      navigate(result.redirect);
    }
    setLoadingSubmit(false);
  };

  return (
    <>
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="flex flex-col gap-2">
          <p className="text-sm md:text-xl">{t('Password')}</p>
          <input
            readOnly
            disabled
            type="password"
            name="password"
            id="password"
            value="12345678987654321"
            className="outline-none text-sm md:text-base border-none bg-transparent cursor-text"
          />
        </div>
        <button
          onClick={(e) => setToggleForm({password: !toggleForm['password']})}
          className="flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-primary-P-40"
        >
          {!toggleForm['password'] ? (
            <GoPencil className="w-4.5 h-4.5" />
          ) : (
            <MdClose className="w-4.5 h-4.5" />
          )}
          <span>
            {!toggleForm['password'] ? t('Change Password') : t('Close')}
          </span>
        </button>
      </div>
      {toggleForm['password'] ? (
        <form
          onSubmit={handleNewPasswordSubmit}
          className="max-w-133.5 flex flex-col items-stretch gap-4 md:gap-8"
        >
          <p className="text-sm md:text-base font-medium">
            {t('password_note')}
          </p>
          <div className={direction === 'rtl' ? 'rtl-container' : ''}>
            <FloatLabel>
              <InputText
                required
                id="new_password"
                type="text"
                value={passwordForm['new_password'] ?? ''}
                onChange={(e) =>
                  setPasswordForm((prevSelected) => ({
                    ...prevSelected,
                    ['new_password']: e.target.value,
                  }))
                }
                className="!bg-transparent p-4 w-full rounded border border-neutral-N-50 focus:shadow-none focus:outline-none"
              />
              <label className="ml-2 -mt-2" htmlFor="new_password">
                {t('Enter a new password')}
              </label>
            </FloatLabel>
          </div>
          <div className={direction === 'rtl' ? 'rtl-container' : ''}>
            <FloatLabel>
              <InputText
                required
                id="conf_password"
                type="password"
                invalid={
                  passwordForm['conf_password'] !== undefined &&
                  passwordForm['new_password'] !== passwordForm['conf_password']
                }
                value={passwordForm['conf_password'] ?? ''}
                onChange={(e) => {
                  setPasswordForm((prevSelected) => ({
                    ...prevSelected,
                    ['conf_password']: e.target.value,
                  }));
                  if (
                    e.target.value === passwordForm['new_password'] &&
                    passwordForm['code'] === 'hfxfpq'
                  ) {
                    setSubmitAvailable(true);
                  } else {
                    setSubmitAvailable(false);
                  }
                }}
                className="!bg-transparent p-4 w-full rounded border border-neutral-N-50 focus:shadow-none focus:outline-none"
              />
              <label className="ml-2 -mt-2" htmlFor="conf_password">
                {t('Confirm the new password')}
              </label>
            </FloatLabel>
          </div>
          <div className={direction === 'rtl' ? 'rtl-container' : ''}>
            <FloatLabel>
              <InputText
                required
                id="code"
                invalid={
                  passwordForm['code'] !== undefined &&
                  passwordForm['code'] !== 'hfxfpq'
                }
                type="text"
                value={passwordForm['code'] ?? ''}
                onChange={(e) => {
                  setPasswordForm((prevSelected) => ({
                    ...prevSelected,
                    ['code']: e.target.value,
                  }));
                  if (
                    e.target.value === 'hfxfpq' &&
                    passwordForm['conf_password'] ===
                      passwordForm['new_password']
                  ) {
                    setSubmitAvailable(true);
                  } else {
                    setSubmitAvailable(false);
                  }
                }}
                className="!bg-transparent p-4 w-full rounded border border-neutral-N-50 focus:shadow-none focus:outline-none"
              />
              <label className="ml-2 -mt-2" htmlFor="code">
                {t('Enter text in the image')}
              </label>
            </FloatLabel>
          </div>
          <div className="flex items-center justify-start gap-2">
            <img src="/recaptcha.png" alt="captcha" />
            <button type="button">
              <IoMdRefresh className="w-6 h-6" />
            </button>
          </div>
          <input
            type="submit"
            value={!loadingSubmit ? t('Save') : t('Saving')}
            disabled={loadingSubmit || !submitAvailable}
            className={`${loadingSubmit || !submitAvailable ? 'opacity-50' : ''} py-2.5 px-6 border-transparent text-white bg-primary-P-40 rounded font-medium text-sm`}
          />
        </form>
      ) : (
        <></>
      )}
    </>
  );
}
type AddNewAddressSectionType = {
  t: TFunction<'translation', undefined>;
  direction: 'ltr' | 'rtl';
  toggleForm: {[x: string]: boolean};
  setToggleForm: React.Dispatch<
    React.SetStateAction<{
      [x: string]: boolean;
    }>
  >;
  newAddressForm: {[x: string]: string};
  setNewAddressForm: React.Dispatch<
    React.SetStateAction<{
      [x: string]: string;
    }>
  >;
  customer: CustomerFragment;
  navigate: NavigateFunction;
  email?: string;
  handleRefetchCustomerDetails: () => void;
};

function AddNewAddressSection({
  t,
  direction,
  toggleForm,
  setToggleForm,
  newAddressForm,
  setNewAddressForm,
  customer,
  navigate,
  email = 'Email not provided yet',
  handleRefetchCustomerDetails,
}: AddNewAddressSectionType) {
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  function formatPhoneNumber(phone: string, dialingCode: string): string {
    if (!phone.startsWith('+')) {
      return `${dialingCode}${phone}`;
    }
    return phone;
  }

  const handleNewAddressSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();
    let flag = true;
    setLoadingSubmit(true);
    const country = countries.find(
      (item) => item.value === newAddressForm.country,
    );
    const formattedPhoneNumber = formatPhoneNumber(
      newAddressForm.phone,
      country?.dialing_code ?? '',
    );
    if (!customer.defaultAddress) {
      const body = {
        firstName: newAddressForm['firstName'],
        lastName: newAddressForm['lastName'],
        phone: newAddressForm['phone'],
      };
      const updateResponse = await fetch('/api/account/details/update', {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
          'Content-Type': 'application/json',
          Accept: 'Application/json',
        },
      });
      const updateResult = (await updateResponse.json()) as any;
      if (typeof updateResult === 'string') {
        navigate(updateResult);
      }
      if (!updateResult.success) {
        flag = false;
        console.log('updateResult', updateResult);
      }
    }
    if (flag) {
      const address = {
        ...newAddressForm,
        phone: formattedPhoneNumber,
        addressId: 'add',
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
        setToggleForm({personal_address: false});
        setNewAddressForm({});
        handleRefetchCustomerDetails();
      } else {
        console.log('result', result);
      }
    }
    setLoadingSubmit(false);
  };

  return (
    <>
      <div className="flex items-start justify-between gap-2">
        <p className="md:text-xl">{t('Add New Address')}</p>
        <button
          onClick={(e) =>
            setToggleForm({personal_address: !toggleForm['personal_address']})
          }
          className="flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-primary-P-40"
        >
          {!toggleForm['personal_address'] ? (
            <GoPlus className="w-4.5 h-4.5" />
          ) : (
            <MdClose className="w-4.5 h-4.5" />
          )}
          <span>{!toggleForm['personal_address'] ? t('Add') : t('Close')}</span>
        </button>
      </div>
      {toggleForm['personal_address'] ? (
        <form
          onSubmit={handleNewAddressSubmit}
          className="max-w-133.5 flex flex-col items-stretch gap-4 md:gap-8"
        >
          <div className={direction === 'rtl' ? 'rtl-container' : ''}>
            <FloatLabel>
              <InputText
                disabled
                readOnly
                type="email"
                value={email ?? ''}
                className="!bg-transparent p-4 w-full rounded border border-neutral-N-50 focus:shadow-none focus:outline-none"
              />
              <label className="ml-2 -mt-2" htmlFor="email">
                {t('Email address')}
              </label>
            </FloatLabel>
          </div>
          <AddressFormInputs
            addressForm={newAddressForm}
            setAddressForm={setNewAddressForm}
            t={t}
            direction={direction}
          />
          <input
            type="submit"
            value={!loadingSubmit ? t('Save') : t('Saving')}
            disabled={loadingSubmit}
            className={`${loadingSubmit ? 'opacity-50' : ''} py-2.5 px-6 border-transparent text-white bg-primary-P-40 rounded font-medium text-sm`}
          />
        </form>
      ) : (
        <></>
      )}
    </>
  );
}

type AddNewBillingSectionType = {
  t: TFunction<'translation', undefined>;
  direction: 'ltr' | 'rtl';
  toggleForm: {[x: string]: boolean};
  setToggleForm: React.Dispatch<
    React.SetStateAction<{
      [x: string]: boolean;
    }>
  >;
  newBillingForm: {[x: string]: string};
  setNewBillingForm: React.Dispatch<
    React.SetStateAction<{
      [x: string]: string;
    }>
  >;
};

function AddNewBillingSection({
  t,
  direction,
  toggleForm,
  setToggleForm,
  newBillingForm,
  setNewBillingForm,
}: AddNewBillingSectionType) {
  return (
    <>
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-col gap-2">
          <p className="md:text-xl">{t('Add a New Billing')}</p>
        </div>
        <button
          onClick={(e) =>
            setToggleForm({billing_address: !toggleForm['billing_address']})
          }
          className="flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-primary-P-40"
        >
          {!toggleForm['billing_address'] ? (
            <GoPlus className="w-4.5 h-4.5" />
          ) : (
            <MdClose className="w-4.5 h-4.5" />
          )}
          <span>{!toggleForm['billing_address'] ? t('Add') : t('Close')}</span>
        </button>
      </div>
      {toggleForm['billing_address'] ? (
        <form
          action=""
          className="max-w-133.5 flex flex-col items-stretch gap-3"
        >
          <BillingFormInputs
            t={t}
            direction={direction}
            newBillingForm={newBillingForm}
            setNewBillingForm={setNewBillingForm}
          />
          <input
            type="submit"
            value={t('Save')}
            className="py-2.5 px-6 border-transparent text-white bg-primary-P-40 rounded font-medium text-sm"
          />
        </form>
      ) : (
        <></>
      )}
    </>
  );
}

export default AccountDetails;
