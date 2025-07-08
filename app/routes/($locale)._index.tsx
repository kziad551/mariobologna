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
    { title: 'Mario Bologna - Luxury Fashion Brands in Dubai' },
    { name: 'description', content: 'Mario Bologna Dubai offers luxury fashion brands, designer clothes &amp; accessories for men, women &amp; kids. Premium Italian fashion with fast UAE delivery.' },
    { name: 'keywords', content: 'Mario Bologna luxury fashion brands Dubai, luxury fashion brands Dubai, premium fashion Dubai, Italian luxury fashion brands, designer clothes Dubai, luxury fashion Dubai, high-end fashion brands Dubai, luxury shopping Dubai, Mario Bologna Dubai, premium fashion brands Dubai, luxury fashion store Dubai, designer fashion brands Dubai, upscale fashion Dubai, luxury boutique Dubai, Italian designer fashion brands Dubai, exclusive fashion brands Dubai, luxury fashion accessories Dubai, premium designer Dubai, luxury fashion house Dubai, elite fashion brands Dubai' },
    { property: 'og:title', content: 'Mario Bologna - Luxury Fashion Brands in Dubai | Premium Fashion & Accessories' },
    { property: 'og:description', content: 'Mario Bologna - Luxury Fashion Brands in Dubai features exclusive Italian designer collections. Premium fashion & accessories for discerning customers across UAE & Saudi Arabia.' },
    { property: 'og:type', content: 'website' },
    { property: 'og:site_name', content: 'Mario Bologna - Luxury Fashion Brands in Dubai' },
    { property: 'og:locale', content: 'en_US' },
    { property: 'og:image', content: '/images/mario-bologna-luxury-brands-dubai.jpg' },
    { property: 'og:image:width', content: '1200' },
    { property: 'og:image:height', content: '630' },
    { property: 'og:url', content: 'https://mariobologna.com' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: 'Mario Bologna - Luxury Fashion Brands in Dubai | Premium Fashion' },
    { name: 'twitter:description', content: 'Mario Bologna - Luxury Fashion Brands in Dubai. Premium Italian fashion collections with fast UAE delivery.' },
    { name: 'twitter:image', content: '/images/mario-bologna-luxury-brands-dubai.jpg' },
    { name: 'robots', content: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1' },
    { name: 'author', content: 'Mario Bologna - Luxury Fashion Brands in Dubai' },
    { name: 'publisher', content: 'Mario Bologna - Luxury Fashion Brands in Dubai' },
    { name: 'geo.region', content: 'AE-DU' },
    { name: 'geo.placename', content: 'Dubai' },
    { name: 'geo.position', content: '25.2048;55.2708' },
    { name: 'ICBM', content: '25.2048, 55.2708' },
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

  const newHeroHandle = 'new-hero-section-bxxwyyls';
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
          <h1>Mario Bologna - Luxury Fashion Brands in Dubai | Premium Fashion Destination UAE</h1>
          <h2>Dubai's Premier Luxury Brands Experience - Summer 2025</h2>
          <p>
            <a href="/aboutus" title="About Mario Bologna - Luxury Fashion Brands in Dubai">About Mario Bologna - Luxury Fashion Brands in Dubai</a> Welcome to Mario Bologna - Luxury Fashion Brands in Dubai, where the world's most prestigious 
            luxury brands meet Dubai's sophisticated fashion scene. Step into Summer 2025 with our exclusive luxury brands collection, featuring the finest <a href="https://www.vogue.com/article/italian-fashion-designers" target="_blank" rel="noopener noreferrer" title="Italian Fashion Designers - Vogue">Italian designers</a> and international luxury brands.
            Mario Bologna - Luxury Fashion Brands in Dubai offers an unparalleled selection of luxury brands for discerning customers who appreciate the finest things in life.
            Explore our curated luxury brands collections for <a href="/collections/women" title="Women's Luxury Fashion Dubai">women</a>, <a href="/collections/men" title="Men's Designer Fashion Dubai">men</a>, and <a href="/collections/kids" title="Kids Luxury Clothing Dubai">kids</a>, designed for Dubai's vibrant lifestyle and refined taste.
            Premium fabrics, exquisite craftsmanship, and exclusive luxury brands define our summer collection.
            Fast delivery of luxury brands across <a href="https://www.visitdubai.com/" target="_blank" rel="noopener noreferrer" title="Visit Dubai Official Website">Dubai</a>, Abu Dhabi, Riyadh, and the entire GCC region.
            Discover our prestigious luxury brands portfolio including <a href="https://www.baldinini.it/" target="_blank" rel="noopener noreferrer" title="Baldinini Official Website">Baldinini</a>, <a href="https://www.peserico.it/" target="_blank" rel="noopener noreferrer" title="Peserico Official Website">Peserico</a>, <a href="https://www.cromia.it/" target="_blank" rel="noopener noreferrer" title="Cromia Official Website">Cromia</a>, Jijil, Mario Cerutti, Claudia Rossi and many more exclusive luxury brands! 
            From designer high heels to comfortable luxury footwear, Mario Bologna - Luxury Fashion Brands in Dubai has the most coveted luxury brands collection for you.
            <a href="/new-arrivals" title="New Arrivals - Mario Bologna Dubai">Shop luxury brands</a>. Experience excellence. Own the finest.
          </p>
          <p>
            SEO Keywords: Mario Bologna luxury fashion brands Dubai, luxury fashion brands Dubai, premium luxury brands UAE, designer luxury brands Dubai, 
            high-end luxury brands Dubai, exclusive luxury brands Dubai, Italian luxury brands Dubai, luxury brands store Dubai, 
            luxury brands shopping Dubai, premium fashion brands Dubai, elite luxury brands UAE, luxury brands boutique Dubai
          </p>
        </section>

        <section>
          <h2>New Arrivals Section - Mario Bologna Luxury Fashion Brands in Dubai</h2>
          <h3>Just In: Summer Icons You'll Love from Luxury Fashion Brands in Dubai</h3>
          <p>
            Discover fresh drops from top <a href="https://www.fashionhistory.it/" target="_blank" rel="noopener noreferrer" title="European Fashion History">European designers</a>, curated for the modern Middle East
            lifestyle at Mario Bologna - Luxury Fashion Brands in Dubai.
            From statement <a href="/collections/evening-wear" title="Evening Wear Collection Dubai">eveningwear</a> to effortlessly chic <a href="/collections/casual" title="Casual Luxury Fashion Dubai">day looks</a>, our new arrivals embody
            refinement, versatility, and global sophistication.
            Perfect for <a href="https://whatson.ae/dubai/" target="_blank" rel="noopener noreferrer" title="Dubai Events - What's On">Dubai events</a>, business meetings, luxury travel, or simply showing up in style.
            Enjoy fast and secure delivery across the <a href="https://u.ae/" target="_blank" rel="noopener noreferrer" title="UAE Official Portal">UAE</a>, <a href="https://www.my.gov.sa/" target="_blank" rel="noopener noreferrer" title="Saudi Arabia Official Portal">KSA</a>, and Gulf countries.
            Visit our <a href="/stores" title="Mario Bologna Store Locations Dubai">Dubai showroom</a> or shop online for the finest luxury brands in Dubai.
          </p>
          <p>
            SEO Keywords: Mario Bologna luxury fashion brands in Dubai, new luxury arrivals Dubai, summer 2025 fashion Dubai, designer clothes UAE, shop
            new in women men kids Dubai, latest trends GCC, luxury brands Dubai new arrivals.
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
          <h2>ماريو بولونيا - الماركات الفاخرة في دبي | وجهة الأزياء الراقية الإمارات</h2>
          <p>
            مرحباً بك في ماريو بولونيا - الماركات الفاخرة في دبي، وجهتك الأولى للماركات الفاخرة وأحدث صيحات الأزياء الراقية في دبي والخليج.
            ماريو بولونيا - الماركات الفاخرة في دبي تقدم مجموعة حصرية من أرقى الماركات الفاخرة العالمية والإيطالية المرموقة.
            اكتشف تشكيلات الماركات الفاخرة لصيف 2025 المميّزة من ماريو بولونيا - الماركات الفاخرة في دبي:
            الماركات الفاخرة للفساتين الصيفية الراقية، الماركات الفاخرة للبدلات الرجالية الكلاسيكية، الماركات الفاخرة لملابس الأطفال الأنيقة.
            ماريو بولونيا - الماركات الفاخرة في دبي تجمع أفضل الماركات الفاخرة العالمية في مكان واحد.
            مستوحاة من أناقة دبي، صمّمت تشكيلات الماركات الفاخرة لدينا لتجمع بين الستايل الأوروبي الراقي والذوق الخليجي الفاخر.
            توصيل سريع للماركات الفاخرة إلى دبي، أبوظبي، الرياض، وجدة خلال أيام.
            تسوق الماركات الفاخرة آمن وسهل عبر الإنترنت من ماريو بولونيا - الماركات الفاخرة في دبي.
            الكمية محدودة من الماركات الفاخرة… لا تفوّت فرصتك.
            ابدأ تسوق الماركات الفاخرة الآن وتميّز بإطلالة لا تُنسى من أرقى الماركات الفاخرة في دبي.
          </p>
          <p>
            كلمات البحث: ماريو بولونيا الماركات الفاخرة دبي، الماركات الفاخرة دبي، الماركات الفاخرة الإمارات، 
            محل الماركات الفاخرة دبي، تسوق الماركات الفاخرة دبي، أفضل الماركات الفاخرة دبي، 
            الماركات الفاخرة الإيطالية دبي، متجر الماركات الفاخرة الإمارات، الماركات الفاخرة الراقية دبي
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
    
    // console.log('Final URLs for language:', language);
    // console.log('Desktop URL:', desktopUrl);
    // console.log('Tablet URL:', tabletUrl);
    // console.log('Mobile URL:', mobileUrl);
    
    if (desktopUrl) setDesktopImage(desktopUrl);
    if (tabletUrl) setTabletImage(tabletUrl);
    if (mobileUrl) setMobileImage(mobileUrl);
  }, [metaobject, language]);

  return (
    <div className="relative w-full">
      {/* Mobile Image - visible only on mobile screens */}
      {mobileImage && (
        <img
          src={mobileImage}
          alt="Mario Bologna - Luxury Fashion Brands in Dubai | Premium Italian Fashion Collections Summer 2025"
          className="w-full h-full object-cover block sm:hidden"
          loading="eager"
          width="414"
          height="500"
        />
      )}
      
      {/* Tablet Image - visible only on tablet screens */}
      {tabletImage && (
        <img
          src={tabletImage}
          alt="Mario Bologna - Luxury Fashion Brands in Dubai | Premium Italian Fashion Collections Summer 2025"
          className="w-full h-full object-cover hidden sm:block lg:hidden"
          loading="eager"
          width="768"
          height="600"
        />
      )}
      
      {/* Desktop Image - visible only on desktop screens */}
      {desktopImage && (
        <img
          src={desktopImage}
          alt="Mario Bologna - Luxury Fashion Brands in Dubai | Premium Italian Fashion Collections Summer 2025"
          className="w-full h-full object-cover hidden lg:block"
          loading="eager"
          width="1920"
          height="1080"
        />
      )}
      
      {/* Fallback if no images are loaded */}
      {!desktopImage && !tabletImage && !mobileImage && (
        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
          <p>Loading Mario Bologna luxury fashion brands hero image...</p>
        </div>
      )}
      
      {/* Overlay gradient for better text readability - only on desktop */}
      <div className="absolute inset-0 bg-transparent lg:bg-black/10"></div>
      
      <div className="absolute bottom-8 left-0 right-0 flex justify-center pb-8">
        <NavLink
          to="/#products_section"
          className="bg-secondary-S-90 px-8 py-3 rounded-md text-lg md:text-xl text-white hover:shadow-md hover:shadow-black/30 hover:bg-secondary-S-80 active:shadow-none active:bg-secondary-S-40 transition-all backdrop-blur-sm"
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
        title="Men's Luxury Fashion Dubai - Mario Bologna Luxury Fashion Brands"
        aria-label="Shop Men's Luxury Designer Fashion Collection Dubai"
      >
        <div className="text-white group-hover:text-black text-xl xs:text-3xl sm:text-4xl lg:text-7xl flex flex-col items-center justify-center transition-colors px-2">
          <span className="font-rangga text-center leading-tight">{t('Shop Men')}</span>
        </div>
        <img 
          src="/images/shops/men.png" 
          alt="Men's Luxury Fashion Dubai - Designer Suits, Shirts & Accessories at Mario Bologna"
          className="sr-only"
          loading="lazy"
        />
      </NavLink>
      <NavLink
        to="/collections/women"
        className="group relative flex items-center justify-center flex-grow w-full min-h-62 xs:min-h-96 lg:min-h-160 bg-[url('/images/shops/women.png')] bg-cover bg-center bg-no-repeat border border-primary-P-40/10 hover:shadow active:shadow-sm transition-colors"
        title="Women's Luxury Fashion Dubai - Mario Bologna Luxury Fashion Brands"
        aria-label="Shop Women's Luxury Designer Fashion Collection Dubai"
      >
        <div className="text-white group-hover:text-black text-xl xs:text-3xl sm:text-4xl lg:text-7xl flex flex-col items-center justify-center transition-colors px-2">
          <span className="font-rangga text-center leading-tight">{t('Shop Women')}</span>
        </div>
        <img 
          src="/images/shops/women.png" 
          alt="Women's Luxury Fashion Dubai - Designer Dresses, Bags & Shoes at Mario Bologna"
          className="sr-only"
          loading="lazy"
        />
      </NavLink>
      <NavLink
        to="/collections/kids"
        className="group relative flex items-center justify-center flex-grow w-full min-h-62 xs:min-h-96 lg:min-h-160 bg-[url('/images/shops/kids.png')] bg-cover bg-center bg-no-repeat border border-primary-P-40/10 hover:shadow active:shadow-sm transition-colors"
        title="Kids Luxury Fashion Dubai - Mario Bologna Luxury Fashion Brands"
        aria-label="Shop Kids Luxury Designer Fashion Collection Dubai"
      >
        <div className="text-white group-hover:text-black text-xl xs:text-3xl sm:text-4xl lg:text-7xl flex flex-col items-center justify-center transition-colors px-2">
          <span className="font-rangga text-center leading-tight">{t('Shop Kids')}</span>
        </div>
        <img 
          src="/images/shops/kids.png" 
          alt="Kids Luxury Fashion Dubai - Designer Children's Clothing at Mario Bologna"
          className="sr-only"
          loading="lazy"
        />
      </NavLink>
    </div>
  );
}