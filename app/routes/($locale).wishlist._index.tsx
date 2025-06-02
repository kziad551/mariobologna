import {defer, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {
  Link,
  NavLink,
  useLoaderData,
  type MetaFunction,
} from '@remix-run/react';
import {useEffect, useState} from 'react';
import {RiArrowRightLine} from 'react-icons/ri';
import {useWishlist} from '~/contexts/WishList';
import {ProductCardFragment} from 'storefrontapi.generated';
import Product from '~/components/Product';
import useWindowDimensions from '~/hooks/useWindowDimensions';
import {MdArrowRight} from 'react-icons/md';
import MobileProduct from '~/components/MobileProduct';
import {useTranslation} from 'react-i18next';
import {useCustomContext} from '~/contexts/App';
import {TFunction} from 'i18next';
import {useViewedProducts} from '~/contexts/ViewedProducts';
import {AnimatePresence, motion} from 'framer-motion';
import {Image, Money} from '@shopify/hydrogen';
import {CgClose} from 'react-icons/cg';
import {useCompareProducts} from '~/contexts/CompareProducts';

export const meta: MetaFunction = () => {
  return [{title: 'Wishlist'}];
};

export async function loader({context}: LoaderFunctionArgs) {
  return defer({});
}

const Wishlist = () => {
  const data = useLoaderData<typeof loader>();
  const {t} = useTranslation();
  const {setCurrentPage, direction} = useCustomContext();
  const {wishlist, clearWishlist} = useWishlist();
  const {viewedProducts, clearViewedProducts, removeViewedProduct} =
    useViewedProducts();
  const {width, height} = useWindowDimensions(50);
  const [selectedSection, setSelectedSection] = useState('wishlist');
  const {compareProducts, clearCompareProducts, toggleCompareProducts} =
    useCompareProducts();

  useEffect(() => {
    setCurrentPage('Wishlist');
  }, []);

  return (
    <div className="wishlist">
      <div className="flex flex-col md:flex-row items-stretch justify-start gap-6 px-4 md:px-8 pt-2.5 md:pt-14 pb-15 md:pb-40">
        <div className="shadow-xl shadow-black/15 md:shadow-none md:sticky md:top-30 lg:top-59.75 flex md:flex-col flex-wrap items-stretch justify-between md:justify-start md:p-8 md:w-87.5 md:h-160 bg-neutral-N-90">
          <button
            className={`${direction === 'ltr' ? 'md:ml-3' : 'md:mr-3'} relative w-fit flex items-center gap-2 p-4 md:p-0 text-sm md:text-2xl md:mb-8`}
            onClick={(e) => setSelectedSection('wishlist')}
          >
            {selectedSection === 'wishlist' ? (
              <RiArrowRightLine
                className={`${direction === 'rtl' ? 'rotate-180' : ''} w-5 h-5`}
              />
            ) : (
              <></>
            )}
            {t('My Wishlist')}
            {wishlist.length > 0 ? (
              <span
                className={`${direction === 'rtl' ? 'left-0 md:right-full md:-translate-x-1/2' : 'right-0 md:left-full md:translate-x-1/2'} rounded-full px-1 py-0.5 absolute top-0 md:-translate-y-1/2 text-lg md:text-2xl`}
              >
                {wishlist.length}
              </span>
            ) : (
              <></>
            )}
          </button>
          <button
            className={`${direction === 'ltr' ? 'md:ml-3' : 'md:mr-3'} relative w-fit flex items-center gap-2 p-4 md:p-0 text-sm md:text-2xl md:mb-8`}
            onClick={(e) => setSelectedSection('viewed_products')}
          >
            {selectedSection === 'viewed_products' ? (
              <RiArrowRightLine
                className={`${direction === 'rtl' ? 'rotate-180' : ''} w-5 h-5`}
              />
            ) : (
              <></>
            )}
            {t('Viewed Products')}
            {viewedProducts.length > 0 ? (
              <span
                className={`${direction === 'rtl' ? 'left-0 md:right-full md:-translate-x-1/2' : 'right-0 md:left-full md:translate-x-1/2'} rounded-full px-1 py-0.5 absolute top-0 md:-translate-y-1/2 text-lg md:text-2xl`}
              >
                {viewedProducts.length}
              </span>
            ) : (
              <></>
            )}
          </button>
        </div>
        <div className="flex-1 flex flex-col items-stretch justify-start gap-6">
          <div className="flex items-start justify-between gap-4">
            {selectedSection === 'wishlist' ? (
              <button
                onClick={clearWishlist}
                className="text-primary-P-40 hover:underline"
              >
                {t('Clear Wishlist')}
              </button>
            ) : (
              <button
                onClick={clearViewedProducts}
                className="text-primary-P-40 hover:underline"
              >
                {t('Clear Viewed Products')}
              </button>
            )}
          </div>
          {selectedSection === 'wishlist' ? (
            <MyWishlist
              t={t}
              direction={direction}
              wishlist={wishlist}
              width={width}
              handleCompareCheckbox={toggleCompareProducts}
              selectedProducts={compareProducts}
            />
          ) : (
            <ViewedProducts
              t={t}
              direction={direction}
              viewedProducts={viewedProducts}
              width={width}
              handleCompareCheckbox={toggleCompareProducts}
              selectedProducts={compareProducts}
            />
          )}
        </div>
      </div>
      <AnimatePresence>
        {compareProducts.length > 0 && (
          <motion.div
            initial={{
              y: 300,
            }}
            animate={{
              y: 0,
            }}
            exit={{
              y: 300,
            }}
            className="z-50 fixed inset-0 top-auto py-5 px-4 md:py-10 md:px-8 bg-white"
          >
            <h2 className="text-base sm:text-2xl mb-3 sm:mb-5">
              {t('Compare & Combine Products')} ({compareProducts.length}/4)
            </h2>
            <div className="max-w-full overflow-x-auto scrollbar-none flex items-stretch gap-2 sm:gap-4">
              {compareProducts.map((product) => (
                <div className="min-w-50 sm:min-w-80 flex items-stretch rounded-lg border border-primary-P-40 overflow-hidden">
                  {product.featuredImage ? (
                    <Image
                      data={product.featuredImage}
                      aspectRatio="1/1"
                      sizes="auto"
                      loading="lazy"
                      className="max-w-20 sm:max-w-35 object-center object-cover"
                    />
                  ) : (
                    <img
                      src="/no_image.png"
                      className="max-w-20 sm:max-w-35 object-contain"
                    />
                  )}
                  <div className="flex-1 flex flex-col items-start justify-center gap-1 p-2 sm:p-4 bg-[#F5F5F5]">
                    <button
                      className="self-end rounded-lg p-1 sm:p-2"
                      onClick={() => toggleCompareProducts(product)}
                    >
                      <CgClose className="w-5 h-5 sm:h-6 sm:w-6" />
                    </button>
                    <p className="text-sm sm:text-base">
                      {direction === 'ltr'
                        ? product.title
                        : product.metafields?.find(
                            (meta) => meta.key === 'arabic_title',
                          ).value ?? product.title}
                    </p>
                    <Money
                      data={product.priceRange.minVariantPrice}
                      as="p"
                      className="text-primary-P-40 text-xs sm:text-sm"
                    />
                  </div>
                </div>
              ))}
              <div className="flex flex-col items-stretch justify-center gap-2 sm:gap-5 ml-auto">
                {(width > 1023 && compareProducts.length > 1) ||
                (width < 1024 && compareProducts.length === 2) ? (
                  <Link
                    to="/compare_combine"
                    className="no-underline bg-primary-P-40 rounded-md font-medium text-sm px-5 py-1.5 sm:px-10 sm:py-2.5 text-white text-nowrap"
                  >
                    {t('Compare & Combine')}
                  </Link>
                ) : (
                  <p className="no-underline bg-primary-P-40/40 rounded-md cursor-not-allowed font-medium text-sm px-5 py-1.5 sm:px-10 sm:py-2.5 text-white text-nowrap">
                    {width > 1023
                      ? t('Select at least 2 Products')
                      : t('Select 2 products only')}
                  </p>
                )}
                <button
                  onClick={clearCompareProducts}
                  className="bg-white rounded-md font-medium text-sm px-5 py-1.5 sm:px-10 sm:py-2.5 text-primary-P-40 text-nowrap"
                >
                  {t('Clear All')}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

type MyWishlistType = {
  wishlist: ProductCardFragment[];
  width: number;
  t: TFunction<'translation', undefined>;
  direction: 'ltr' | 'rtl';
  handleCompareCheckbox: (product: ProductCardFragment) => void;
  selectedProducts: ProductCardFragment[];
};

function MyWishlist({
  wishlist,
  width,
  t,
  direction,
  handleCompareCheckbox,
  selectedProducts,
}: MyWishlistType) {
  const [metafieldsMap, setMetafieldsMap] = useState<{[id: string]: any}>({});

  useEffect(() => {
    const fetchMetafields = async () => {
      // Get IDs of the current products
      const productIDs = wishlist
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
  }, [wishlist]); // Re-fetch when `products` changes

  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,350px))] items-stretch justify-start gap-3">
      {wishlist.length > 0 ? (
        wishlist.map((product) => {
          return width >= 640 ? (
            <Product
              t={t}
              direction={direction}
              key={product.id}
              product={product}
              metafields={metafieldsMap[product.id.split('/').pop() ?? '']}
              showCompare={true}
              handleCompareCheckbox={handleCompareCheckbox}
              selectedProducts={selectedProducts}
            />
          ) : (
            <MobileProduct
              t={t}
              direction={direction}
              key={product.id}
              product={product}
              metafields={metafieldsMap[product.id.split('/').pop() ?? '']}
              showCompare={true}
              handleCompareCheckbox={handleCompareCheckbox}
              selectedProducts={selectedProducts}
            />
          );
        })
      ) : (
        <div>
          <p>{t("Looks like you haven't added anything yet")}</p>
          <p>{t("Let's get you started!")}</p>
          <NavLink to="/" className="hover:underline">
            {t('Continue shopping')}
          </NavLink>
        </div>
      )}
    </div>
  );
}

type ViewedProductsType = {
  viewedProducts: ProductCardFragment[];
  width: number;
  t: TFunction<'translation', undefined>;
  direction: 'ltr' | 'rtl';
  handleCompareCheckbox: (product: ProductCardFragment) => void;
  selectedProducts: ProductCardFragment[];
};

function ViewedProducts({
  viewedProducts,
  width,
  t,
  direction,
  handleCompareCheckbox,
  selectedProducts,
}: ViewedProductsType) {
  const [metafieldsMap, setMetafieldsMap] = useState<{[id: string]: any}>({});

  useEffect(() => {
    const fetchMetafields = async () => {
      // Get IDs of the current products
      const productIDs = viewedProducts
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
  }, [viewedProducts]); // Re-fetch when `products` changes

  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,350px))] items-stretch justify-start gap-3">
      {viewedProducts.length > 0 ? (
        viewedProducts.map((product) => {
          return width >= 640 ? (
            <Product
              t={t}
              direction={direction}
              key={product.id}
              product={product}
              metafields={metafieldsMap[product.id.split('/').pop() ?? '']}
              showCompare={true}
              handleCompareCheckbox={handleCompareCheckbox}
              selectedProducts={selectedProducts}
            />
          ) : (
            <MobileProduct
              t={t}
              direction={direction}
              key={product.id}
              product={product}
              metafields={metafieldsMap[product.id.split('/').pop() ?? '']}
              showCompare={true}
              handleCompareCheckbox={handleCompareCheckbox}
              selectedProducts={selectedProducts}
            />
          );
        })
      ) : (
        <div>
          <p>{t("Looks like you haven't visited any product yet")}</p>
          <p>{t("Let's get you started!")}</p>
          <NavLink to="/" className="hover:underline">
            {t('Continue shopping')}
          </NavLink>
        </div>
      )}
    </div>
  );
}

export default Wishlist;
