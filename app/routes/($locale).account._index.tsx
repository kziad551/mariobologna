import {defer, redirect, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {
  Await,
  Link,
  useLoaderData,
  useNavigate,
  type MetaFunction,
} from '@remix-run/react';
import React, {Suspense, useEffect} from 'react';
import {logout} from '~/components/BannerContentLayout';
import {useCustomContext} from '~/contexts/App';
import {fetchCustomerDetails, tokenCookie} from '~/utils/auth';
import useWindowDimensions from '~/hooks/useWindowDimensions';
import {Footer} from '~/components/Footer';
import {useRootLoaderData} from '~/root';
import {useWishlist} from '~/contexts/WishList';
import {useTranslation} from 'react-i18next';

export const meta: MetaFunction = () => {
  return [{title: 'Account'}];
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
  const {t} = useTranslation();
  const data = useRootLoaderData();
  const {width, height} = useWindowDimensions(50);
  const navigate = useNavigate();
  const {setCurrentPage, setShowHeaderFooter, setShowBoardingPage} =
    useCustomContext();
  const {wishlist} = useWishlist();
  const {customer} = useLoaderData<typeof loader>();

  useEffect(() => {
    setCurrentPage('Account');
    setShowHeaderFooter(true);
    setShowBoardingPage(false);
  }, []);

  useEffect(() => {
    if (width >= 1024) {
      navigate('/account/orders', {replace: true});
    }
  }, [width]);

  if (!width) return <></>;

  return width < 1024 ? (
    <div className="account">
      <div className="flex flex-col items-start gap-4 px-4 py-8 text-neutral-N-30">
        <h2 className="text-2xl">
          {t('Hi')}{' '}
          {customer.firstName
            ? customer.firstName
            : customer.lastName
              ? customer.lastName
              : t('Customer')}
        </h2>
        <Link to="/account/orders">{t('My Purchases')}</Link>
        <Link to="/wishlist">
          {t('My Wishlist')}({wishlist.length} {wishlist.length > 1 ? t('items') : t('item')})
        </Link>
        <button onClick={() => logout(navigate)}>{t('Log Out')}</button>
      </div>
      <Suspense>
        <Await resolve={data.footer}>
          {(footer) => (
            <Footer menus={footer} shop={data.header?.shop} showFooterAlways />
          )}
        </Await>
      </Suspense>
    </div>
  ) : (
    <></>
  );
};

export default Account;
