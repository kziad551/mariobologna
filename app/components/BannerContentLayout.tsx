import {NavLink, NavigateFunction, useNavigate} from '@remix-run/react';
import {TFunction} from 'i18next';
import React from 'react';
import {RiArrowRightLine} from 'react-icons/ri';
import {CustomerFragment} from 'storefrontapi.generated';

type BannerContentLayoutProps = {
  children: React.ReactNode;
  selectedPage: string;
  customer: Pick<CustomerFragment, 'email' | 'firstName' | 'lastName'>;
  t: TFunction<'translation', undefined>;
  direction: 'ltr' | 'rtl';
};

export const logout = async (navigate: NavigateFunction) => {
  await fetch('/api/account/authentication/logout', {
    method: 'POST',
  });
  navigate('/', {replace: true});
};

const BannerContentLayout = ({
  t,
  direction,
  selectedPage,
  customer,
  children,
}: BannerContentLayoutProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col md:flex-row items-stretch justify-start gap-8 md:gap-6 px-4 md:px-8 pt-2.5 md:pt-14 pb-13 md:pb-40">
      <div className="shadow-xl shadow-black/15 md:shadow-none md:sticky md:top-30 lg:top-59.75 flex md:flex-col flex-wrap items-stretch justify-between md:justify-start md:p-8 md:w-87.5 md:h-160 bg-neutral-N-90">
        <p className="hidden md:block text-xl mb-3">
          {t('Hi')}{' '}
          {customer.firstName
            ? customer.firstName
            : customer.lastName
              ? customer.lastName
              : t('Customer')}
        </p>
        <p className="hidden md:block text-xl mb-10">
          {customer.email ?? 'email not set'}
        </p>
        <NavLink
          to="/account/orders"
          className="w-fit flex items-center gap-2 text-sm md:text-2xl p-4 md:p-0 md:ml-3 md:mb-8"
        >
          {selectedPage === 'purchases' ? (
            <RiArrowRightLine
              className={`${direction === 'rtl' ? 'rotate-180' : ''} w-5 h-5`}
            />
          ) : (
            <></>
          )}
          {t('My Purchases')}
        </NavLink>
        <NavLink
          to="/account/details"
          className="w-fit flex items-center gap-2 text-sm md:text-2xl p-4 md:p-0 md:ml-3 md:mb-10"
        >
          {selectedPage === 'details' ? (
            <RiArrowRightLine
              className={`${direction === 'rtl' ? 'rotate-180' : ''} w-5 h-5`}
            />
          ) : (
            <></>
          )}
          {t('Personal Details')}
        </NavLink>
        <button
          onClick={() => logout(navigate)}
          className="hidden md:block text-primary-P-40 w-full rounded py-2 md:py-2.5 px-6 border border-neutral-N-50 text-xs md:text-sm"
        >
          {t('Log Out')}
        </button>
      </div>
      {children}
    </div>
  );
};

export default BannerContentLayout;
