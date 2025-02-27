import type {
  CartApiQueryFragment,
  FooterQuery,
  HeaderQuery,
} from 'storefrontapi.generated';
import {Footer} from '~/components/Footer';
import {Header} from '~/components/Header';
import {Jsonify} from '@remix-run/server-runtime/dist/jsonify';
import {useCustomContext} from '~/contexts/App';
import FooterMobile from './FooterMobile';
import {submenuType} from '~/root';
import SaleBanner from './SaleBanner';

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
  header: HeaderQuery;
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
          <Footer menus={footer} shop={header.shop} />
        </>
      ) : (
        <></>
      )}
    </div>
  );
}
