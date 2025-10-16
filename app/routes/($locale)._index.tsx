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
  return [
    // English Meta Tags
    {
      title: 'Mario Bologna – Luxury House of Brands in Dubai | Italian Fashion',
    },
    {
      name: 'description',
      content:
        'Discover Mario Bologna, the luxury house of brands in Dubai. Shop premium Italian fashion, designer dresses, handbags & accessories with fast UAE delivery.',
    },
    {
      name: 'keywords',
      content:
        'luxury fashion Dubai, designer brands UAE, Italian fashion Dubai, premium shopping Dubai, luxury boutique Dubai, high-end fashion UAE, Mario Bologna Dubai',
    },
    {
      name: 'robots',
      content:
        'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
    },

    // Open Graph
    { property: 'og:type', content: 'website' },
    { property: 'og:site_name', content: 'Mario Bologna' },
    {
      property: 'og:title',
      content:
        'Mario Bologna - Luxury Fashion Brands in Dubai | Premium Fashion & Accessories',
    },
    {
      property: 'og:description',
      content:
        'Mario Bologna - Luxury Fashion Brands in Dubai features exclusive Italian designer collections. Premium fashion & accessories for discerning customers across UAE & Saudi Arabia.',
    },
    {
      name: 'keywords',
      content:
        'luxury fashion Dubai, luxury house of brands, designer boutique Dubai, multi-brand boutique UAE, women’s designer dresses Dubai, men’s luxury clothing Dubai, luxury handbags Dubai, Italian designer fashion, personal styling Dubai, express UAE delivery',
    },
    { property: 'og:url', content: 'https://mariobologna.com' },
    {
      property: 'og:image',
      content: '/images/mario-bologna-luxury-brands-dubai.jpg',
    },
    { property: 'og:image:width', content: '1200' },
    { property: 'og:image:height', content: '630' },
    { property: 'og:locale', content: 'en_AE' },
    { property: 'og:locale:alternate', content: 'ar_AE' },

    // Twitter
    { name: 'twitter:card', content: 'summary_large_image' },
    {
      name: 'twitter:title',
      content:
        'Mario Bologna - Luxury Fashion Brands in Dubai | Premium Fashion',
    },
    {
      name: 'twitter:description',
      content:
        'Mario Bologna - Luxury Fashion Brands in Dubai. Premium Italian fashion collections with fast UAE delivery.',
    },
    {
      name: 'twitter:image',
      content: '/images/mario-bologna-luxury-brands-dubai.jpg',
    },
  ];
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
      cache: storefront.CacheLong(),
      variables: {country, handle: 'new-arrivals', first: 5},
    },
  );
  const {collection: topPicksProducts} = await storefront.query(
    OTHER_COLLECTION_QUERY,
    {
      cache: storefront.CacheLong(),
      variables: {country, handle: 'best-selling', first: 8},
    },
  );

  const {collection: lookCollection} = await storefront.query(
    ONE_LOOK_COLLECTION_QUERY,
    {
      cache: storefront.CacheLong(),
      variables: {country, handle: 'one-look'},
    },
  );

  // Keep old hero section code commented out for future reference
  /*
  const oldHeroHandle = 'hero-section-2teqinir';
  const oldHeroType = 'hero_section';
  const {metaobject: oldHeroMetaObject} = await context.storefront.query(
    METAOBJECT_CONTENT_QUERY,
    {
      variables: {
        country,
        handle: oldHeroHandle,
        type: oldHeroType,
      },
    },
  );

  if (!oldHeroMetaObject) {
    throw new Response(`Metaobject ${oldHeroHandle} - ${oldHeroType} not found`, {
      status: 404,
    });
  }
  */

  const newHeroHandle = 'new-hero-section-bxxwyyls';
  const newHeroType = 'new_hero_section';
  const {metaobject} = await context.storefront.query(
    METAOBJECT_CONTENT_QUERY,
    {
      cache: context.storefront.CacheLong(),
      variables: {
        country,
        handle: newHeroHandle,
        type: newHeroType,
      },
    },
  );

  // Debug log to check the metaobject response
  // console.log('Metaobject response:', JSON.stringify(metaobject, null, 2));

  if (!metaobject) {
    throw new Response(`Metaobject ${newHeroHandle} - ${newHeroType} not found`, {
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
    <div className="home dir-aware">
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
            title={t('New Arrivals')}
            viewAllLink="new-arrivals"
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
      
      {/* SEO Content - Hidden from users but visible to search engines */}
      <div className="visually-hidden">
      <section>
  <h1>Mario Bologna — Luxury House of Brands in Dubai</h1>

  <h2>Luxury Fashion Brands in Dubai — Curated Designer Collections</h2>
  <p>
    Discover Mario Bologna, Dubai’s luxury <strong>house of brands</strong>. Explore hand-picked designer
    pieces for <a href="/collections/women" title="Women's Luxury Fashion Dubai">women</a>,
    <a href="/collections/men" title="Men's Designer Fashion Dubai">men</a>, and
    <a href="/collections/kids" title="Kids Luxury Clothing Dubai">kids</a>—with premium Italian
    craftsmanship, limited editions, and express UAE & GCC delivery.
  </p>

  <h2>Best Luxury Fashion Brands in Dubai — Why Mario Bologna</h2>
  <p>
    We curate timeless silhouettes, elevated essentials, and statement accessories from leading fashion
    houses. Enjoy personal styling, secure checkout, and fast shipping from our Dubai boutique to your door.
    <a href="/new-arrivals" title="New Arrivals Dubai">Shop new arrivals</a>.
  </p>

  <h2>Shop by Collection</h2>
  <ul>
    <li><strong>Women:</strong> evening dresses, kaftans, tailoring, handbags &amp; fine accessories.</li>
    <li><strong>Men:</strong> lightweight tailoring, cotton shirts, classic shoes &amp; sneakers.</li>
    <li><strong>Kids:</strong> breathable premium fabrics for comfort and special occasions.</li>
  </ul>

</section>

<section>
<h2>FAQs about Luxury Fashion in Dubai</h2>
  <h3>Where is Mario Bologna located?</h3>
  <p>Mario Bologna is based in Dubai and delivers luxury designer fashion across the UAE and GCC.</p>
  <h3>Do you offer international shipping?</h3>
  <p>Yes, we offer fast and secure delivery throughout the GCC and selected international destinations.</p>

  </section>

  <p>
  Mario Bologna brings the finest international designers to Dubai.
  Our luxury boutique blends European artistry with Middle Eastern elegance,
  making us the destination for refined style in the UAE.
</p>

<section lang="ar" dir="rtl">
  <h2>ماريو بولونيا — دار الماركات الفاخرة في دبي</h2>
  <p>
    اكتشف دار الماركات من ماريو بولونيا في دبي: تشكيلات مصممين مختارة للنساء والرجال والأطفال،
    بحِرفية إيطالية وقطع محدودة مع توصيل سريع داخل الإمارات والخليج.
  </p>

  <h2>أفضل الماركات الفاخرة في دبي — لماذا ماريو بولونيا؟</h2>
  <p>
    نُقدّم قصّات خالدة وقطعاً أساسية راقية واكسسوارات مميّزة من أرقى دور الأزياء، مع خدمة
    تنسيق شخصية ودفع آمن وتوصيل سريع. <a href="/new-arrivals">تسوّق الجديد</a>.
  </p>

  <h2>تسوّق حسب القسم</h2>
  <ul>
    <li><strong>النساء:</strong> فساتين سهرة، كافتان، قصّات رسمية، حقائب واكسسوارات.</li>
    <li><strong>الرجال:</strong> بدلات خفيفة، قمصان قطنية، أحذية كلاسيكية وسنيكرز.</li>
    <li><strong>الأطفال:</strong> أقمشة فاخرة مريحة للمناسبات.</li>
  </ul>

  
</section>
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
        references?: Maybe<{
          nodes: Array<
            Pick<MediaImage, 'id'> & {
              image?: Maybe<Pick<Image, 'url' | 'altText' | 'width' | 'height'>>;
            }
          >;
        }>;
      }
    >;
  };
}) {
  const [desktopImage, setDesktopImage] = useState<string>('');
  const [tabletImage, setTabletImage] = useState<string>('');
  const [mobileImage, setMobileImage] = useState<string>('');

  useEffect(() => {
    // Log the entire metaobject for debugging
    // console.log('Full metaobject:', JSON.stringify(metaobject, null, 2));
    
    if (!metaobject?.fields) {
      // console.log('No metaobject fields found');
      return;
    }
    
    // Log all field keys to see what's available
    // console.log('Available field keys:', metaobject.fields.map(f => f.key));
    
    // Helper function to extract image URL from a field
    const extractImageUrl = (field: any, fieldName: string): string | undefined => {
      if (!field) {
        // console.log(`No field provided for ${fieldName}`);
        return undefined;
      }
      
      // console.log(`Extracting ${fieldName} image from field:`, field);
      // console.log(`Field type: ${field.type}, Field key: ${field.key}`);
      
      // Try reference.image.url (most common for file/media fields in Shopify)
      if (field.reference?.image?.url) {
        // console.log(`Found ${fieldName} URL in reference.image.url:`, field.reference.image.url);
        return field.reference.image.url;
      }
      
      // Try direct reference.url (sometimes the structure is simpler)
      if (field.reference?.url) {
        // console.log(`Found ${fieldName} URL in reference.url:`, field.reference.url);
        return field.reference.url;
      }
      
      // Try references.nodes[0].image.url (for multi-file fields)
      if (field.references?.nodes?.[0]?.image?.url) {
        // console.log(`Found ${fieldName} URL in references.nodes[0].image.url:`, field.references.nodes[0].image.url);
        return field.references.nodes[0].image.url;
      }
      
      // Try references.nodes[0].url (for multi-file fields with simpler structure)
      if (field.references?.nodes?.[0]?.url) {
        // console.log(`Found ${fieldName} URL in references.nodes[0].url:`, field.references.nodes[0].url);
        return field.references.nodes[0].url;
      }
      
      // Try parsing value as JSON
      if (field.value) {
        try {
          const parsedValue = JSON.parse(field.value) as any;
          // console.log(`Parsed ${fieldName} value:`, parsedValue);
          const url = parsedValue?.url || parsedValue?.src;
          if (url) {
            // console.log(`Found ${fieldName} URL in parsed value:`, url);
            return url;
          }
        } catch (e) {
          // console.log(`Failed to parse ${fieldName} field value as JSON:`, e);
          // Maybe it's a direct URL string
          if (typeof field.value === 'string' && field.value.includes('http')) {
            // console.log(`Found ${fieldName} URL as direct string:`, field.value);
            return field.value;
          }
        }
      }
      
      // console.log(`No ${fieldName} URL found in field`);
      return undefined;
    };
    
    let desktopUrl, tabletUrl, mobileUrl;
    
    if (language === 'ar') {
      // For Arabic language, first try Arabic-specific fields
      const desktopArabicField = metaobject.fields.find(
        (field) => field.key === 'Desktop_arabic' || field.key === 'desktop_arabic'
      );
      const tabletArabicField = metaobject.fields.find(
        (field) => field.key === 'Tablet_arabic' || field.key === 'tablet_arabic'
      );
      const mobileArabicField = metaobject.fields.find(
        (field) => field.key === 'Mobile_arabic' || field.key === 'mobile_arabic'
      );
      
      // Try to extract URLs from Arabic fields first
      desktopUrl = extractImageUrl(desktopArabicField, 'desktop_arabic');
      tabletUrl = extractImageUrl(tabletArabicField, 'tablet_arabic');
      mobileUrl = extractImageUrl(mobileArabicField, 'mobile_arabic');
      
      // console.log('Arabic fields found:', {
      //   desktop: !!desktopArabicField,
      //   tablet: !!tabletArabicField,
      //   mobile: !!mobileArabicField
      // });
      // console.log('Arabic URLs extracted:', {
      //   desktopUrl,
      //   tabletUrl,
      //   mobileUrl
      // });
      
      // If Arabic images not found, fall back to English fields
      if (!desktopUrl) {
        const desktopField = metaobject.fields.find(
          (field) => ['Desktop', 'desktop', 'pc', 'PC', 'pc_image', 'desktop_image'].includes(field.key)
        );
        desktopUrl = extractImageUrl(desktopField, 'desktop_fallback');
      }
      
      if (!tabletUrl) {
        const tabletField = metaobject.fields.find(
          (field) => ['tablet', 'Tablet', 'tablet_image', 'ipad'].includes(field.key)
        );
        tabletUrl = extractImageUrl(tabletField, 'tablet_fallback');
      }
      
      if (!mobileUrl) {
        const mobileField = metaobject.fields.find(
          (field) => ['mobile', 'Mobile', 'mobile_image', 'phone'].includes(field.key)
        );
        mobileUrl = extractImageUrl(mobileField, 'mobile_fallback');
      }
    } else {
      // For English/other languages, use default fields directly
      // console.log('Processing English/default language fields');
      
      // Find the Desktop field with multiple attempts
      let desktopField = metaobject.fields.find(field => field.key === 'Desktop');
      if (!desktopField) {
        desktopField = metaobject.fields.find(field => ['desktop', 'pc', 'PC', 'pc_image', 'desktop_image'].includes(field.key));
      }
      
      // Find other fields
      const tabletField = metaobject.fields.find(field => field.key === 'Tablet') ||
                         metaobject.fields.find(field => ['tablet', 'tablet_image', 'ipad'].includes(field.key));
      
      const mobileField = metaobject.fields.find(field => field.key === 'Mobile') ||
                         metaobject.fields.find(field => ['mobile', 'mobile_image', 'phone'].includes(field.key));
      
      // console.log('Found desktop field:', desktopField);
      // console.log('Found tablet field:', tabletField);
      // console.log('Found mobile field:', mobileField);
      
      // Extract URLs with enhanced Desktop field handling
      if (desktopField) {
        // Try multiple extraction methods specifically for Desktop field
        desktopUrl = desktopField.reference?.image?.url ||
                    (desktopField.reference as any)?.url ||
                    desktopField.references?.nodes?.[0]?.image?.url ||
                    (desktopField.references?.nodes?.[0] as any)?.url ||
                    (desktopField.value && typeof desktopField.value === 'string' && desktopField.value.includes('http') ? desktopField.value : undefined);
        
        // Try parsing JSON value if no direct URL found
        if (!desktopUrl && desktopField.value) {
          try {
            const parsed = JSON.parse(desktopField.value) as any;
            desktopUrl = parsed?.url || parsed?.src;
          } catch (e) {
            // Silent fallback
          }
        }
        
        // Temporary debug for Desktop field
        console.log('Desktop field found:', !!desktopField, 'Desktop URL extracted:', desktopUrl);
      } else {
        console.log('No Desktop field found in metaobject fields');
      }
      
      // If no desktop field found, use the 'image' field as desktop fallback
      if (!desktopUrl) {
        const imageField = metaobject.fields.find(f => f.key === 'image');
        if (imageField) {
          desktopUrl = extractImageUrl(imageField, 'image_as_desktop');
          console.log('Using image field as desktop fallback:', desktopUrl);
        }
      }
      
      tabletUrl = extractImageUrl(tabletField, 'tablet');
      mobileUrl = extractImageUrl(mobileField, 'mobile');
    }
    
    // FINAL FALLBACK: If no separate fields found, use the single 'image' field for all devices
    if (!desktopUrl && !tabletUrl && !mobileUrl) {
      // console.log('No separate device fields found, looking for single image field...');
      const imageField = metaobject.fields.find(field => field.key === 'image');
      if (imageField) {
        const fallbackUrl = extractImageUrl(imageField, 'fallback');
        if (fallbackUrl) {
          // console.log('Using single image for all devices:', fallbackUrl);
          desktopUrl = fallbackUrl;
          tabletUrl = fallbackUrl;
          mobileUrl = fallbackUrl;
        }
      }
    }
    
    // QUALITY FALLBACK: If mobile/tablet don't have specific images, use desktop
    if (!mobileUrl && desktopUrl) {
      // console.log('No mobile-specific image, using desktop image for mobile');
      mobileUrl = desktopUrl;
    }
    if (!tabletUrl && desktopUrl) {
      // console.log('No tablet-specific image, using desktop image for tablet');
      tabletUrl = desktopUrl;
    }
    
    // console.log('Final URLs for language:', language);
    // console.log('Desktop URL:', desktopUrl);
    // console.log('Tablet URL:', tabletUrl);
    // console.log('Mobile URL:', mobileUrl);
    
    // Ensure all devices get high-quality images
    const highQualityUrl = desktopUrl || tabletUrl || mobileUrl;
    if (highQualityUrl) {
      // console.log('Setting high-quality URL for all devices:', highQualityUrl);
      setDesktopImage(highQualityUrl);
      setTabletImage(highQualityUrl);
      setMobileImage(highQualityUrl);
    } else {
      if (desktopUrl) setDesktopImage(desktopUrl);
      if (tabletUrl) setTabletImage(tabletUrl);
      if (mobileUrl) setMobileImage(mobileUrl);
    }
  }, [metaobject, language]);

  return (
    <div className="relative w-full hero-image-container">
      {/* Responsive hero image with proper srcset */}
      {(mobileImage || tabletImage || desktopImage) && (
        <picture>
          {/* Mobile image */}
          {mobileImage && (
            <source
              media="(max-width: 639px)"
              srcSet={`${mobileImage}`}
              sizes="100vw"
            />
          )}
          
          {/* Tablet image */}
          {tabletImage && (
            <source
              media="(min-width: 640px) and (max-width: 1023px)"
              srcSet={`${tabletImage}`}
              sizes="100vw"
            />
          )}
          
          {/* Desktop image */}
          {desktopImage && (
            <source
              media="(min-width: 1024px)"
              srcSet={`${desktopImage}`}
              sizes="100vw"
            />
          )}
          
          <img
            src={desktopImage || tabletImage || mobileImage}
            alt="Mario Bologna - Luxury Fashion Brands in Dubai | Premium Italian Fashion Collections Summer 2025"
            className="w-full h-auto object-cover"
            loading="eager"
            decoding="async"
            style={{aspectRatio: 'var(--hero-aspect-ratio, auto)'}}
          />
        </picture>
      )}
      
      {/* Fallback if no images are loaded */}
      {!desktopImage && !tabletImage && !mobileImage && (
        <div className="w-full aspect-video bg-transparent flex items-center justify-center">
          <p>Loading Mario Bologna luxury fashion brands hero image...</p>
        </div>
      )}
      
      {/* Button positioned within the hero image area */}
      {(mobileImage || tabletImage || desktopImage) && (
        <div className="absolute bottom-16 sm:bottom-16 lg:bottom-8 left-0 right-0 flex justify-center px-4">
          <NavLink
            to="/#products_section"
            className="bg-secondary-S-90 px-6 py-2 sm:px-8 sm:py-3 rounded-md text-base sm:text-lg md:text-xl text-white hover:shadow-md hover:shadow-black/30 hover:bg-secondary-S-80 active:shadow-none active:bg-secondary-S-40 transition-all backdrop-blur-sm"
          >
            {t('Shop Now')}
          </NavLink>
        </div>
      )}
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
  collection,
}: {
  t: TFunction<'translation', undefined>;
  direction: 'ltr' | 'rtl';
  title: string;
  viewAllLink: string;
  width: number;
  height: number;
  products?: ProductCardFragment[];
  collection?: any;
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
          className="transition-all w-20 h-8 text-base lg:text-lg font-medium flex items-center justify-center text-primary-P-40 hover:no-underline hover:bg-neutral-N-92 active:bg-neutral-N-87"
          to={viewAllLink}
        >
          {t('View All')}
        </Link>
      </div>
      <div className="flex w-fit items-start lg:items-stretch lg:flex-row flex-col gap-3 lg:gap-4 flex-wrap">
        <div className="flex flex-wrap xs:w-90.5 sm:max-w-181 sm:w-auto items-start justify-between gap-3 lg:flex-col sm:gap-4 sm:self-stretch">
          {products.map((product, index) => {
            const fromCollection =
              collection?.products.nodes.filter(
                (p: any) => p.id !== product.id && p.productType === product.productType
              ) ?? [];
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
            const fromCollection =
              collection?.products.nodes.filter(
                (p: any) => p.id !== product.id && p.productType === product.productType
              ) ?? [];
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
    <div className="my-20 lg:my-36 grid grid-cols-2 md:grid-cols-3 gap-4">
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
    <div className="py-20 lg:py-36 max-w-[1280px] mx-auto grid grid-cols-2 md:grid-cols-3 gap-4">
      <NavLink
        to="/collections/men"
        className="group relative overflow-hidden border border-primary-P-40/10 hover:shadow active:shadow-sm transition-colors aspect-square lg:aspect-[4/5] bg-transparent"
        title="Men's Luxury Fashion Dubai - Mario Bologna Luxury Fashion Brands"
        aria-label="Shop Men's Luxury Designer Fashion Collection Dubai"
      >
        <picture>
          {/* Mobile optimization - smaller download but same visual size */}
          <source
            media="(max-width: 639px)"
            srcSet="/images/shops/men.webp?width=360"
            sizes="50vw"
          />
          <source
            media="(min-width: 640px) and (max-width: 1023px)"
            srcSet="/images/shops/men.webp?width=500"
            sizes="33vw"
          />
          <source
            media="(min-width: 1024px)"
            srcSet="/images/shops/men.webp?width=400 400w, /images/shops/men.webp?width=800 800w"
            sizes="(min-width: 1280px) 400px, 33vw"
          />
          <img
            src="/images/shops/men.webp"
            alt="Men's Luxury Fashion Dubai - Designer Suits, Shirts & Accessories at Mario Bologna"
            className="w-full h-full object-cover"
            loading="lazy"
            decoding="async"
          />
        </picture>
        <div className="absolute inset-0 flex items-center justify-center group-hover:bg-black/30 transition-colors">
          <span className="text-white group-hover:text-black text-xl xs:text-3xl sm:text-4xl lg:text-7xl font-rangga text-center leading-tight px-2">
            {t('Shop Men')}
          </span>
        </div>
      </NavLink>
      <NavLink
        to="/collections/women"
        className="group relative overflow-hidden border border-primary-P-40/10 hover:shadow active:shadow-sm transition-colors aspect-square lg:aspect-[4/5] bg-transparent"
        title="Women's Luxury Fashion Dubai - Mario Bologna Luxury Fashion Brands"
        aria-label="Shop Women's Luxury Designer Fashion Collection Dubai"
      >
        <picture>
          {/* Mobile optimization - smaller download but same visual size */}
          <source
            media="(max-width: 639px)"
            srcSet="/images/shops/women.webp?width=360"
            sizes="50vw"
          />
          <source
            media="(min-width: 640px) and (max-width: 1023px)"
            srcSet="/images/shops/women.webp?width=500"
            sizes="33vw"
          />
          <source
            media="(min-width: 1024px)"
            srcSet="/images/shops/women.webp?width=400 400w, /images/shops/women.webp?width=800 800w"
            sizes="(min-width: 1280px) 400px, 33vw"
          />
          <img
            src="/images/shops/women.webp"
            alt="Women's Luxury Fashion Dubai - Designer Dresses, Bags & Shoes at Mario Bologna"
            className="w-full h-full object-cover"
            loading="lazy"
            decoding="async"
          />
        </picture>
        <div className="absolute inset-0 flex items-center justify-center  group-hover:bg-black/30 transition-colors">
          <span className="text-white group-hover:text-black text-xl xs:text-3xl sm:text-4xl lg:text-7xl font-rangga text-center leading-tight px-2">
            {t('Shop Women')}
          </span>
        </div>
      </NavLink>
      <NavLink
        to="/collections/kids"
        className="group relative overflow-hidden border border-primary-P-40/10 hover:shadow active:shadow-sm transition-colors aspect-square lg:aspect-[4/5] bg-transparent"
        title="Kids Luxury Fashion Dubai - Mario Bologna Luxury Fashion Brands"
        aria-label="Shop Kids Luxury Designer Fashion Collection Dubai"
      >
        <picture>
          {/* Mobile optimization - smaller download but same visual size */}
          <source
            media="(max-width: 639px)"
            srcSet="/images/shops/kids.webp?width=360"
            sizes="50vw"
          />
          <source
            media="(min-width: 640px) and (max-width: 1023px)"
            srcSet="/images/shops/kids.webp?width=500"
            sizes="33vw"
          />
          <source
            media="(min-width: 1024px)"
            srcSet="/images/shops/kids.webp?width=400 400w, /images/shops/kids.webp?width=800 800w"
            sizes="(min-width: 1280px) 400px, 33vw"
          />
          <img
            src="/images/shops/kids.webp"
            alt="Kids Luxury Fashion Dubai - Designer Children's Clothing at Mario Bologna"
            className="w-full h-full object-cover"
            loading="lazy"
            decoding="async"
          />
        </picture>
        <div className="absolute inset-0 flex items-center justify-center  group-hover:bg-black/30 transition-colors">
          <span className="text-white group-hover:text-black text-xl xs:text-3xl sm:text-4xl lg:text-7xl font-rangga text-center leading-tight px-2">
            {t('Shop Kids')}
          </span>
        </div>
      </NavLink>
    </div>
  );
}