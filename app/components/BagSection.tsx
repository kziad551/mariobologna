import {CartLinePrice, CartLineQuantity} from './Cart';
import {Image} from '@shopify/hydrogen';
import {NavLink} from '@remix-run/react';
import {useVariantUrl} from '~/lib/variants';
import {CartReturn} from '@shopify/hydrogen';
import {BsSuitHeart} from 'react-icons/bs';
import {TFunction} from 'i18next';
import {useEffect, useState} from 'react';
import {useCustomContext} from '~/contexts/App';

type BagSectionType = {
  t: TFunction<'translation', undefined>;
  cart: CartReturn | null;
  showEditSection?: boolean;
  showBagTitle?: boolean;
};

const BagSection = ({
  t,
  cart,
  showEditSection = true,
  showBagTitle = true,
}: BagSectionType) => {
  if (!cart || !cart.lines || cart.lines.nodes.length === 0) {
    return (
      <div className="sm:px-0 px-4">
        <p>{t("Looks like you haven't added anything yet")}</p>
        <p>{t("Let's get you started!")}</p>
        <NavLink to="/" className="hover:underline">
          {t('Continue shopping')}
        </NavLink>
      </div>
    );
  }
  const variantUrls = cart?.lines.nodes.map(({merchandise}) =>
    useVariantUrl(merchandise.product.handle, merchandise.selectedOptions),
  );

  const {language} = useCustomContext();
  const [metafieldsMap, setMetafieldsMap] = useState<{[id: string]: any}>({});
  const [productTitle, setProductTitle] = useState<{
    [id: string]: string;
  }>({});

  useEffect(() => {
    const fetchMetafields = async () => {
      // Get IDs of the current products
      const productIDs = cart.lines.nodes
        .map(({merchandise}) => merchandise.product.id.split('/').pop())
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
  }, [cart.lines.nodes]); // Re-fetch when `products` changes

  useEffect(() => {
    if (Object.keys(metafieldsMap).length) {
      let productTitle: {
        [id: string]: string;
      } = {};
      cart.lines.nodes.forEach(({merchandise}) => {
        const metafields =
          metafieldsMap[merchandise.product.id.split('/').pop() ?? ''];
        const title: string =
          language === 'en'
            ? merchandise.product.title
            : metafields.find((item: any) => item.key === 'arabic_title')
                ?.value;
        if (title) {
          productTitle = {...productTitle, [merchandise.product.id]: title};
        } else {
          productTitle = {
            ...productTitle,
            [merchandise.product.id]: merchandise.product.title,
          };
        }
      });
      setProductTitle(productTitle);
    }
  }, [metafieldsMap, language]);

  return (
    <div className="cart-section flex-1 max-w-181.75">
      {showBagTitle ? (
        <h1 className="text-3xl font-medium mb-8">
          {!showEditSection ? t('Order Summary') : t('Shopping Bag')}
        </h1>
      ) : (
        <></>
      )}

      <ul className="flex-1 flex flex-col items-stretch justify-start">
        {cart.lines.nodes.map(({id, quantity, merchandise, cost}, index) => {
          const lineItemUrl = variantUrls[index];
          return (
            <li
              key={id}
              className="flex items-stretch justify-start gap-4 py-6 px-4 lg:py-6 lg:px-10 border-t border-t-neutral-N-80"
            >
              {merchandise.image && (
                <Image
                  alt={merchandise.title}
                  aspectRatio="1/1"
                  data={merchandise.image}
                  loading="lazy"
                  height={100}
                  width={100}
                  className="w-24 h-28 ss:w-30 ss:h-36 object-cover"
                />
              )}
              <div className="flex-grow flex flex-col items-stretch justify-between gap-4">
                <div className="flex items-start justify-between gap-1 xs:gap-4">
                  <div className="flex items-center justify-center gap-1">
                    <NavLink
                      prefetch="intent"
                      to={lineItemUrl}
                      className="text-sm ss:text-xl"
                    >
                      {productTitle[merchandise.product.id]}
                    </NavLink>
                    <BsSuitHeart className="w-4.5 h-4.5 xs:w-6 xs:h-6" />
                  </div>
                  <CartLinePrice cost={cost} />
                </div>
                <div className="flex xs:items-center xs:justify-between flex-col xs:flex-row gap-1 ss:gap-4">
                  <ul className="flex flex-col items-start gap-1">
                    {merchandise.selectedOptions.map((option) => (
                      <li key={option.name} className="text-xs ss:text-sm m-0">
                        <span>{t(option.name)}</span>:{' '}
                        <span>{t(option.value)}</span>
                      </li>
                    ))}
                  </ul>
                  {showEditSection ? (
                    <CartLineQuantity t={t} id={id} quantity={quantity} />
                  ) : (
                    <></>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default BagSection;
