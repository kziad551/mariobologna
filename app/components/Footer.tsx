import React, {Suspense, useRef, useState} from 'react';
import {Link, NavLink, useNavigate} from '@remix-run/react';
import {BsTwitterX} from 'react-icons/bs';
import {FaFacebook, FaInstagram, FaLinkedin, FaTiktok, FaYoutube} from 'react-icons/fa';
import {IoStarSharp} from 'react-icons/io5';
const QRCode = React.lazy(() => import('react-qr-code'));
import type {FooterQuery} from 'storefrontapi.generated';
import {useRootLoaderData} from '~/root';
import {Jsonify} from '@remix-run/server-runtime/dist/jsonify';
import {IoIosArrowForward} from 'react-icons/io';
import {Domain, Shop} from '@shopify/hydrogen/storefront-api-types';
import {useCustomContext} from '~/contexts/App';
import {useTranslation} from 'react-i18next';
import {Dropdown} from 'primereact/dropdown';
import CurrencyDropdown from './Currency';
import {TFunction} from 'i18next';
import PopupLocateStore from './Popup/PopupLocateStore';
import {markScrollToProducts} from '~/lib/scrollFlag';

type ShopData = (Pick<Shop, 'id' | 'name' | 'description'> & {
  primaryDomain: {
    url: string;
  };
  brand?: {
    logo?: {
      image?: {
        url?: string;
      };
    };
  };
}) | null;

type FooterProps = {
  menus: {
    mainFooter: Jsonify<FooterQuery>;
    aboutFooter: Jsonify<FooterQuery>;
    ordersFooter: Jsonify<FooterQuery>;
    customerFooter: Jsonify<FooterQuery>;
    privacyFooter: Jsonify<FooterQuery>;
  };
  shop: ShopData;
  showFooterAlways?: boolean;
};

export function Footer({menus, shop, showFooterAlways = false}: FooterProps) {
  const storeRef = useRef<{
    openTrigger: () => void;
    closeTrigger: () => void;
  }>({
    openTrigger: () => {},
    closeTrigger: () => {},
  });

  const {language, setLanguage, direction} = useCustomContext();
  const {t} = useTranslation();

  const footerLinks = [
    {
      name: t('Shop'),
      menu: menus?.mainFooter,
    },
    {
      name: t('About Us'),
      menu: menus?.aboutFooter,
    },
    {
      name: t('Orders'),
      menu: menus?.ordersFooter,
    },
    {
      name: t('Customer Care'),
      menu: menus?.customerFooter,
    },
    {
      name: t('Privacy'),
      menu: menus?.privacyFooter,
    },
  ].filter(link => link.menu?.menu?.items?.length);

  if (!shop?.primaryDomain) {
    return null;
  }

  const currentYear = new Date().getFullYear();

  const langs: any[] = [
    {value: 'en', name: 'English'},
    {value: 'ar', name: 'العربية'},
  ];

  return (
    <footer
      className={`${showFooterAlways ? 'block' : 'hidden lg:block'} mt-auto px-4 pb-20 md:py-20 md:px-8 bg-[#F5F5F5]`}
    >
      <FooterMenus
        footerLinks={footerLinks}
        menus={menus}
        primaryDomain={shop.primaryDomain}
        direction={direction}
        t={t}
      />
      <FooterMenusMobile
        footerLinks={footerLinks}
        menus={menus}
        primaryDomain={shop.primaryDomain}
        t={t}
        direction={direction}
      />
      <div className="border-t border-t-neutral-800 mt-12 md:mt-20 pt-8 flex flex-col sm:flex-row flex-wrap items-start justify-between gap-10">
        <div className="min-w-64">
          <h2 className="font-semibold mb-6">{t('Country & Language')}</h2>
          <div className="flex flex-wrap gap-0.5">
            <CurrencyDropdown />
            <Dropdown
              id="language"
              value={language}
              onChange={(e) => setLanguage(e.value)}
              options={langs}
              optionLabel="name"
              className="flex items-center gap-2 px-3 py-2.5 !border-none !shadow-none !bg-transparent hover:!bg-neutral-N-92 active:!bg-neutral-N-87 transition-all rounded-md"
              checkmark={true}
              highlightOnSelect={false}
            />
          </div>
        </div>
        <div className="min-w-64">
          <h2 className="font-semibold mb-6">{t('Find Us')}</h2>
          <button
            onClick={() => storeRef.current.openTrigger()}
            className="bg-primary-P-40 text-white border text-sm py-2.5 px-14 border-primary-P-40 rounded-md transition-all hover:shadow-md hover:shadow-black/30 active:shadow-none"
          >
            {t('Locate a Store')}
          </button>
        </div>
        <div className="min-w-64">
          <h2 className="font-semibold mb-6">{t('Follow Us')}</h2>
          <div className="flex flex-wrap gap-3">
            <Link
              to="https://www.facebook.com/mario.bologna.79?mibextid=JRoKGi"
              target="_blank"
            >
              <FaFacebook className="w-6 h-6 text-black" />
            </Link>
            <Link
              to="https://www.instagram.com/mariobologna.ae?igsh=NzRkb2tsdWMwdHM3"
              target="_blank"
            >
              <FaInstagram className="w-6 h-6 text-black" />
            </Link>
            <Link to="https://x.com/mariobologna_ae?s=11" target="_blank">
              <BsTwitterX className="w-6 h-6 text-black" />
            </Link>
            <Link
              to="https://www.tiktok.com/@mariobologna.ae?_t=8pnPxd3XH97&_r=1"
              target="_blank"
            >
              <FaTiktok className="w-6 h-6 text-black" />
            </Link>

            {/* <FaLinkedin className="w-6 h-6 text-black" />
            <FaYoutube className="w-6 h-6 text-black" /> */}
          </div>
        </div>
        {/* <div className="hidden sm:block min-w-64">
          <h2 className="font-semibold mb-6">
            {t('Shop anywhere, anytime with the App')}
          </h2>
          <Suspense fallback={<div>{t('Loading...')}</div>}>
            <QRCode
              className="max-w-44 h-auto"
              bgColor="transparent"
              value="null"
            />
          </Suspense>
        </div> */}
        <p className="text-sm w-full">
          {t('All rights reserved', {year: currentYear})}
        </p>
      </div>
      <PopupLocateStore ref={storeRef} t={t} direction={direction} />
    </footer>
  );
}

