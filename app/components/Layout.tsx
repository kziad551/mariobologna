import type {
  CartApiQueryFragment,
  FooterQuery,
} from 'storefrontapi.generated';
import {Footer} from '~/components/Footer';
import {Header} from '~/components/Header';
import {Jsonify} from '@remix-run/server-runtime/dist/jsonify';
import {useCustomContext} from '~/contexts/App';
import FooterMobile from './FooterMobile';
import {submenuType} from '~/root';
import SaleBanner from './SaleBanner';
import type {Shop, Menu} from '@shopify/hydrogen/storefront-api-types';
import {useEffect} from 'react';
import {useLocation} from '@remix-run/react';

// Declare gtag on window
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}

type HeaderData = {
  shop: Pick<Shop, 'id' | 'name' | 'description'> & {
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
  };
  menu: Menu | null;
} | {
  shop: null;
  menu: null;
};

export type LayoutProps = {
  cart: CartApiQueryFragment | null;
  children?: React.ReactNode;
  footer: {
    mainFooter: Jsonify<FooterQuery>;
    aboutFooter: Jsonify<FooterQuery>;
    ordersFooter: Jsonify<FooterQuery>;
    customerFooter: Jsonify<FooterQuery>;
    privacyFooter: Jsonify<FooterQuery>;
  };
  header: Jsonify<HeaderData>;
  submenus: {
    men: submenuType[];
    women: submenuType[];
    kids: submenuType[];
  };
};

export function Layout({
  cart,
  children = null,
  footer,
  header,
  submenus,
}: LayoutProps) {
  const {showHeaderFooter} = useCustomContext();
  const location = useLocation();

  // Track page views with GA4
  useEffect(() => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'page_view', {
        page_title: document.title,
        page_location: window.location.href,
        page_path: location.pathname,
      });
      
      // Also send a standard pageview event
      window.gtag('config', 'G-RRXF8VQM6Q', {
        page_path: location.pathname,
      });
      
      console.log('GA4 page_view event sent for:', location.pathname);
    }
  }, [location.pathname]);

  return (
    <div className="flex flex-col min-h-screen max-w-[2560px] mx-auto">
      {showHeaderFooter && header && (
        <>
          <SaleBanner />
          <Header header={header} cart={cart} submenus={submenus} />
        </>
      )}
      <main className="bg-[#F5F5F5] pb-19.25 lg:pb-0">{children}</main>
      {showHeaderFooter ? (
        <>
          <FooterMobile cart={cart} />
          {footer && <Footer menus={footer} shop={header?.shop} />}
        </>
      ) : (
        <></>
      )}
    </div>
  );
}
