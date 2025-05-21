import {useEffect, useState} from 'react';
import {defer, redirect, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {
  Link,
  useLoaderData,
  type MetaFunction,
  type FetcherWithComponents,
  NavLink,
  useNavigate,
  NavigateFunction,
} from '@remix-run/react';
import type {
  ProductFragment,
  ProductVariantFragment,
  ProductCardFragment,
} from 'storefrontapi.generated';
import {
  Image,
  Money,
  VariantSelector,
  type VariantOption,
  getSelectedProductOptions,
  CartForm,
} from '@shopify/hydrogen';
import type {
  CartLineInput,
  CountryCode,
  CurrencyCode,
  Image as ImageType,
  SelectedOption,
} from '@shopify/hydrogen/storefront-api-types';
import {getVariantUrl} from '~/lib/variants';
import {IoIosArrowForward, IoMdStar} from 'react-icons/io';
import {FaCheck} from 'react-icons/fa6';
import {AnimatePresence, motion} from 'framer-motion';
import {MdOutlineKeyboardArrowRight} from 'react-icons/md';
import {ProductsSection} from '~/components/ProductsSection';
import useWindowDimensions from '~/hooks/useWindowDimensions';
import {useTranslation} from 'react-i18next';
import {useCustomContext} from '~/contexts/App';
import {TFunction} from 'i18next';
import {calculateSalePercentage, handleCreateCheckout} from '~/lib/utils';
import {
  OTHER_COLLECTION_QUERY,
  SIMILAR_PRODUCTS_QUERY,
  PRODUCT_RECOMMENDATIONS_QUERY,
  PRODUCT_BY_TYPE_QUERY,
} from '~/lib/queries';
import {useViewedProducts} from '~/contexts/ViewedProducts';
import {PRODUCT_CARD_FRAGMENT} from '~/lib/fragments';
import ColorCircleIcon from '~/components/Icons/ColorCircleIcon';

// GA4 Event tracking functions
const sendGA4Event = (eventName: string, eventParams?: any) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, eventParams);
  }
};

// Define gtag on window
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

export const meta: MetaFunction<typeof loader> = ({data, location}) => {
  if (!data) {
    return [{title: 'Product not found'}];
  }

  const {product} = data;
  const title = product.title || '';
  const description = product.description || '';
  
  // Extract product details for meta description
  const productType = product.productType || '';
  const brandName = 'Mario Bologna';
  const madeIn = product.vendor || '';
  
  // Build a rich meta description using product data
  const metaDescription = description
    ? description.substring(0, 150) + (description.length > 150 ? '...' : '')
    : `${title} - ${productType} by ${brandName}. ${madeIn ? `Made in ${madeIn}.` : ''} Premium quality, authentic design.`;

  return [
    { title: `${title} | Mario Bologna` },
    { name: 'description', content: metaDescription },
    { name: 'keywords', content: `${title}, ${productType}, Mario Bologna, fashion, luxury clothing` },
    { property: 'og:title', content: `${title} | Mario Bologna` },
    { property: 'og:description', content: metaDescription },
    { property: 'og:type', content: 'product' },
    { property: 'og:site_name', content: 'Mario Bologna' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: `${title} | Mario Bologna` },
    { name: 'twitter:description', content: metaDescription },
    // Disable scroll restoration for product pages
    { name: 'scroll-restoration', content: 'manual' }
  ];
};

