import {defer, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {
  useLoaderData,
  Link,
  type MetaFunction,
  NavLink,
} from '@remix-run/react';
import {useEffect, useState} from 'react';
import type {ProductCardFragment} from 'storefrontapi.generated';
import {IoTriangle} from 'react-icons/io5';
import Product from '~/components/Product';
import useWindowDimensions from '~/hooks/useWindowDimensions';
import MobileProduct from '~/components/MobileProduct';
import {Money} from '@shopify/hydrogen';
import {useCustomContext} from '~/contexts/App';
import {ProductsSection} from '~/components/ProductsSection';
import {useTranslation} from 'react-i18next';
import {TFunction} from 'i18next';
import {
  METAOBJECT_CONTENT_QUERY,
  ONE_LOOK_COLLECTION_QUERY,
  OTHER_COLLECTION_QUERY,
} from '~/lib/queries';
import {
  CountryCode,
  CurrencyCode,
  Maybe,
  MediaImage,
  MetaobjectField,
} from '@shopify/hydrogen/storefront-api-types';
import {useRootLoaderData} from '~/root';
import {Image} from '@shopify/hydrogen/customer-account-api-types';

export const meta: MetaFunction = () => {
  return [{title: 'Home'}];
};

export async function loader({context, request}: LoaderFunctionArgs) {
  const {storefront} = context;
  const cookies = request.headers.get('Cookie');
  let country: CountryCode = 'AE';
  if (cookies) {
    const match = cookies.match(/country=([^;]+)/);
    if (match) {
      try {
        // Parse the JSON string back into an object
        country = JSON.parse(decodeURIComponent(match[1])) as CountryCode;
      } catch (error) {
        console.error('Error parsing country cookie:', error);
      }
    }
  }

  const {collection: brandNewProducts} = await storefront.query(
    OTHER_COLLECTION_QUERY,
    {
      variables: {country, handle: 'new-arrivals', first: 8},
    },
  );
  const {collection: topPicksProducts} = await storefront.query(
    OTHER_COLLECTION_QUERY,
    {
      variables: {country, handle: 'best-selling', first: 8},
    },
  );

  const {collection: lookCollection} = await storefront.query(
    ONE_LOOK_COLLECTION_QUERY,
    {
      variables: {country, handle: 'one-look'},
    },
  );
  const handle = 'hero-section-2teqinir';
  const type = 'hero_section';
  const {metaobject} = await context.storefront.query(
    METAOBJECT_CONTENT_QUERY,
    {
      variables: {
        country,
        handle,
        type,
      },
    },
  );

  if (!metaobject) {
    throw new Response(`Metaobject ${handle} - ${type} not found`, {
      status: 404,
    });
  }

  return defer({
    lookCollection,
    brandNewProducts,
    topPicksProducts,
    metaobject,
  });
}

export default function Homepage() {
  const {
    setCurrentPage,
    setShowHeaderFooter,
    setShowBoardingPage,
    direction,
    language,
  } = useCustomContext();
  const {height, width} = useWindowDimensions(50);
  const {brandNewProducts, topPicksProducts, lookCollection, metaobject} =
    useLoaderData<typeof loader>();
  const {
    header: {shop},
  } = useRootLoaderData();
  const {t} = useTranslation();

  useEffect(() => {
    setCurrentPage('');
    setShowHeaderFooter(true);
    setShowBoardingPage(false);
  }, []);

  return (
    <div className="home" style={{direction}}>
      <HeroSection
        t={t}
        direction={direction}
        language={language}
        metaobject={metaobject}
      />
      <div id="products_section" className="px-4 sm:px-8">
        <Shops t={t} direction={direction} />
        {brandNewProducts && brandNewProducts.products.nodes.length > 0 ? (
          <ProductsSection
            title={t('Brand New')}
            viewAllLink={brandNewProducts?.handle}
            width={width}
            height={height}
            products={brandNewProducts?.products.nodes}
            t={t}
            direction={direction}
          />
        ) : (
          <></>
        )}
        {topPicksProducts && topPicksProducts.products.nodes.length > 0 ? (
          <ProductsSection
            title={t('Top Picks')}
            viewAllLink={topPicksProducts?.handle}
            width={width}
            height={height}
            products={topPicksProducts?.products.nodes}
            t={t}
            direction={direction}
          />
        ) : (
          <></>
        )}
        {/* <LookSection
          title={t('Look')}
          viewAllLink="/look"
          width={width}
          height={height}
          products={lookCollection?.products.nodes}
          t={t}
          direction={direction}
        /> */}
      </div>
    </div>
  );
}

function OldHeroSection({
  t,
  direction,
  logo,
}: {
  t: TFunction<'translation', undefined>;
  direction: 'rtl' | 'ltr';
  logo: string | undefined;
}) {
  return (
    <div className="relative overflow-hidden h-70 md:h-195 bg-[#F3F0EF]">
      <IoTriangle
        className={`${direction === 'ltr' ? 'rotate-45 -right-[105px] md:-right-[340px]' : '-rotate-45 -left-[105px] md:-left-[340px]'} text-primary-P-40 w-56 h-56 md:w-[707px] md:h-[707px] absolute -top-[105px] md:-top-[340px]`}
      />
      <IoTriangle
        className={`${direction === 'ltr' ? '-rotate-[135deg] -left-[90px] md:-left-[290px]' : 'rotate-[135deg] -right-[90px] md:-right-[290px]'} text-secondary-S-90 w-48 h-48 md:w-[598px] md:h-[598px] absolute -bottom-[90px] md:-bottom-[290px]`}
      />
      <img
        src="/images/landing/landing-2.png"
        className={`${direction === 'ltr' ? 'right-0 xs:right-4 md:right-1/4 md:translate-x-1/2' : 'left-0 xs:left-4 md:left-1/4 md:-translate-x-1/2'} absolute bottom-0 md:w-130 w-40 xs:w-45`}
        // style={{
        //   transform:
        //     direction === 'ltr' ? 'rotateY(0deg)' : 'rotateY(180deg)',
        // }}
      />
      <p
        className={`${direction === 'ltr' ? 'left-20' : 'right-20'} hidden md:block absolute top-1/2 -translate-y-1/2 text-nowrap text-8xl md:text-[344px] text-black/5`}
      >
        {t('Mario Bologna')}
      </p>
      <div
        className={`${direction === 'ltr' ? 'md:left-1/4 md:-translate-x-1/2' : 'md:right-1/4 md:translate-x-1/2'} relative top-1/3 -translate-y-1/4 md:-translate-y-1/2 flex flex-col items-start md:items-end w-fit px-4 sm:px-8`}
      >
        {/* {direction === 'ltr' ? (
          <img src={logo} className="w-40 ss:w-50 md:w-100 2xl:w-150" />
        ) : (
          <p className="text-2xl ss:text-4xl md:text-7xl 2xl:text-9xl sm:!leading-normal">
            {t('Mario Bologna')}
          </p>
        )}
        <p className="text-sm ss:text-xl md:text-3xl 2xl:text-5xl mb-2 ss:mb-5">{t('House of Brands')}</p> */}
        <p className="text-lg ss:text-2xl sm:text-4xl lg:text-5xl 2xl:text-6xl sm:!leading-normal">
          {t('Festive Season Discount')}
        </p>
        <div className="mb-2 ss:mb-5 flex flex-col items-start md:items-end">
          <p className="text-sm ss:text-xl md:text-3xl 2xl:text-4xl">
            {t('Up to 50%')}
          </p>
          <p className="text-xs ss:text-lg md:text-xl 2xl:text-3xl">
            {t('Extra 10% off your first purchase')}
          </p>
        </div>
        <NavLink
          to="/#products_section"
          className="ss:self-end bg-secondary-S-90 px-4 py-2 sm:px-6 sm:py-2.5 rounded-md text-xs ss:text-sm md:text-xl 2xl:text-2xl text-white hover:shadow-md hover:shadow-black/30 hover:bg-secondary-S-80 active:shadow-none active:bg-secondary-S-40 transition-all"
        >
          {t('Shop Now')}
        </NavLink>
      </div>
    </div>
  );
}

function HeroSection({
  t,
  direction,
  language,
  metaobject,
}: {
  t: TFunction<'translation', undefined>;
  direction: 'rtl' | 'ltr';
  language: string;
  metaobject: {
    fields: Array<
      Pick<MetaobjectField, 'key' | 'value' | 'type'> & {
        reference?: Maybe<
          Pick<MediaImage, 'id'> & {
            image?: Maybe<Pick<Image, 'url' | 'altText' | 'width' | 'height'>>;
          }
        >;
      }
    >;
  };
}) {
  const [headlineOne, setHeadlineOne] = useState('');
  const [headlineTwo, setHeadlineTwo] = useState('');
  const [rightLine, setRightLine] = useState('');
  const [rightSubLine, setRightSubLine] = useState<Maybe<string | undefined>>();
  const [leftLine, setLeftLine] = useState('');
  const [middleImageSrc, setMiddleImageSrc] = useState('');
  const [rightImageSrc, setRightImageSrc] = useState('');
  const [leftImageSrc, setLeftImageSrc] = useState('');

  useEffect(() => {
    const middleImage = metaobject.fields.find(
      (meta) => meta.key === 'middle_image',
    );
    const rightImage = metaobject.fields.find(
      (meta) => meta.key === 'right_image',
    );
    const leftImage = metaobject.fields.find(
      (meta) => meta.key === 'left_image',
    );
    setMiddleImageSrc(middleImage?.reference?.image?.url ?? '');
    setRightImageSrc(rightImage?.reference?.image?.url ?? '');
    setLeftImageSrc(leftImage?.reference?.image?.url ?? '');
  }, [metaobject]);

  useEffect(() => {
    const fields = metaobject.fields;
    let headlineOne = '';
    let headlineTwo = '';
    let leftLine = '';
    let rightLine = '';
    let rightSubLine: Maybe<string | undefined>;
    if (language === 'en') {
      headlineOne =
        fields.find((meta) => meta.key === 'headline_one')?.value ?? '';
      headlineTwo =
        fields.find((meta) => meta.key === 'headline_two')?.value ?? '';
      leftLine = fields.find((meta) => meta.key === 'left_line')?.value ?? '';
      rightLine = fields.find((meta) => meta.key === 'right_line')?.value ?? '';
      rightSubLine = fields.find(
        (meta) => meta.key === 'right_sub_line',
      )?.value;
    }
    if (language === 'ar') {
      headlineOne =
        fields.find((meta) => meta.key === 'arabic_headline_one')?.value ?? '';
      headlineTwo =
        fields.find((meta) => meta.key === 'arabic_headline_two')?.value ?? '';
      leftLine =
        fields.find((meta) => meta.key === 'arabic_left_line')?.value ?? '';
      rightLine =
        fields.find((meta) => meta.key === 'arabic_right_line')?.value ?? '';
      rightSubLine = fields.find(
        (meta) => meta.key === 'arabic_right_sub_line',
      )?.value;
    }

    setHeadlineOne(headlineOne);
    setHeadlineTwo(headlineTwo);
    setRightLine(rightLine);
    setRightSubLine(rightSubLine);
    setLeftLine(leftLine);
  }, [language]);

  return (
    <div className="relative overflow-hidden flex items-center justify-between gap-10 mt-10 px-4 sm:px-10 w-full h-75 sm:h-120 lg:h-165">
      <img
        src={middleImageSrc}
        className="object-cover absolute top-0 h-120 -translate-y-20 sm:h-200 sm:-translate-y-30 lg:h-auto lg:-translate-y-50 left-1/2 -translate-x-1/2"
      />
      <img
        src={leftImageSrc}
        className="hidden lg:block max-w-0 lg:max-w-40 xl:max-w-50"
      />
      <div className="z-10 flex-1 flex flex-col items-center w-fit px-4 sm:px-8">
        <p
          className={`${direction === 'ltr' ? 'sm:text-9xl' : 'lg:text-9xl'} text-3xl xs:text-5xl !leading-[0.8] font-rangga`}
        >
          {headlineOne}
        </p>
        <div className="flex w-full items-center">
          <div className="flex-1 flex flex-col items-end">
            <p className="font-rangga text-base xs:text-lg sm:text-2xl text-end">
              {leftLine}
            </p>
          </div>
          <p
            className={`${direction === 'ltr' ? 'sm:text-9xl' : 'lg:text-9xl'} text-3xl xs:text-5xl !leading-[0.8] font-rangga`}
          >
            {headlineTwo}
          </p>
          <div className="flex-1 relative flex flex-col items-start">
            <p className="font-rangga text-base xs:text-lg sm:text-2xl">
              {rightLine}
            </p>
            <div className="w-fit absolute top-full flex flex-col xs:gap-2 sm:gap-4">
              {typeof rightSubLine !== 'undefined' ? (
                <p className="top-full font-light text-primary-P-40 text-xs xs:text-sm sm:text-xl">
                  {rightSubLine}
                </p>
              ) : (
                <></>
              )}
              <NavLink
                to="/#products_section"
                className="text-nowrap font-bold text-xs xs:text-sm sm:text-lg uppercase rounded-md text-primary-P-40 self-center hover:text-[#F5F5F5] hover:bg-primary-P-40 transition-colors px-3 xs:px-4 sm:px-6 py-2 sm:py-2.5"
              >
                {t('Shop Now')}
              </NavLink>
            </div>
          </div>
        </div>
      </div>
      <img
        src={rightImageSrc}
        className="hidden lg:block max-w-0 lg:max-w-40 xl:max-w-50"
      />
    </div>
  );
}

function LookSection({
  t,
  direction,
  title,
  viewAllLink,
  width,
  height,
  products = [],
}: {
  t: TFunction<'translation', undefined>;
  direction: 'ltr' | 'rtl';
  title: string;
  viewAllLink: string;
  width: number;
  height: number;
  products?: ProductCardFragment[];
}) {
  const [totalPrice, setTotalPrice] = useState('0');
  const {currency} = useCustomContext();
  const [metafieldsMap, setMetafieldsMap] = useState<{[id: string]: any}>({});

  useEffect(() => {
    let total = 0;
    products.forEach((product) => {
      total += parseFloat(product.priceRange.minVariantPrice.amount);
    });
    setTotalPrice(total.toString());
  }, []);

  useEffect(() => {
    const fetchMetafields = async () => {
      // Get IDs of the current products
      const productIDs = products
        .map((product) => product.id.split('/').pop())
        .filter(Boolean);

      // Filter out product IDs that already exist in metafieldsMap
      const newProductIDs = productIDs.filter((id) => !metafieldsMap[id]);

      if (newProductIDs.length === 0) return; // No new products to fetch

      // Fetch metafields only for the new products
      const response = await fetch('/api/products/metafields/all', {
        method: 'POST',
        body: JSON.stringify({IDs: newProductIDs}), // Only new product IDs
        headers: {
          'Content-Type': 'application/json',
          Accept: 'Application/json',
        },
      });

      const result: any = await response.json();
      if (result.success) {
        // Create a map of new metafields
        const newMetafieldsMap = result.data.reduce((acc: any, item: any) => {
          acc[item.productId] = item.metafields;
          return acc;
        }, {});

        // Merge the new metafields into the existing metafieldsMap
        setMetafieldsMap((prev) => ({...prev, ...newMetafieldsMap}));
      }
    };

    fetchMetafields();
  }, [products]); // Re-fetch when `products` changes

  return (
    <div className="my-8 lg:my-36">
      <div className="flex items-center justify-between w-full mb-2 lg:mb-20">
        <h2 className="lg:text-5xl font-medium">{title}</h2>
        <Link
          className="transition-all w-20 h-8 text-sm lg:text-base flex items-center justify-center text-primary-P-40 hover:no-underline hover:bg-neutral-N-92 active:bg-neutral-N-87"
          to={viewAllLink}
        >
          {t('View All')}
        </Link>
      </div>
      <div className="flex w-fit items-start lg:items-stretch lg:flex-row flex-col gap-3 lg:gap-4 flex-wrap">
        <div className="flex flex-wrap xs:w-90.5 sm:max-w-181 sm:w-auto items-start justify-between gap-3 lg:flex-col sm:gap-4 sm:self-stretch">
          {products.map((product, index) => {
            return (
              index < 2 &&
              (width >= 640 ? (
                <Product
                  key={index}
                  product={product}
                  metafields={metafieldsMap[product.id.split('/').pop() ?? '']}
                  t={t}
                  direction={direction}
                />
              ) : (
                <MobileProduct
                  key={index}
                  product={product}
                  metafields={metafieldsMap[product.id.split('/').pop() ?? '']}
                  t={t}
                  direction={direction}
                />
              ))
            );
          })}
        </div>
        <NavLink
          to={viewAllLink}
          className="text-start group flex flex-col border border-neutral-N-80 rounded-xl overflow-hidden"
        >
          <div className="block hover:no-underline relative flex-grow transition-colors min-w-43.5 min-h-40 xs:min-w-90 xs:min-h-80 sm:min-w-87 md:min-w-178.5 md:min-h-210.5 bg-cover bg-top bg-no-repeat bg-[url('/images/look_photo.jpeg')] after:absolute after:inset-0 after:z-10 after:group-hover:bg-black/20 after:group-active:bg-black/30 after:transition-colors" />
          <div className="self-stretch flex flex-col p-2 xs:p-4 gap-5 items-stretch justify-start">
            <div>
              <h4 className="text-neutral-N-10 text-sm sm:text-base">
                {t('Look')}
              </h4>
              <Money
                className="text-neutral-N-30 text-xs sm:text-sm"
                data={{
                  amount: (
                    parseFloat(totalPrice) * currency.exchange_rate
                  ).toString(),
                  currencyCode: currency.currency['en'] as CurrencyCode,
                }}
              />
            </div>
            <NavLink
              to={viewAllLink}
              className="text-center font-medium bg-primary-P-40 text-white rounded-md transition-colors text-sm xs:text-base px-4 py-2 xs:py-2.5 xs:px-6 hover:no-underline hover:shadow hover:shadow-black/30 hover:bg-primary-P-80 active:shadow-none active:bg-primary-P-90"
            >
              {t('View Look')}
            </NavLink>
          </div>
        </NavLink>
        <div className="flex flex-wrap xs:w-89.5 sm:max-w-181 sm:w-auto items-start justify-between gap-3 lg:flex-col sm:gap-4 sm:self-stretch">
          {products.map((product, index) => {
            return (
              index >= 2 &&
              (width >= 640 ? (
                <Product
                  key={index}
                  product={product}
                  metafields={metafieldsMap[product.id.split('/').pop() ?? '']}
                  t={t}
                  direction={direction}
                />
              ) : (
                <MobileProduct
                  key={index}
                  product={product}
                  metafields={metafieldsMap[product.id.split('/').pop() ?? '']}
                  t={t}
                  direction={direction}
                />
              ))
            );
          })}
        </div>
      </div>
    </div>
  );
}

function OldShops({
  t,
  direction,
}: {
  t: TFunction<'translation', undefined>;
  direction: 'ltr' | 'rtl';
}) {
  return (
    <div className="my-20 lg:my-36 grid grid-cols-1 md:grid-cols-3 gap-4">
      <button className="relative flex-grow border border-neutral-N-80 rounded-lg w-full min-h-96 lg:min-h-120 bg-[url('/images/shops/men.png')] bg-contain bg-center bg-no-repeat hover:bg-black/10 focus:bg-black/10 active:bg-black/15 transition-colors">
        <a
          href="/collections/men"
          className={`absolute inset-0 bottom-1/4 top-auto mx-auto bg-primary-P-40 text-white rounded-md transition-colors w-36 p-2.5 hover:no-underline hover:shadow hover:shadow-black/30 hover:bg-primary-P-80 active:shadow-none active:bg-primary-P-90`}
        >
          {t('Shop Men')}
        </a>
      </button>
      <button className="relative flex-grow border border-neutral-N-80 rounded-lg w-full min-h-96 lg:min-h-120 bg-[url('/images/shops/women.png')] bg-contain bg-center bg-no-repeat hover:bg-black/10 focus:bg-black/10 active:bg-black/15 transition-colors">
        <a
          href="/collections/women"
          className={`absolute inset-0 bottom-1/4 top-auto mx-auto bg-primary-P-40 text-white rounded-md transition-colors w-36 p-2.5 hover:no-underline hover:shadow hover:shadow-black/30 hover:bg-primary-P-80 active:shadow-none active:bg-primary-P-90`}
        >
          {t('Shop Women')}
        </a>
      </button>
      <button className="relative flex-grow border border-neutral-N-80 rounded-lg w-full min-h-96 lg:min-h-120 bg-[url('/images/shops/kids.png')] bg-contain bg-center bg-no-repeat hover:bg-black/10 focus:bg-black/10 active:bg-black/15 transition-colors">
        <a
          href="/collections/kids"
          className={`absolute inset-0 bottom-1/4 top-auto mx-auto bg-primary-P-40 text-white rounded-md transition-colors w-36 p-2.5 hover:no-underline hover:shadow hover:shadow-black/30 hover:bg-primary-P-80 active:shadow-none active:bg-primary-P-90`}
        >
          {t('Shop Kids')}
        </a>
      </button>
    </div>
  );
}

function Shops({
  t,
  direction,
}: {
  t: TFunction<'translation', undefined>;
  direction: 'ltr' | 'rtl';
}) {
  return (
    <div className="py-20 lg:py-36 max-w-[1280px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-4">
      <NavLink
        to="/collections/men"
        className="group relative flex items-center justify-center flex-grow w-full min-h-62 xs:min-h-96 lg:min-h-160 bg-[url('/images/shops/men.png')] bg-cover bg-center bg-no-repeat border border-primary-P-40/10 hover:shadow active:shadow-sm transition-colors"
      >
        <div className="text-white group-hover:text-black text-4xl xs:text-7xl flex flex-col items-center justify-center transition-colors">
          <span className="font-rangga">{t('Shop')}</span>
          <span className="font-rangga">{t('Men')}</span>
        </div>
      </NavLink>
      <NavLink
        to="/collections/women"
        className="group relative flex items-center justify-center flex-grow w-full min-h-62 xs:min-h-96 lg:min-h-160 bg-[url('/images/shops/women.png')] bg-cover bg-center bg-no-repeat border border-primary-P-40/10 hover:shadow active:shadow-sm transition-colors"
      >
        <div className="text-white group-hover:text-black text-4xl xs:text-7xl flex flex-col items-center justify-center transition-colors">
          <span className="font-rangga">{t('Shop')}</span>
          <span className="font-rangga">{t('Women')}</span>
        </div>
      </NavLink>
      <NavLink
        to="/collections/kids"
        className="group relative flex items-center justify-center flex-grow w-full min-h-62 xs:min-h-96 lg:min-h-160 bg-[url('/images/shops/kids.png')] bg-cover bg-center bg-no-repeat border border-primary-P-40/10 hover:shadow active:shadow-sm transition-colors"
      >
        <div className="text-white group-hover:text-black text-4xl xs:text-7xl flex flex-col items-center justify-center transition-colors">
          <span className="font-rangga">{t('Shop')}</span>
          <span className="font-rangga">{t('Kids')}</span>
        </div>
      </NavLink>
    </div>
  );
}
