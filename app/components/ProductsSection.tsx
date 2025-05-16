import {Await, Link} from '@remix-run/react';
import {Suspense, useEffect, useState} from 'react';
import {ProductCardFragment, ProductsQuery} from 'storefrontapi.generated';
import Product from './Product';
import MobileProduct from './MobileProduct';
import {TFunction} from 'i18next';

export function ProductsSection({
  t,
  direction,
  title,
  viewAllLink = '',
  width,
  height,
  products = [],
  containerClassName,
  showViewAll = true,
  children,
}: {
  t: TFunction<'translation', undefined>;
  direction: 'ltr' | 'rtl';
  title: string;
  viewAllLink?: string;
  width: number;
  height: number;
  products?: ProductCardFragment[];
  containerClassName?: string;
  showViewAll?: boolean;
  children?: React.ReactNode;
}) {
  // Determine the correct link path
  const linkPath = viewAllLink === 'new-arrivals' 
    ? '/collections/new-arrivals' 
    : `/collections/${viewAllLink}`;

  return (
    <div className={`${containerClassName ?? ''} my-8 sm:my-36`}>
      <div className="flex items-center justify-between w-full mb-2 sm:mb-20">
        <h2 className="sm:text-5xl font-medium">{title}</h2>
        {showViewAll ? (
          <Link
            className="transition-all text-base sm:text-lg font-medium flex items-center justify-center text-primary-P-40 hover:no-underline hover:bg-neutral-N-92 active:bg-neutral-N-87"
            to={linkPath}
          >
            {t('View All')}
          </Link>
        ) : (
          <></>
        )}
      </div>
      <Products products={products} width={width} t={t} direction={direction} />
      {children}
    </div>
  );
}

function Products({
  products,
  width,
  t,
  direction,
}: {
  products: ProductCardFragment[];
  width: number;
  t: TFunction<'translation', undefined>;
  direction: 'ltr' | 'rtl';
}) {
  const [metafieldsMap, setMetafieldsMap] = useState<{[id: string]: any}>({});

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
    <div className="">
      <div className="flex flex-wrap gap-x-3 gap-y-6 sm:gap-x-4 sm:gap-y-16">
        {products.map((product, index) => {
          return width >= 640 ? (
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
          );
        })}
      </div>
    </div>
  );
}
