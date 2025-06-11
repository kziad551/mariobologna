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
    { title: 'Mario Bologna - House of Brands | Luxury Fashion & Accessories' },
    { name: 'description', content: 'Shop premium fashion for men, women & kids at Mario Bologna. Discover luxury brands, new arrivals & discounts. Worldwide shipping available.' },
    { name: 'keywords', content: 'Mario Bologna, luxury fashion, House of Brands ,luxury Fashion & Accessories , designer clothes, men fashion, women fashion, kids fashion, online shopping' },
    { property: 'og:title', content: 'Mario Bologna - House of Brands | Luxury Fashion & Accessories' },
    { property: 'og:description', content: 'Discover premium fashion collections for men, women, and kids at Mario Bologna. Shop luxury brands, new arrivals, and seasonal discounts with international shipping.' },
    { property: 'og:type', content: 'website' },
    { property: 'og:site_name', content: 'Mario Bologna' },
    { property: 'og:locale', content: 'en_US' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: 'Mario Bologna - House of Brands | Luxury Fashion & Accessories' },
    { name: 'twitter:description', content: 'Discover premium fashion collections for men, women, and kids at Mario Bologna.' },
    { name: 'robots', content: 'index, follow' },
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
      variables: {country, handle: 'new-arrivals', first: 5},
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

  const newHeroHandle = 'new-hero-section-rpt8eg0p';
  const newHeroType = 'new_hero_section';
  const {metaobject} = await context.storefront.query(
    METAOBJECT_CONTENT_QUERY,
    {
      variables: {
        country,
        handle: newHeroHandle,
        type: newHeroType,
      },
    },
  );

  // Debug log to check the metaobject response
  console.log('Metaobject response:', JSON.stringify(metaobject, null, 2));

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
      <div style={{display: 'none'}}>
        <section>
          <h1>Mario Bologna - Italian Fashion Designer</h1>
          <h2>New Season, Summer 2025</h2>
          <p>
            <a href="/aboutus">About us</a> Step into Summer 2025 with Mario Bologna House of Brands, latest arrivals – where Italian
            luxury meets Dubai and Gulf elegance.
            Explore exclusive collections for women, men, and kids, designed for Dubai's vibrant days and
            refined nights.
            Lightweight silks, airy linens, bold silhouettes.
            Fast delivery across Dubai, Riyadh, and the GCC.
            Check out our luxury brands like Baldinini, Peserico, Cromia, Jijil, Mario Cerutti, Claudia Rossi
            and more! From high heels to comfortable, stylish ballerinas, Mario Bologna House of Brands
            has the most stylish summer collection for you.
            Shop the look. Own the season.
          </p>
          <p>
            SEO Keywords: luxury fashion Dubai, summer collection 2025, designer clothing UAE, fast
            delivery Dubai, high-end fashion online GCC
          </p>
        </section>

        <section>
          <h2>New Arrivals Section</h2>
          <h3>Just In: Summer Icons You'll Love</h3>
          <p>
            Discover fresh drops from top European designers, curated for the modern Middle East
            lifestyle.
            From statement eveningwear to effortlessly chic day looks, our new arrivals embody
            refinement, versatility, and global sophistication.
            Perfect for events, meetings, travel, or simply showing up in style.
            Enjoy fast and secure delivery across the UAE, KSA, and Gulf countries.
          </p>
          <p>
            SEO Keyword: new luxury arrivals Dubai, summer 2025 fashion, designer clothes UAE, shop
            new in women men kids, latest trends GCC.
          </p>
        </section>

        <section>
          <h2>Shop Women's Collection</h2>
          <h3>Luxury Looks for the Elegant Woman</h3>
          <p>
            Explore our Summer 2025 Women's Collection – designed for women who dress with passion.
            From flowing maxi dresses and kaftans to sharp tailoring and luxe essentials, every piece is
            made to impress.
            Inspired by Dubai's high fashion scene & Saudi elegance.
            Order now for fast delivery to your doorstep.
          </p>
          <p>
            SEO Keywords: women's luxury fashion UAE, summer dresses Dubai, Italian designer women's
            wear, high-end abayas, fast shipping Saudi Arabia
          </p>
        </section>

        <section>
          <h2>Shop Men's Collection</h2>
          <h3>Luxury Style for Every Occasion</h3>
          <p>
            Upgrade your wardrobe with House of Brands Mario Bologna's Summer 2025 Men's Edit, a
            refined blend of lightweight tailoring, soft cotton shirts, classic shoes, sneakers, and timeless
            silhouettes.
            Ideal for DIFC boardrooms, sunset dinners in Jeddah, and effortless elegance at every turn.
            Express delivery available in Dubai, Riyadh & more.
          </p>
          <p>
            SEO Keywords: men's luxury fashion Dubai, summer shirts UAE, classy outfits for men, linen
            suits Gulf, designer menswear Saudi Arabia, designer clothes
          </p>
        </section>

        <section>
          <h2>Shop Kids' Collection</h2>
          <h3>Stylish Little Looks for Big Summer Moments</h3>
          <p>
            Let your kids shine with House of Brands Mario Bologna's premium children's collection,
            designed for comfort, movement, and celebration.
            Shop adorable Eid outfits, stylish sets, and breathable fabrics perfect for hot climates.
            Fast delivery across Dubai and the GCC, get ready in time for the holidays!
          </p>
          <p>
            SEO Keywords: luxury kids fashion UAE, Eid outfits children Dubai, stylish boys & girls clothes
            GCC, designer kidswear online, kids clothing fast shipping Dubai
          </p>
        </section>

        {/* Arabic SEO Content */}
        <section lang="ar" dir="rtl">
          <h2>ماريو بولونيا - بيت الماركات الفاخرة | أزياء وإكسسوارات راقية</h2>
          <p>
            مرحباً بك في Mario Bologna House of Brands، وجهتك الأولى لأحدث صيحات الأزياء الإيطالية الفاخرة في دبي
            والخليج.
            اكتشف تشكيلات صيف 2025 المميّزة:
            فساتين صيفية راقية، بدلات رجالية كلاسيكية بلمسة عصرية، ملابس أطفال أنيقة تناسب أجواء العيد والمناسبات.
            مستوحاة من أناقة دبي، صمّمت تشكيلاتنا لتجمع بين الستايل الأوروبي الإيطالي العصري والذوق الخليجي الفاخر، مثالية
            للسفر، المناسبات، والعطلات الصيفية.
            توصيل سريع إلى دبي، أبوظبي، الرياض، وجدة خلال أيام.
            تسوق آمن وسهل عبر الإنترنت.
            الكمية محدودة… لا تفوّت فرصتك.
            ابدأ التسوق الآن وتميّز بإطلالة لا تُنسى هذا الصيف.
          </p>
          <p>
            كلمات البحث: أزياء فاخرة دبي، مجموعة صيف 2025، ملابس مصممة الإمارات، توصيل سريع دبي، 
            أزياء راقية أونلاين الخليج، ماريو بولونيا، أزياء إيطالية فاخرة
          </p>
        </section>

        <section lang="ar" dir="rtl">
          <h2>قسم النساء – صيف 2025</h2>
          <h3>إطلالات فاخرة للمرأة الأنيقة</h3>
          <p>
            هذا صيفك، وهذه لحظتك! اكتشفي تشكيلتنا الفاخرة للمرأة العصرية من ماريو بولونيا. 
            فساتين خفيفة وأنيقة، عبايات وكافتانات بلمسة أوروبية، وتنانير تعكس نعومة القطن وأناقة القصّات الإيطالية.
            اختاري تصاميم مميزة للسهرات أو للنهار، واحصلي على ستايل راقٍ يلفت الأنظار ويترك انطباع لا ينتسى.
            تسوقي إطلالاتك القادمة مثل النجمات بتصاميم تلائم رقيّ دبي وسحر أناقة المرأة السعودية.
            الأناقة هنا ليست خيارًا، بل أسلوب حياة.
            ماريو بولونيا... حيث الموضة تلتقي مع الذوق الخليجي الفاخر.
            اطلبي الآن، واستمتعي بخدمة توصيل سريع داخل دبي والإمارات والسعودية.
          </p>
          <p>
            كلمات البحث: فساتين صيف فخمة، عبايات ستايل، أزياء نسائية فاخرة، ماركات راقية في الإمارات،
            أزياء نسائية دبي، لوك خليجي راقٍ، عبايات عصرية، فساتين فاخرة الإمارات
          </p>
        </section>

        <section lang="ar" dir="rtl">
          <h2>قسم الرجال – صيف 2025</h2>
          <h3>ستايل فاخر لكل مناسبة</h3>
          <p>
            لأنك تحسن الإختيار، قدّمنا لك تشكيلة راقية رجال صيف 2025 من ماريو بولونيا. 
            القماش كتان ناعم وقُطن. الألوان بيج رملي وأبيض صيفي وأزرق ناعم. 
            الموديلات تتألف من القمصان الكاجوال للبدلات الرسمية الخفيفة.
            كن واجهة الأناقة الخليجية حيث تصاميمك تتحدث عنك سواء كنت في دبي مول أو في أحد مقاهي الرياض الراقية.
            ستايل أنيق، عصري، ويعكس حضورك القوي. مثالي لأجواء العمل، ولا يُضاهى في المناسبات.
            وللباحثين عن الإطلالة الكلاسيكية الراقية، ستجد قطعًا مثالية للاجتماعات في مركز دبي المالي العالمي DIFC، 
            أو للعشاء الفاخر في فندق الريتز بالرياض.
            بدلات وقمصان وقصّات أنيقة تظهر ثقتك، وتُحاكي ذوقك النخبوي.
            اطلب الآن وتمتّع بـ شحن سريع داخل دبي والإمارات والسعودية، لأن الإطلالة الكاملة تبدأ من الراحة في التجربة.
          </p>
          <p>
            كلمات البحث: ملابس رجال دبي، ماركات فاخرة في سعودية، قميص كتان صيفي، بدلة خفيفة للحر، 
            توصيل سريع السعودية، توصيل سريع دبي، أزياء رجالية فاخرة الخليج
          </p>
        </section>

        <section lang="ar" dir="rtl">
          <h2>قسم الأطفال – صيف 2025</h2>
          <h3>إطلالات أنيقة للحظات الصيفية الجميلة</h3>
          <p>
            إطلبي اليوم واستلمي الطلب بتوصيل سريع في دبي خلال أيام قليلة. نوفر لكِ تجربة تسوق راقية وسريعة بدون تعب.
            العيد فرحة… خلّي إطلالة أطفالك تكتمل مع Mario Bologna.
            لصيف ونشاطات أجمل مع ماريو بولونيا. تشكيلات راقية للبنات والأولاد، بأقمشة ناعمة لا تسبّب حساسية ولا تقيد الحركة.
            ملابس أطفال بتصاميم راقية توائم ذوق العائلات الخليجية – لأن التميّز يبدأ من الصغر.
            من حفلات الأعياد في دبي والإمارات وجدة والرياض إلى عطلات التسوّق في دبي مول، طفلك سيكون دائمًا أنيق.
            كل تفصيلة مدروسة، من الأزرار للألوان، لتليق بأهم ضيوف هذا الصيف: أطفالك.
          </p>
          <p>
            كلمات البحث: ملابس أطفال فخمة، ملابس صيفية بنات أولاد، أزياء أطفال دبي، موضة سعودية صيفية،
            أزياء العيد للأطفال، ملابس أطفال راقية دبي، فساتين بنات العيد، توصيل سريع دبي، ملابس أولاد فخمة
          </p>
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
  const [imageSrc, setImageSrc] = useState<string>('');

  useEffect(() => {
    // Log the entire metaobject for debugging
    console.log('Full metaobject:', metaobject);
    
    // Find the image field
    const imageField = metaobject?.fields?.find(
      (field) => field.key === 'image'
    );
    console.log('Image field:', imageField);
    
    // Try to get the image URL from different possible locations
    let imageUrl: string | undefined = imageField?.reference?.image?.url;
    
    if (!imageUrl && imageField?.references?.nodes?.[0]?.image?.url) {
      imageUrl = imageField.references.nodes[0].image.url;
    }
    
    if (!imageUrl && imageField?.value) {
      try {
        const valueData = JSON.parse(imageField.value) as { url?: string; src?: string };
        imageUrl = valueData?.url || valueData?.src || undefined;
      } catch (e) {
        console.log('Failed to parse image field value:', e);
      }
    }
    
    console.log('Final image URL:', imageUrl);
    
    if (imageUrl) {
      setImageSrc(imageUrl);
    }
  }, [metaobject]);

  return (
    <div className="relative w-full h-[60vh] lg:h-[calc(100vh-80px)]">
      {imageSrc ? (
        <img
          src={imageSrc}
          alt="Hero"
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
          <p>Loading hero image...</p>
        </div>
      )}
      <div className="absolute bottom-0 left-0 right-0 flex justify-center pb-8">
        <NavLink
          to="/#products_section"
          className="bg-secondary-S-90 px-6 py-2.5 rounded-md text-sm md:text-xl text-white hover:shadow-md hover:shadow-black/30 hover:bg-secondary-S-80 active:shadow-none active:bg-secondary-S-40 transition-all"
        >
          {t('Shop Now')}
        </NavLink>
      </div>
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
        className="group relative flex items-center justify-center flex-grow w-full min-h-62 xs:min-h-96 lg:min-h-160 bg-[url('/images/shops/men.png')] bg-cover bg-center bg-no-repeat border border-primary-P-40/10 hover:shadow active:shadow-sm transition-colors"
      >
        <div className="text-white group-hover:text-black text-xl xs:text-3xl sm:text-4xl lg:text-7xl flex flex-col items-center justify-center transition-colors px-2">
          <span className="font-rangga text-center leading-tight">{t('Shop Men')}</span>
        </div>
      </NavLink>
      <NavLink
        to="/collections/women"
        className="group relative flex items-center justify-center flex-grow w-full min-h-62 xs:min-h-96 lg:min-h-160 bg-[url('/images/shops/women.png')] bg-cover bg-center bg-no-repeat border border-primary-P-40/10 hover:shadow active:shadow-sm transition-colors"
      >
        <div className="text-white group-hover:text-black text-xl xs:text-3xl sm:text-4xl lg:text-7xl flex flex-col items-center justify-center transition-colors px-2">
          <span className="font-rangga text-center leading-tight">{t('Shop Women')}</span>
        </div>
      </NavLink>
      <NavLink
        to="/collections/kids"
        className="group relative flex items-center justify-center flex-grow w-full min-h-62 xs:min-h-96 lg:min-h-160 bg-[url('/images/shops/kids.png')] bg-cover bg-center bg-no-repeat border border-primary-P-40/10 hover:shadow active:shadow-sm transition-colors"
      >
        <div className="text-white group-hover:text-black text-xl xs:text-3xl sm:text-4xl lg:text-7xl flex flex-col items-center justify-center transition-colors px-2">
          <span className="font-rangga text-center leading-tight">{t('Shop Kids')}</span>
        </div>
      </NavLink>
    </div>
  );
}