export async function loader({params, request, context}: LoaderFunctionArgs) {
  const {handle} = params;
  const {storefront, env} = context;
  
  // Initialize result at function scope to avoid "Cannot find name" error
  let result: { metafields: any[] } = { metafields: [] };
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

  const selectedOptions = getSelectedProductOptions(request).filter(
    (option) =>
      // Filter out Shopify predictive search query params
      !option.name.startsWith('_sid') &&
      !option.name.startsWith('_pos') &&
      !option.name.startsWith('_psq') &&
      !option.name.startsWith('_ss') &&
      !option.name.startsWith('_v') &&
      // Filter out third party tracking params
      !option.name.startsWith('fbclid'),
  );

  if (!handle) {
    throw new Error('Expected product handle to be defined');
  }

  // await the query for the critical product data
  const {product} = await storefront.query(PRODUCT_QUERY, {
    variables: {country, handle, selectedOptions},
  });

  if (!product?.id) {
    throw new Response(null, {status: 404});
  }

  const firstVariant = product.variants.nodes[0];
  const firstVariantIsDefault = Boolean(
    firstVariant.selectedOptions.find(
      (option: SelectedOption) =>
        option.name === 'Title' && option.value === 'Default Title',
    ),
  );

  if (firstVariantIsDefault) {
    product.selectedVariant = firstVariant;
  } else {
    // if no selected variant was returned from the selected options,
    // we redirect to the first variant's url with it's selected options applied
    if (!product.selectedVariant) {
      throw redirectToFirstVariant({product, request});
    }
  }

  // In order to show which variants are available in the UI, we need to query
  // all of them. But there might be a *lot*, so instead separate the variants
  // into it's own separate query that is deferred. So there's a brief moment
  // where variant options might show as available when they're not, but after
  // this deffered query resolves, the UI will update.
  const variants = await storefront.query(VARIANTS_QUERY, {
    variables: {country, handle},
  });

  let firstProductType = '';
  let secondProductType = '';

  switch (product.productType) {
    case 'Shirts':
      firstProductType = 'Pants';
      secondProductType = 'Shoes';
      break;
    case 'Shoes':
      firstProductType = 'Pants';
      secondProductType = 'Shirts';
      break;
    case 'Pants':
      firstProductType = 'Shirts';
      secondProductType = 'Shoes';
      break;
    default:
      break;
  }

  const {collection: combineProductsCollection} = await storefront.query(
    COMBINE_PRODUCT_QUERY,
    {
      variables: {
        country,
        handle,
        firstFilter: [
          {
            productType: `${firstProductType}`,
          },
        ],
        secondFilter: [
          {
            productType: `${secondProductType}`,
          },
        ],
      },
    },
  );
  const {collection: youMayAlsoLikeProducts} = await storefront.query(
    OTHER_COLLECTION_QUERY,
    {
      variables: {country, handle: 'recommended-products', first: 4},
    },
  );

  // Fetch similar products within the same category/product type
  const {products: similarProducts} = await storefront.query(
    SIMILAR_PRODUCTS_QUERY,
    {
      variables: {
        country,
        productType: product.productType,
        productId: product.id,
        first: 8,
      },
    },
  );

  // Fetch product recommendations
  /* ─────────────────────────────────────────────────────────── */
  /* 1.  Native Shopify recommendations                         */
  /* ─────────────────────────────────────────────────────────── */
  let { productRecommendations } = await storefront.query(
    PRODUCT_RECOMMENDATIONS_QUERY,
    {
      variables: {
        productId: product.id,
        first: 4,
        country: storefront.i18n.country,
      },
    },
  );

  /* ─────────────────────────────────────────────────────────── */
  /* 2.  Extract gender & type                                  */
  /* ─────────────────────────────────────────────────────────── */
  const GENDERS = ['Men', 'Women', 'Kids'] as const;

  // Debug what we know about this product
  console.log(`[PDP] Product details - ID: ${product.id}, Type: ${product.productType}, Tags: ${JSON.stringify(product.tags)}`);
  console.log(`[PDP] Collections: ${JSON.stringify(product.collections.nodes.map((c: any) => c.handle))}`);
  console.log(`[PDP] Title: "${product.title}"`);
  
  // Detect gender from tags or collections
  const gender =
    product.tags.find((t: string) => GENDERS.includes(t as any)) ??
    product.collections.nodes
      .map((c: {title: string}) => c.title)
      .find((t: string) => GENDERS.includes(t as any)) ??
    null;

  // Get product type and subtype from title if it's a Clothes item
  let type = product.productType?.trim();
  let subtype: string | null = null;
  
  // For Clothes products, try to extract a more specific category from title or collections
  if (type?.toLowerCase() === 'clothes') {
    // Check direct in title
    const clothesTypes = ['Dress', 'Shirt', 'Pants', 'Jacket', 'Coat', 'Skirt', 'Top', 'Blouse', 'Sweater', 'Jeans'];
    const foundType = clothesTypes.find((clothesType) => 
      product.title.toLowerCase().includes(clothesType.toLowerCase())
    );
    if (foundType) subtype = foundType;
    
    // If not found directly in title, check collection handles for dress/shirts/etc.
    if (!subtype) {
      const collectionHandles = product.collections.nodes.map((c: any) => c.handle.toLowerCase());
      if (collectionHandles.some((h: string) => h.includes('dress'))) {
        subtype = 'Dress';
      } else if (collectionHandles.some((h: string) => h.includes('shirt'))) {
        subtype = 'Shirt';
      } else if (collectionHandles.some((h: string) => h.includes('pants') || h.includes('jeans'))) {
        subtype = 'Pants';
      }
    }
    
    // Special case: if it's a long item, it's probably a dress
    if (!subtype && product.title.toLowerCase().includes('long')) {
      subtype = 'Dress';
    }
    
    if (subtype) {
      console.log(`[PDP] Detected clothing subtype: ${subtype} from title or collections`);
    }
  }
  
  console.log(`[PDP] Detected gender: ${gender}, type: ${type}, subtype: ${subtype}`);

  /* Helper function to check if a product matches the current context */
  /* Simpler approach - just check if products share a collection */
  function sharesCollection(
    p: Pick<ProductCardFragment, 'id'> & {
      collections?: {nodes: Array<{handle: string}>};
    },
  ) {
    if (!p || !p.collections || !p.collections.nodes) return false;
    if (p.id === product.id) return false; // Don't include current product
    
    // Get collection handles from current product
    const currentCollectionHandles = product.collections.nodes.map(
      (c: any) => c.handle?.toLowerCase()
    ).filter(Boolean);
    
    // Check if product shares any collections with current product
    return p.collections.nodes.some(c => 
      c.handle && currentCollectionHandles.includes(c.handle.toLowerCase())
    );
  }
  
  /* Use all Shopify recommendations first, then add collection-based */
  let recommendations = productRecommendations ?? [];

  /* ─────────────────────────────────────────────────────────── */
  /* 3.  If we still need more, search by *both* gender & type   */
  /* ─────────────────────────────────────────────────────────── */
  if (recommendations.length < 4 && gender && type) {
    const query = `tag:'${gender.replace(/'/g, "\\'")}' product_type:"${type.replace(/"/g, '\\"')}"`;

    const { products: match } = await storefront.query(
      /* GraphQL */ `#graphql
        ${PRODUCT_CARD_FRAGMENT}
        query GenderTypeSearch($query: String!, $first: Int = 20, $country: CountryCode)
          @inContext(country: $country) {
          products(first: $first, query: $query) {
            nodes {
              ...ProductCard
            }
          }
        }
      `,
      {
        variables: {
          query,
          first: 20,
          country: storefront.i18n.country,
        },
      },
    );

    // Deduplicate and randomly shuffle
    if (match && match.nodes) {
      const pool = match.nodes
        .filter((p: {id: string}) => p.id !== product.id)
        .filter(sharesCollection);
      recommendations = [
        ...recommendations,
        ...pool
          .filter((p: {id: string}) => !recommendations.find((r: {id: string}) => r.id === p.id))
          .sort(() => 0.5 - Math.random()),
      ].slice(0, 4);
    }
  }

  console.info(
    `[PDP] Final recommendations for ${product.handle}: ${recommendations.length} (gender: ${gender}, type: ${type})`,
  );

  /* ─────────────────────────────────────────────────────────── */
  /* 4. EMERGENCY FALLBACK - show products from SAME CATEGORY & TYPE */
  /* ─────────────────────────────────────────────────────────── */
  if (recommendations.length === 0) {
    console.log("🚨 Using emergency fallback - finding products from same category & type");
    
    // SPECIAL CASE FOR DRESSES - Direct approach for women's dresses
    const isDress = 
      subtype === 'Dress' || 
      product.title.toLowerCase().includes('dress') || 
      product.collections.nodes.some((c: any) => c.handle.toLowerCase().includes('dress')) ||
      product.tags.some((t: string) => t.toLowerCase().includes('dress'));
    
    const isWomens = 
      gender === 'Women' || 
      product.collections.nodes.some((c: any) => c.handle.toLowerCase().includes('women')) ||
      product.tags.some((t: string) => t.toLowerCase().includes('women'));
      
     // Fetch metafields early to avoid 'used before declaration' errors
   const productID = product.id.split('/').pop();
   const SHOPIFY_ADMIN_API_URL = `https://${env.PUBLIC_STORE_DOMAIN}/admin/api/${env.ADMIN_VERSION}`;
   const ADMIN_URL = `${SHOPIFY_ADMIN_API_URL}/products/${productID}/metafields.json`;
   
   try {
    const response = await fetch(ADMIN_URL, {
      method: 'GET',
      headers: {
        'X-Shopify-Access-Token': `${env.ADMIN_API_ACCESS_TOKEN}`,
      },
    });
    if (response) {
      const data = await response.json();
      result = data as { metafields: any[] };
    }
  } catch (error) {
    console.log('error while getting product metafields from Admin API', error);
  }
    
    if (isDress && isWomens) {
      console.log("🎯 SPECIAL CASE: Women's Dress detected - using targeted query");
      
      // Try approach 1: Direct women's dresses collection
      const { products: dressProducts } = await storefront.query(
        /* GraphQL */ `#graphql
          ${PRODUCT_CARD_FRAGMENT}
          query WomensDresses($country: CountryCode) @inContext(country: $country) {
            products(first: 10, query: "tag:Women product_type:Clothes title:dress") {
              nodes {
                ...ProductCard
              }
            }
          }
        `,
        {
          variables: {
            country: storefront.i18n.country,
          },
        },
      );
      
      if (dressProducts && dressProducts.nodes && dressProducts.nodes.length > 0) {
        // Get dresses, excluding the current one
        recommendations = dressProducts.nodes
          .filter((p: {id: string}) => p.id !== product.id)
          .sort(() => 0.5 - Math.random())
          .slice(0, 4);
        
        console.info(`[PDP] Women's dresses direct query found: ${recommendations.length}`);
        
        if (recommendations.length > 0) {
          // Skip other fallbacks if we found dresses
          return defer({
            product,
            variants,
            metafields: result.metafields,
            recommendations,
            youMayAlsoLikeProducts,
            combineProductsCollection,
            similarProducts: similarProducts?.nodes || [],
          });
        }
      }
    }
    
    // Regular fallback logic continues...
    let searchQuery = '';
    
    // Add gender/category constraint if available
    if (gender) {
      searchQuery += `tag:'${gender.replace(/'/g, "\\'")}' `;
    } else {
      // Try to find any main collection the product belongs to
      const mainCollection = product.collections.nodes.find(
        (c: any) => !['all', 'frontpage'].includes(c.handle.toLowerCase())
      );
      if (mainCollection) {
        searchQuery += `collection:'${mainCollection.handle.replace(/'/g, "\\'")}' `;
      }
    }
    
    // For clothes, try to match by both product type AND title keywords
    if (type?.toLowerCase() === 'clothes' && subtype) {
      // For clothes, search by type AND title containing the subtype (e.g., Dress)
      searchQuery += `product_type:"${type.replace(/"/g, '\\"')}" title:${subtype} `;
    } else if (type) {
      // For other products, just search by product type
      searchQuery += `product_type:"${type.replace(/"/g, '\\"')}" `;
    }
    
    // Fallback to just the collection if we have nothing else
    if (!searchQuery) {
      const anyCollection = product.collections.nodes[0];
      if (anyCollection) {
        searchQuery = `collection:'${anyCollection.handle.replace(/'/g, "\\'")}' `;
      }
    }
    
    console.log(`[PDP] Emergency search query: "${searchQuery}"`);

    // Only proceed if we have a meaningful query
    if (searchQuery) {
      const { products: categoryProducts } = await storefront.query(
        /* GraphQL */ `#graphql
          ${PRODUCT_CARD_FRAGMENT}
          query CategoryProducts($query: String!, $first: Int = 20, $country: CountryCode)
            @inContext(country: $country) {
            products(first: $first, query: $query) {
              nodes {
                ...ProductCard
              }
            }
          }
        `,
        {
          variables: {
            query: searchQuery,
            first: 20,
            country: storefront.i18n.country,
          },
        },
      );

      if (categoryProducts && categoryProducts.nodes) {
        // Get products that share collections with current product
        const filteredProducts = categoryProducts.nodes
          .filter((p: {id: string}) => p.id !== product.id)
          .filter(sharesCollection);

        if (filteredProducts.length > 0) {
          // Randomly select up to 4 products
          recommendations = filteredProducts
            .sort(() => 0.5 - Math.random())
            .slice(0, 4);
          
          console.info(
            `[PDP] Category-specific fallback recommendations: ${recommendations.length}`,
          );
        }
      }
    }
    
    // Ultimate fallback if still no recommendations
    if (recommendations.length === 0) {
      console.log("🚨 Using last resort fallback - showing ANY products");
      const { products: anyProducts } = await storefront.query(
        /* GraphQL */ `#graphql
          ${PRODUCT_CARD_FRAGMENT}
          query AnyProducts($first: Int = 10, $country: CountryCode)
            @inContext(country: $country) {
            products(first: $first, sortKey: BEST_SELLING) {
              nodes {
                ...ProductCard
              }
            }
          }
        `,
        {
          variables: {
            first: 10,
            country: storefront.i18n.country,
          },
        },
      );

      if (anyProducts && anyProducts.nodes) {
        // Get any products except the current one
        recommendations = anyProducts.nodes
          .filter((p: {id: string}) => p.id !== product.id)
          .filter(sharesCollection)
          .sort(() => 0.5 - Math.random())
          .slice(0, 4);
        
        console.info(
          `[PDP] Last resort fallback recommendations: ${recommendations.length}`,
        );
      }
    }
  }

  // Metafields are already fetched above

  return defer({
    product,
    variants,
    metafields: result.metafields,
    recommendations,
    youMayAlsoLikeProducts,
    combineProductsCollection,
    similarProducts: similarProducts?.nodes || [],
  });
}