type FooterMenusProps = {
  footerLinks: {
    name: string;
    menu: FooterQuery;
  }[];
  menus: any;
  primaryDomain: {
    url: string;
  };
  direction: 'ltr' | 'rtl';
  t: TFunction<'translation', undefined>;
};

function FooterMenusMobile({
  footerLinks,
  menus,
  primaryDomain,
  direction,
  t,
}: FooterMenusProps) {
  const [openMenu, setOpenMenu] = useState<{[x: string]: boolean}>({});

  return (
    <div className="border-t border-neutral-N-80 pt-12 flex sm:hidden flex-col flex-wrap items-stretch justify-between gap-4.5">
      {footerLinks.map((footer) => (
        <div
          key={footer.name}
          className={`${footer.name === 'Privacy' ? '' : 'border-b border-b-neutral-N-30 pb-4.5'} min-w-64`}
        >
          <button
            onClick={() => setOpenMenu({[footer.name]: !openMenu[footer.name]})}
            className="w-full flex items-center justify-between gap-2 cursor-pointer"
          >
            <h2 className="font-semibold">{t(`${footer.name}`)}</h2>
            <IoIosArrowForward
              className={`${direction === 'rtl' ? 'rotate-180' : ''} w-6 h-6`}
            />
          </button>
          {openMenu[footer.name] ? (
            <div className="mt-2 flex flex-col items-start justify-start gap-1">
              {menus && primaryDomain.url && (
                <FooterMenu
                  menu={footer.menu['menu']}
                  primaryDomainUrl={primaryDomain.url}
                  t={t}
                />
              )}
            </div>
          ) : (
            <></>
          )}
        </div>
      ))}
    </div>
  );
}

function FooterMenus({footerLinks, menus, primaryDomain, t}: FooterMenusProps) {
  return (
    <div className="border-t border-neutral-N-80 pt-20 md:pt-44 hidden sm:flex flex-wrap items-start justify-between gap-10">
      {footerLinks.map((footer) => (
        <div key={footer.name} className="min-w-64">
          <h2 className="font-semibold mb-6">{t(`${footer.name}`)}</h2>
          <div className="flex flex-col items-start justify-start gap-4">
            {menus && primaryDomain.url && (
              <FooterMenu
                t={t}
                menu={footer.menu['menu']}
                primaryDomainUrl={primaryDomain.url}
              />
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function useCollectionNav() {
  const navigate = useNavigate();
  return (to: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    markScrollToProducts();
    navigate(to, { preventScrollReset: true });
  };
}

function FooterMenu({
  t,
  menu,
  primaryDomainUrl,
}: {
  menu: FooterQuery['menu'];
  primaryDomainUrl: string;
  t: TFunction<'translation', undefined>;
}) {
  const {publicStoreDomain} = useRootLoaderData();
  const goToCollection = useCollectionNav();

  return (
    menu &&
    menu.items.map((item) => {
      if (!item.url) return null;
      // if the url is internal, we strip the domain
      const newURL = new URL(item.url);
      const url =
        item.url.includes('myshopify.com') ||
        item.url.includes(publicStoreDomain) ||
        item.url.includes(primaryDomainUrl)
          ? newURL.pathname + newURL.hash
          : item.url;
      const isExternal = !url.startsWith('/');
      const isCollectionUrl = url.startsWith('/collections/');
      
      return isExternal ? (
        <a
          href={url}
          key={item.id}
          className="text-sm hover:underline cursor-pointer"
          rel="noopener noreferrer"
          target="_blank"
        >
          {t(`${item.title}`)}
        </a>
      ) : item.title === 'New Arrivals' ? (
        <div
          key={item.id}
          className="group flex items-center justify-start cursor-pointer"
        >
          <NavLink
            end
            key={item.id}
            className="text-sm group-hover:underline"
            prefetch="intent"
            to="/collections/new-arrivals"
            onClick={goToCollection('/collections/new-arrivals')}
          >
            {t(`${item.title}`)}
          </NavLink>
          <IoStarSharp className="w-6 h-6 text-yellow-600" />
        </div>
      ) : isCollectionUrl ? (
        <NavLink
          end
          key={item.id}
          className="text-sm hover:underline cursor-pointer"
          prefetch="intent"
          to={url}
          onClick={goToCollection(url)}
        >
          {t(`${item.title}`)}
        </NavLink>
      ) : (
        <NavLink
          end
          key={item.id}
          className="text-sm hover:underline cursor-pointer"
          prefetch="intent"
          to={url}
        >
          {t(`${item.title}`)}
        </NavLink>
      );
    })
  );
}
