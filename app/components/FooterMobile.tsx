import {Location, NavLink, useLocation} from '@remix-run/react';
import {TFunction} from 'i18next';
import {useTranslation} from 'react-i18next';
import {BiShoppingBag} from 'react-icons/bi';
import {BsPerson} from 'react-icons/bs';
import {GoSearch} from 'react-icons/go';
import {CartApiQueryFragment} from 'storefrontapi.generated';

type FooterMobileProps = {
  cart: CartApiQueryFragment | null;
};

const FooterMobile = ({cart}: FooterMobileProps) => {
  const location = useLocation();
  const {t} = useTranslation();

  // Display number of unique items (lines) instead of total quantity
  const uniqueItemsCount = cart?.lines?.nodes?.length || 0;

  return (
    <div className="z-40 fixed w-full lg:hidden bottom-0 border-t border-t-black/15 bg-[#F5F5F5] flex items-stretch justify-between gap-2 px-3.5 mt-auto">
      <NavLink
        prefetch="intent"
        to="/"
        className="flex flex-1 flex-col items-center justify-center gap-1 py-3"
      >
        <div
          className={`${location.pathname === '/' ? 'bg-primary-P-40 text-white' : ''} w-full py-1 xs:px-5 px-1 rounded flex items-center justify-center`}
        >
          <img src="/mobile-logo.png" alt="logo" className="w-6 h-6" />
        </div>
        <p className="text-xs font-semibold text-neutral-N-30">{t('Shop')}</p>
      </NavLink>
      <NavLink
        prefetch="intent"
        to="/search"
        className="flex flex-1 flex-col items-center justify-center gap-1 py-3"
      >
        <div
          className={`${location.pathname === '/search' ? 'bg-primary-P-40 text-white' : ''} w-full py-1 xs:px-5 px-1 rounded flex items-center justify-center`}
        >
          <GoSearch className="w-6 h-6" />
        </div>
        <p className="text-xs font-semibold text-neutral-N-30">{t('Search')}</p>
      </NavLink>
      <MobileCartBadge
        count={uniqueItemsCount}
        location={location}
        t={t}
      />
      <NavLink
        prefetch="intent"
        to="/account/login"
        className="flex flex-1 flex-col items-center justify-center gap-1 py-3"
      >
        <div
          className={`${location.pathname.includes('/account') ? 'bg-primary-P-40 text-white' : ''} w-full py-1 xs:px-5 px-1 rounded flex items-center justify-center`}
        >
          <BsPerson className="w-6 h-6" />
        </div>
        <p className="text-xs font-semibold text-neutral-N-30">
          {t('Account')}
        </p>
      </NavLink>
    </div>
  );
};

function MobileCartBadge({
  t,
  count,
  location,
}: {
  t: TFunction<'translation', undefined>;
  count: number;
  location: Location<any>;
}) {
  return (
    <NavLink
      prefetch="intent"
      to="/bag"
      className="flex flex-1 flex-col items-center justify-center gap-1 py-3"
    >
      <div
        className={`${location.pathname === '/bag' ? 'bg-primary-P-40 text-white' : ''} w-full py-1 xs:px-5 px-1 rounded flex items-center justify-center`}
      >
        <div className="relative">
          <BiShoppingBag className="w-6 h-6" />
          <span className="rounded-full px-1 py-0.5 absolute top-0 left-full -translate-x-1/2 -translate-y-1/2 text-xs text-white leading-none bg-[#8C0009]">
            {count}
          </span>
        </div>
      </div>
      <p className="text-xs font-semibold text-neutral-N-30">{t('Bag')}</p>
    </NavLink>
  );
}

export default FooterMobile;