function redirectToFirstVariant({
  product,
  request,
}: {
  product: ProductFragment;
  request: Request;
}) {
  const url = new URL(request.url);
  const firstVariant = product.variants.nodes[0];

  return redirect(
    getVariantUrl({
      pathname: url.pathname,
      handle: product.handle,
      selectedOptions: firstVariant.selectedOptions,
      searchParams: new URLSearchParams(url.search),
    }),
    {
      status: 302,
    },
  );
}

export default function Product() {
  const {t} = useTranslation();
  const {setCurrentPage, direction, language} = useCustomContext();
  const {
    product,
    variants,
    metafields,
    recommendations,
    youMayAlsoLikeProducts,
    combineProductsCollection,
    similarProducts,
  } = useLoaderData<typeof loader>();
  const {width, height} = useWindowDimensions(50);
  const {selectedVariant} = product;
  const navigate = useNavigate();
  const {addViewedProducts} = useViewedProducts();
  const [active, setActive] = useState<{[x: string]: boolean}>({});
  const [combineProducts, setCombineProducts] = useState<ProductCardFragment[]>(
    [],
  );
  const [careGuide, setCareGuide] = useState<string[]>([]);
  const [productCode, setProductCode] = useState<string>('');
  const [productDescription, setProductDescription] = useState<string>('');
  const [productTitle, setProductTitle] = useState<string>('');
  const [productVideo, setProductVideo] = useState<string | null>(null);
  const [productPreviewVideo, setProductPreviewVideo] = useState<Pick<
    ImageType,
    'id' | 'url'
  > | null>(null);
  const [primaryCollection, setPrimaryCollection] = useState<string>('');
  
  // Ensure we start at the top of the page when navigating from a collection
  useEffect(() => {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      const navigatingToProduct = window.sessionStorage.getItem('navigatingToProduct');
      if (navigatingToProduct === 'true') {
        // Scroll to top
        window.scrollTo(0, 0);
        // Clear the flag
        window.sessionStorage.removeItem('navigatingToProduct');
      }
    }
  }, []);

  useEffect(() => {
    if (product.collections && product.collections.nodes.length > 0) {
      // Try to find a main category (men, women, kids, designers)
      const mainCategories = ['men', 'women', 'kids', 'designers'];
      const mainCollection = product.collections.nodes.find((col: {handle: string; title: string}) => 
        mainCategories.includes(col.handle.toLowerCase())
      );
      
      // If a main category was found, use it; otherwise use the first collection
      setPrimaryCollection(mainCollection ? t(mainCollection.title) : t(product.collections.nodes[0].title));
    } else {
      setPrimaryCollection(t('Products'));
    }
  }, [product.collections, language]);

  useEffect(() => {
    if (metafields) {
      const careGuide: string = metafields.find(
        (item: any) =>
          item.key === (language === 'en' ? 'care_guide' : 'care_guide_ar'),
      )?.value;
      if (careGuide) {
        const array = careGuide.split('\n');
        setCareGuide(array);
      } else {
        setCareGuide([]);
      }

      const title: string =
        language === 'en'
          ? product.title
          : metafields.find((item: any) => item.key === 'arabic_title')?.value;
      if (title) {
        setProductTitle(title);
      } else {
        setProductTitle(product.title);
      }

      const description: string =
        language === 'en'
          ? product.descriptionHtml
          : metafields.find((item: any) => item.key === 'arabic_description')
              ?.value;
      if (description) {
        setProductDescription(description);
      } else {
        setProductDescription('');
      }

      const code: string = metafields.find(
        (item: any) => item.key === 'cegidcode',
      )?.value;
      if (code) {
        setProductCode(code);
      } else {
        setProductCode('');
      }
    }
  }, [metafields, language]);

  useEffect(() => {
    setCurrentPage('Products');
    addViewedProducts(product as any);
    const media = product.media.nodes.find((m: {__typename: string; previewImage?: any}) => m.__typename === 'Video');
    if (media) {
      if (media.previewImage) {
        setProductPreviewVideo(media.previewImage);
      }
      const source = media.sources.find((source: {format: string; url: string}) => source.format === 'mp4');
      if (source) {
        setProductVideo(source.url);
      }
    }

    // GA4: view_item event when product page is loaded
    if (selectedVariant) {
      sendGA4Event('view_item', {
        currency: selectedVariant.price.currencyCode,
        value: parseFloat(selectedVariant.price.amount),
        items: [
          {
            item_id: selectedVariant.sku || selectedVariant.id,
            item_name: product.title,
            item_variant: selectedVariant.title,
            price: parseFloat(selectedVariant.price.amount),
            currency: selectedVariant.price.currencyCode,
            item_brand: product.vendor,
            item_category: product.productType,
            item_variant_id: selectedVariant.id,
          },
        ],
      });
    }
  }, [product, selectedVariant]);

  useEffect(() => {
    if (combineProductsCollection) {
      if (combineProductsCollection.firstProduct.nodes.length > 0) {
        setCombineProducts((prev) => [
          ...prev,
          ...combineProductsCollection.firstProduct.nodes,
        ]);
      }
      if (combineProductsCollection.secondProduct.nodes.length > 0) {
        setCombineProducts((prev) => [
          ...prev,
          ...combineProductsCollection.secondProduct.nodes,
        ]);
      }
    }
  }, [combineProductsCollection]);

  return (
    <div className="product">
      <div className="flex w-full items-center mt-3 mb-4 px-4 ss:px-8 text-neutral-N-30 overflow-x-auto">
        <NavLink to="/" className="text-sm hover:underline whitespace-nowrap">
          {t('Home')}
        </NavLink>
        <IoIosArrowForward
          className={`${direction === 'rtl' ? 'rotate-180' : ''} mx-2 flex-shrink-0`}
        />
        <NavLink to="/collections/all" className="text-sm hover:underline whitespace-nowrap">
          {t('Products')}
        </NavLink>
        <IoIosArrowForward
          className={`${direction === 'rtl' ? 'rotate-180' : ''} mx-2 flex-shrink-0`}
        />
        <button
          onClick={() => navigate(-1)}
          className="text-sm hover:underline whitespace-nowrap"
        >
          {primaryCollection}
        </button>
        <IoIosArrowForward
          className={`${direction === 'rtl' ? 'rotate-180' : ''} mx-2 flex-shrink-0`}
        />
        <p className="text-sm font-medium text-primary-P-40 whitespace-nowrap overflow-hidden text-ellipsis max-w-[150px] sm:max-w-none">
          {productTitle}
        </p>
      </div>
      <div className="flex flex-col xl:flex-row gap-14 px-4 sm:px-8 mb-16 items-start justify-start">
        <ProductImage
          direction={direction}
          images={product.images}
          variantImage={selectedVariant?.image}
          selectedColor={selectedVariant?.selectedOptions[0].value
            .toLowerCase()
            .replace(/\s+/g, '_')}
          productVideo={productVideo}
          productPreviewVideo={productPreviewVideo}
        />
        <ProductMain
          t={t}
          direction={direction}
          selectedVariant={selectedVariant}
          product={product}
          productTitle={productTitle}
          productDescription={productDescription}
          variants={variants.product?.variants.nodes ?? []}
          navigate={navigate}
        />
      </div>
      <div className="hidden sm:flex flex-wrap items-stretch justify-between gap-18 px-8">
        <div className="flex flex-col gap-1.25">
          <h2 className="text-3xl font-semibold">{t('Product Details')}</h2>
          <p className="text-sm">{productCode}</p>
        </div>

        <div className="flex flex-col gap-4">
          <h2 className="text-3xl font-semibold">{t('Product Care')}</h2>
          <div>
            {careGuide.length > 0 ? (
              careGuide.map((item) => (
                <p key={item} className="text-sm max-w-85">
                  {item}
                </p>
              ))
            ) : (
              <p className="text-sm max-w-85">
                {t('No care guide yet for this product')}
              </p>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-5">
          <h2 className="text-3xl font-semibold">{t('Shipping & Return')}</h2>
          <Link to="/delivery" className="hover:underline">
            {t('Same Day Delivery before 6pm')}
          </Link>
          <Link to="/delivery" className="hover:underline">
            {t('Free shipping from orders above 1000 AED')}
          </Link>
          <Link to="/returns" className="hover:underline">
            {t('Extended Exchange, Return Policy of 14 Days')}
          </Link>
        </div>
      </div>
      <div className="sm:hidden flex flex-col items-stretch justify-start px-4">
        <div className="flex flex-col items-stretch gap-1">
          <button
            className="flex items-center gap-3 border-t border-black justify-between py-5"
            onClick={() =>
              setActive({['product_features']: !active['product_features']})
            }
          >
            <p className="">{t('Product Details')}</p>
            <MdOutlineKeyboardArrowRight
              className={`${active['product_features'] ? 'rotate-90' : ''} w-8 h-8 transition-transform`}
            />
          </button>
          <AnimatePresence>
            {active['product_features'] && (
              <motion.div
                initial={{height: 0}}
                animate={{height: 'auto'}}
                exit={{height: 0}}
                className="z-10 overflow-hidden"
              >
                <p className="text-sm max-w-85 mb-5">{productCode}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div className="flex flex-col items-stretch gap-1">
          <button
            className="flex items-center gap-3 border-t border-black justify-between py-5"
            onClick={() =>
              setActive({['material_care']: !active['material_care']})
            }
          >
            <p className="">{t('Product Care')}</p>
            <MdOutlineKeyboardArrowRight
              className={`${active['material_care'] ? 'rotate-90' : ''} w-8 h-8 transition-transform`}
            />
          </button>
          <AnimatePresence>
            {active['material_care'] && (
              <motion.div
                initial={{height: 0}}
                animate={{height: 'auto'}}
                exit={{height: 0}}
                className="z-10 overflow-hidden"
              >
                <div className="text-sm max-w-85 mb-5">
                  {careGuide.map((item) => (
                    <p key={item}>{item}</p>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div className="flex flex-col items-stretch gap-1">
          <button
            className="flex items-center gap-3 border-t border-b border-black justify-between py-5"
            onClick={() =>
              setActive({['shipping_return']: !active['shipping_return']})
            }
          >
            <p className="">{t('Shipping & Return')}</p>
            <MdOutlineKeyboardArrowRight
              className={`${active['shipping_return'] ? 'rotate-90' : ''} w-8 h-8 transition-transform`}
            />
          </button>
          <AnimatePresence>
            {active['shipping_return'] && (
              <motion.div
                initial={{height: 0}}
                animate={{height: 'auto'}}
                exit={{height: 0}}
                className="z-10 overflow-hidden"
              >
                <p className="text-xm">{t('Same Day Delivery before 6pm')}</p>
                <p className="text-xm">
                  {t('Free shipping from orders above 1000 AED')}
                </p>
                <p className="text-sm mb-5">
                  {t('Extended Exchange, Return Policy of 14 Days')}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      {similarProducts && similarProducts.length > 0 ? (
        <ProductsSection
          t={t}
          direction={direction}
          title={t(`More ${product.productType}`)}
          viewAllLink={`/collections/${product.productType.toLowerCase()}`}
          width={width}
          height={height}
          products={similarProducts}
          containerClassName="mx-4 sm:mx-8"
        />
      ) : (
        <></>
      )}
      {combineProducts.length > 0 ? (
        <ProductsSection
          t={t}
          direction={direction}
          title={t('Combine with')}
          viewAllLink="#"
          width={width}
          height={height}
          products={combineProducts}
          containerClassName="mx-4 sm:mx-8"
          showViewAll={false}
        />
      ) : (
        <></>
      )}
      
      {/* NEW RECOMMENDATIONS STRIP */}
      <ProductsSection
        t={t}
        direction={direction}
        title={t('Recommendations')}
        viewAllLink={`/search?product_type=${encodeURIComponent(product.productType ?? '')}`}
        width={width}
        height={height}
        products={recommendations}
        containerClassName="mx-4 sm:mx-8"
      >
        {recommendations.length === 0 && (
          <p className="text-sm text-neutral-500 mt-4">
            {t('No recommendations yet — check back soon!')}
          </p>
        )}
      </ProductsSection>
      
      {youMayAlsoLikeProducts &&
      youMayAlsoLikeProducts.products.nodes.length > 0 ? (
        <ProductsSection
          t={t}
          direction={direction}
          title={t('You May Also Like')}
          viewAllLink={youMayAlsoLikeProducts.handle}
          width={width}
          height={height}
          products={youMayAlsoLikeProducts.products.nodes}
          containerClassName="mx-4 sm:mx-8"
        />
      ) : (
        <></>
      )}
    </div>
  );
}

function ProductImage({
  images,
  variantImage,
  direction,
  selectedColor = null,
  productVideo = null,
  productPreviewVideo = null,
}: {
  images: ProductFragment['images'];
  variantImage: ProductVariantFragment['image'];
  direction: 'rtl' | 'ltr';
  selectedColor?: string | null;
  productVideo?: string | null;
  productPreviewVideo?: Pick<ImageType, 'id' | 'url' | 'altText'> | null;
}) {
  if (!variantImage) {
    return <></>;
  }

  const [selectedImage, setSelectedImage] = useState<
    | ({__typename: 'Image'} & Pick<
        ImageType,
        'id' | 'url' | 'height' | 'width' | 'altText'
      >)
    | string
  >(variantImage);
  
  // Track the current index for the mobile swiper
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Filter images based on selected color
  const filteredImages = selectedColor 
    ? images.nodes.filter(image => image.url.toLowerCase().includes(selectedColor))
    : images.nodes;
  
  // Add video to the image array if available
  const allMedia = [...filteredImages];
  if (productVideo && productPreviewVideo) {
    allMedia.push({
      __typename: 'Video',
      id: 'video-preview',
      url: productVideo,
      height: 400, // Default height
      width: 400, // Default width
      altText: productPreviewVideo.altText || 'Product Video',
    } as any);
  }

  useEffect(() => {
    setSelectedImage(variantImage);
    setCurrentIndex(0); // Reset index when variant changes
  }, [variantImage, selectedColor]);

  // Handler for mobile swipe navigation
  const handleSwipe = (direction: 'next' | 'prev') => {
    if (direction === 'next') {
      setCurrentIndex((prev) => (prev < allMedia.length - 1 ? prev + 1 : 0));
      setSelectedImage(allMedia[currentIndex < allMedia.length - 1 ? currentIndex + 1 : 0]);
    } else {
      setCurrentIndex((prev) => (prev > 0 ? prev - 1 : allMedia.length - 1));
      setSelectedImage(allMedia[currentIndex > 0 ? currentIndex - 1 : allMedia.length - 1]);
    }
  };

  return (
    <div className="relative overflow-hidden flex flex-col xs:flex-row items-start max-w-212.5 w-full px-2 sm:px-6 py-4 bg-white">
      {/* Desktop vertical thumbnail gallery - hidden on very small screens */}
      <div className="hidden xs:flex min-w-fit max-h-50 xs:max-h-65 sm:max-h-170 flex-col gap-4 scrollbar-none overflow-auto">
        {filteredImages.map((image) => (
          <button
            key={image.id}
            onClick={() => {
              setSelectedImage(image);
              setCurrentIndex(filteredImages.indexOf(image));
            }}
            className={`overflow-hidden border ${
              typeof selectedImage !== 'string' && selectedImage.id === image.id 
                ? 'border-primary-P-40' 
                : 'border-neutral-N-50'
            } w-9 min-h-7 xs:w-18 xs:min-h-14 sm:w-35.5 sm:min-h-26 bg-white rounded-sm hover:border-neutral-N-10 transition-colors`}
          >
            <Image
              data={image}
              alt={image.altText || 'Product Image'}
              aspectRatio="1/1"
              className="w-auto max-h-7 xs:max-h-14 sm:max-h-26 object-contain object-center rounded-none"
              sizes="auto"
            />
          </button>
        ))}
        {productVideo && productPreviewVideo ? (
          <button
            onClick={() => {
              setSelectedImage(productVideo);
              setCurrentIndex(filteredImages.length);
            }}
            className={`overflow-hidden border ${typeof selectedImage === 'string' ? 'border-primary-P-40' : 'border-neutral-N-50'} w-9 min-h-7 xs:w-18 xs:min-h-14 sm:w-35.5 sm:min-h-26 bg-white rounded-sm hover:border-neutral-N-10 transition-colors`}
          >
            <Image
              data={productPreviewVideo}
              alt={productPreviewVideo.altText || 'Product Image'}
              aspectRatio="1/1"
              className="w-auto max-h-7 xs:max-h-14 sm:max-h-26 object-cover object-top rounded-none"
              sizes="auto"
            />
          </button>
        ) : (
          <></>
        )}
      </div>
      
      {/* Mobile carousel indicators - visible only on xs screens */}
      <div className="xs:hidden w-full flex justify-center items-center gap-1 mt-2 mb-4">
        {allMedia.map((_, index) => (
          <button 
            key={`indicator-${index}`}
            onClick={() => {
              setCurrentIndex(index);
              setSelectedImage(allMedia[index]);
            }}
            className={`w-2 h-2 rounded-full ${currentIndex === index ? 'bg-primary-P-40' : 'bg-neutral-N-80'}`}
            aria-label={`View product image ${index + 1}`}
          />
        ))}
      </div>
      
      {/* Main image display area */}
      <div className="relative flex-grow flex flex-col">
        {/* Mobile swipe navigation - visible only on xs screens */}
        <div className="xs:hidden w-full flex justify-between absolute top-1/2 transform -translate-y-1/2 z-10 px-2">
          <button 
            onClick={() => handleSwipe('prev')}
            className="bg-white/80 hover:bg-white rounded-full p-1 shadow"
            aria-label="Previous image"
          >
            <IoIosArrowForward className={`${direction === 'rtl' ? '' : 'rotate-180'} w-5 h-5`} />
          </button>
          <button 
            onClick={() => handleSwipe('next')}
            className="bg-white/80 hover:bg-white rounded-full p-1 shadow"
            aria-label="Next image"
          >
            <IoIosArrowForward className={`${direction === 'rtl' ? 'rotate-180' : ''} w-5 h-5`} />
          </button>
        </div>
        
        {/* Main display - image or video */}
        {typeof selectedImage !== 'string' ? (
          <Image
            data={selectedImage}
            alt={selectedImage.altText || 'Variant Product Image'}
            aspectRatio="1/1"
            className="w-auto max-h-50 xs:max-h-65 sm:max-h-170 bg-white object-contain object-center"
            sizes="auto"
          />
        ) : (
          <div className="max-w-full mx-auto">
            <video
              width="100%"
              height="auto"
              autoPlay
              loop
              className="w-auto max-h-50 xs:max-h-65 sm:max-h-170 px-4 bg-white object-contain object-center"
            >
              <source src={selectedImage} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        )}
      </div>
    </div>
  );
}

function ProductMain({
  selectedVariant,
  product,
  productTitle,
  productDescription,
  variants,
  t,
  direction,
  navigate,
}: {
  product: ProductFragment;
  productTitle: string;
  productDescription: string;
  selectedVariant: ProductFragment['selectedVariant'];
  variants: Array<ProductVariantFragment>;
  t: TFunction<'translation', undefined>;
  direction: 'ltr' | 'rtl';
  navigate: NavigateFunction;
}) {
  const [rate, setRate] = useState('0');
  const [description, setDescription] = useState<string[]>([]);
  useEffect(() => {
    setRate((Math.random() * 10000).toFixed(0));
  }, []);

  useEffect(() => {
    if (direction === 'rtl') {
      const array = productDescription.split('\n');
      setDescription(array);
    }
  }, [direction, productDescription]);
  return (
    <div className="sticky top-51.5 flex flex-col items-stretch justify-start">
      <div className="flex flex-col gap-3 mb-6">
        <h1 className="text-3xl font-semibold">
          {productTitle} - {t(product.vendor)}
        </h1>
        <p className="text-2xl">{t(product.productType)}</p>
        <div className="flex items-center justify-start gap-3">
          <div className="flex items-center justify-center gap-0.5">
            <IoMdStar className="text-secondary-S-90 w-6 h-6" />
            <IoMdStar className="text-secondary-S-90 w-6 h-6" />
            <IoMdStar className="text-secondary-S-90 w-6 h-6" />
            <IoMdStar className="text-secondary-S-90 w-6 h-6" />
            <IoMdStar className="text-neutral-N-80 w-6 h-6" />
          </div>
          <p className="text-primary-P-40 font-medium text-sm">
            {rate} {t('reviews')}
          </p>
        </div>
        <ProductPrice selectedVariant={selectedVariant} t={t} />
      </div>
      <ProductForm
        t={t}
        direction={direction}
        product={product}
        selectedVariant={selectedVariant}
        variants={variants}
        navigate={navigate}
      />
      <div className="mt-10 flex flex-col items-stretch justify-start gap-3">
        <h1 className="text-3xl font-semibold">{t('Product Features')}</h1>
        {direction === 'ltr' ? (
          <div dangerouslySetInnerHTML={{__html: productDescription}} />
        ) : (
          <div>
            {description.map((item) => (
              <p key={item}>{item}</p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ProductPrice({
  selectedVariant,
  t,
}: {
  selectedVariant: ProductFragment['selectedVariant'];
  t: TFunction<'translation', undefined>;
}) {
  const {currency} = useCustomContext();
  return selectedVariant ? (
    selectedVariant.compareAtPrice ? (
      <div className="flex flex-wrap gap-2 text-xl sm:text-3xl font-semibold">
        <Money
          data={{
            amount: (
              parseFloat(selectedVariant.price.amount) * currency.exchange_rate
            ).toString(),
            currencyCode: currency.currency['en'] as CurrencyCode,
            __typename: 'MoneyV2',
          }}
        />
        <s>
          <Money
            data={{
              amount: (
                parseFloat(selectedVariant.compareAtPrice.amount) *
                currency.exchange_rate
              ).toString(),
              currencyCode: currency.currency['en'] as CurrencyCode,
            }}
          />
        </s>
        <span className="block text-xl sm:text-3xl text-red-700 text-bold">
          {calculateSalePercentage(
            selectedVariant.compareAtPrice.amount,
            selectedVariant.price.amount,
          )}
          % {t('OFF')}
        </span>
      </div>
    ) : (
      <Money
        className="text-xl sm:text-3xl font-semibold"
        data={{
          amount: (
            parseFloat(selectedVariant.price.amount) * currency.exchange_rate
          ).toString(),
          currencyCode: currency.currency['en'] as CurrencyCode,
        }}
      />
    )
  ) : (
    'Price not set'
  );
}

function ProductForm({
  t,
  direction,
  product,
  selectedVariant,
  variants,
  navigate,
}: {
  t: TFunction<'translation', undefined>;
  direction: 'ltr' | 'rtl';
  product: ProductFragment;
  selectedVariant: ProductFragment['selectedVariant'];
  variants: Array<ProductVariantFragment>;
  navigate: NavigateFunction;
}) {
  const [guide, setGuide] = useState('');

  useEffect(() => {
    const collections = product.collections.nodes;
    // Find the first matching collection
    const collection = collections.find((collection) =>
      ['women', 'men', 'kids'].includes(collection.handle),
    );
    if (collection) {
      setGuide(collection.handle);
    }
  }, [product]);

  return (
    <>
      <div className="flex flex-col items-start justify-start gap-4 mb-6">
        <VariantSelector
          handle={product.handle}
          options={product.options}
          variants={variants}
        >
          {({option}) => (
            <ProductOptions
              t={t}
              direction={direction}
              key={option.name}
              option={option}
              variants={variants}
              selectedOptions={selectedVariant?.selectedOptions ?? []}
              guide={guide}
              section={product.productType}
            />
          )}
        </VariantSelector>
      </div>
      <AddToCartButton
        t={t}
        lines={
          selectedVariant
            ? [
                {
                  merchandiseId: selectedVariant.id,
                  quantity: 1,
                },
              ]
            : []
        }
        isAvailable={selectedVariant ? selectedVariant.availableForSale : false}
        navigate={navigate}
      />
    </>
  );
}

function ProductOptions({
  option,
  t,
  direction,
  variants,
  selectedOptions,
  guide,
  section,
}: {
  t: TFunction<'translation', undefined>;
  direction: 'ltr' | 'rtl';
  option: VariantOption;
  variants: Array<ProductVariantFragment>;
  selectedOptions: SelectedOption[]; // Track selected options like size, color
  guide: string;
  section: string;
}) {
  const isOptionAvailable = (name: string, value: string) => {
    return variants.some((variant) =>
      variant.selectedOptions.every((selectedOption) =>
        selectedOption.name === name
          ? selectedOption.value === value
          : selectedOption.value ===
            selectedOptions.find((so) => so.name === selectedOption.name)
              ?.value,
      ),
    );
  };

  return (
    <div key={option.name} className="mb-4">
      <div
        className={`${option.name === 'Color' ? 'justify-start' : 'justify-between'} flex items-end gap-1.25`}
      >
        <p className="text-lg font-medium">{t(option.name)}</p>
        {option.name === 'Color' ? (
          <span className="text-sm text-neutral-N-80">
            {t(option.value as string)}
          </span>
        ) : (
          <Link
            className="hover:underline text-sm bg-transparent text-primary-P-40"
            to={
              guide
                ? `/sizes?guide=${guide}&section=${section}#size_details`
                : '/sizes'
            }
          >
            {t('Size Guide')}
          </Link>
        )}
      </div>
      <div className="flex items-start sm:justify-start flex-wrap gap-2 mt-2">
        {option.values.map(({value, isAvailable, isActive, to}) => {
          const exists = isOptionAvailable(option.name, value);
          return (
            exists &&
            (option.name === 'Color' ? (
              <Link
                className={`hover:no-underline ${
                  isAvailable ? 'opacity-100' : 'opacity-30'
                } block rounded-full w-10 h-10`}
                key={option.name + value}
                prefetch="intent"
                preventScrollReset
                replace
                to={to}
              >
                <ColorCircleIcon
                  option={value}
                  productId={option.name}
                  selectedVariant={isActive ? {[option.name]: {Color: value}} : {}}
                />
              </Link>
            ) : (
              <Link
                className={`hover:no-underline ${
                  isActive
                    ? 'bg-secondary-S-90 text-white border-transparent'
                    : 'bg-transparent text-neutral-N-30 border-neutral-N-50 hover:border-neutral-N-30'
                } ${
                  isAvailable ? 'opacity-100' : 'opacity-30'
                } min-w-[48px] h-12 flex items-center justify-center border rounded-lg text-base font-medium transition-all`}
                key={option.name + value}
                prefetch="intent"
                preventScrollReset
                replace
                to={to}
              >
                <span className="flex items-center gap-2 px-4">
                  <FaCheck
                    className={`${isActive ? 'block' : 'hidden'} ${direction === 'rtl' ? 'order-2' : ''} w-4 h-4`}
                  />
                  {value}
                </span>
              </Link>
            ))
          );
        })}
      </div>
    </div>
  );
}

function AddToCartButton({
  t,
  analytics,
  isAvailable,
  lines,
  navigate,
}: {
  t: TFunction<'translation', undefined>;
  analytics?: unknown;
  isAvailable: boolean;
  lines: CartLineInput[];
  navigate: NavigateFunction;
}) {
  const [isLoading, setIsLoading] = useState(false);
  
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.LinesAdd}
      inputs={{
        lines,
      }}
    >
      {(fetcher: FetcherWithComponents<any>) => {
        useEffect(() => {
          if (fetcher.state === 'loading') {
            setIsLoading(true);
          } else if (fetcher.state === 'idle' && isLoading) {
            setIsLoading(false);
            
            // GA4: add_to_cart event when item is successfully added to cart
            if (lines && lines.length > 0 && lines[0].merchandiseId) {
              // Extract the variant info from the merchandiseId
              // Example format: "gid://shopify/ProductVariant/123456789"
              const variantId = lines[0].merchandiseId.split('/').pop();
              
              // Find the variant details if needed
              // This depends on having access to the variants data, which might need to be passed to this component
              sendGA4Event('add_to_cart', {
                currency: 'AED', // You may need to pass this value dynamically
                value: 0, // Set price dynamically if available
                items: [
                  {
                    item_id: variantId,
                    quantity: lines[0].quantity,
                  },
                ],
              });
            }
          }
        }, [fetcher]);

        return (
          <>
            <input
              name="analytics"
              type="hidden"
              value={JSON.stringify(analytics)}
            />
            <div className="flex gap-5 sm:gap-10 flex-wrap sm:flex-nowrap items-stretch sm:items-center justify-start">
              {isAvailable ? (
                <button
                  type="button"
                  onClick={() => {
                    // First do validation checks
                    if (!lines || !Array.isArray(lines) || lines.length === 0) {
                      console.error('Invalid lines array:', lines);
                      alert('Please select a product variant first');
                      return;
                    }
                    
                    // Ensure merchandiseId is present
                    const validLines = lines.filter(line => line && line.merchandiseId);
                    if (validLines.length === 0) {
                      console.error('No valid merchandiseId in lines:', lines);
                      alert('Please select a valid product variant first');
                      return;
                    }
                    
                    // Log what we're sending to handleCreateCheckout
                    console.log('Buy Now clicked with valid lines:', JSON.stringify(validLines, null, 2));
                    
                    // GA4: begin_checkout event
                    if (validLines && validLines.length > 0) {
                      const variantId = validLines[0].merchandiseId.split('/').pop();
                      sendGA4Event('begin_checkout', {
                        currency: 'AED', // You may need to pass this value dynamically
                        value: 0, // Set price dynamically if available
                        items: [
                          {
                            item_id: variantId,
                            quantity: validLines[0].quantity,
                          }
                        ]
                      });
                    }
                    
                    // Proceed with checkout
                    handleCreateCheckout({
                      lines: validLines,
                      navigate,
                    });
                  }}
                  className="min-w-full sm:min-w-49 rounded-md px-6 py-2.5 bg-primary-P-40 text-white border border-transparent font-medium"
                >
                  {t('Buy Now')}
                </button>
              ) : (
                <></>
              )}
              <button
                type="submit"
                disabled={!isAvailable || isLoading}
                className="min-w-full sm:min-w-49 rounded-md px-6 py-2.5 bg-transparent text-primary-P-40 border border-primary-P-40 font-medium"
              >
                {isAvailable
                  ? isLoading
                    ? t('Processing...')
                    : t('Add to Bag')
                  : t('Sold Out')}
              </button>
            </div>
          </>
        );
      }}
    </CartForm>
  );
}

const PRODUCT_VARIANT_FRAGMENT = `#graphql
  fragment ProductVariant on ProductVariant {
    availableForSale
    compareAtPrice {
      amount
      currencyCode
    }
    id
    image {
      __typename
      id
      url
      altText
      width
      height
    }
    price {
      amount
      currencyCode
    }
    product {
      title
      tags
      productType
      handle
    }
    selectedOptions {
      name
      value
    }
    sku
    title
    unitPrice {
      amount
      currencyCode
    }
  }
` as const;

const PRODUCT_FRAGMENT = `#graphql
  fragment Product on Product {
    id
    title
    vendor
    tags
    productType
    handle
    descriptionHtml
    description
    options {
      name
      values
    }
    collections(first: 100) {
      nodes {
        handle
        title
      }
    }
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
      maxVariantPrice {
        amount
        currencyCode
      }
    }
    compareAtPriceRange {
      minVariantPrice {
        amount
        currencyCode
      }
      maxVariantPrice {
        amount
        currencyCode
      }
    }
    featuredImage {
      id
      altText
      url
      width
      height
    }
    images(first: 100) {
      nodes {
        __typename
        id
        url
        altText
        width
        height
      }
    }
    media(first: 100) {
      nodes {
        __typename
        previewImage {
          id
          url
          altText
        }
        ... on Video {
          mediaContentType
          sources {
            format
            url
          }
        }
      }
    }
    selectedVariant: variantBySelectedOptions(selectedOptions: $selectedOptions, ignoreUnknownOptions: true, caseInsensitiveMatch: true) {
      ...ProductVariant
    }
    variants(first: 1) {
      nodes {
        ...ProductVariant
      }
    }
    seo {
      description
      title
    }
  }
  ${PRODUCT_VARIANT_FRAGMENT}
` as const;

// NOTE: https://shopify.dev/docs/api/storefront/2022-04/objects/collection
const COMBINE_PRODUCT_QUERY = `#graphql
  ${PRODUCT_CARD_FRAGMENT}
  query CollectionDynamicProducts(
    $handle: String!
    $country: CountryCode
    $language: LanguageCode
    $firstFilter: [ProductFilter!]
    $secondFilter: [ProductFilter!]
  ) @inContext(country: $country, language: $language) {
    collection(handle: $handle) {
      id
      handle
      title
      description
      firstProduct: products(first: 1, filters: $firstFilter) {
        nodes {
          ...ProductCard
        }
      }
      secondProduct: products(first: 1, filters: $secondFilter) {
        nodes {
          ...ProductCard
        }
      }
    }
  }
` as const;

const PRODUCT_QUERY = `#graphql
  query Product(
    $country: CountryCode
    $handle: String!
    $language: LanguageCode
    $selectedOptions: [SelectedOptionInput!]!
  ) @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      ...Product
    }
  }
  ${PRODUCT_FRAGMENT}
` as const;

const PRODUCT_VARIANTS_FRAGMENT = `#graphql
  fragment ProductVariants on Product {
    variants(first: 250) {
      nodes {
        ...ProductVariant
      }
    }
  }
  ${PRODUCT_VARIANT_FRAGMENT}
` as const;

const VARIANTS_QUERY = `#graphql
  ${PRODUCT_VARIANTS_FRAGMENT}
  query ProductVariants(
    $country: CountryCode
    $language: LanguageCode
    $handle: String!
  ) @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      ...ProductVariants
    }
  }
` as const;