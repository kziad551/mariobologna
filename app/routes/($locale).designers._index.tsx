import {defer, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {useLoaderData, type MetaFunction, NavLink} from '@remix-run/react';
import {useEffect, useState} from 'react';
import useWindowDimensions from '~/hooks/useWindowDimensions';
import {useCustomContext} from '~/contexts/App';
import {GoSearch} from 'react-icons/go';
import {useTranslation} from 'react-i18next';
import {useInView} from 'react-intersection-observer';
import {TFunction} from 'i18next';

export const meta: MetaFunction = () => {
  const metaDescription = "Discover premium designer brands including Baldinini, Parah, Claudia Rossi, and more. Shop luxury fashion from top Italian and international designers.";
  
  return [
    {title: 'Designers | Mario Bologna'},
    {name: 'description', content: metaDescription},
    // Open Graph tags for social sharing
    {property: 'og:title', content: 'Designers | Mario Bologna'},
    {property: 'og:description', content: metaDescription},
    {property: 'og:type', content: 'website'},
    {property: 'og:url', content: 'https://mariobologna.com/designers'},
    // Twitter Card tags
    {name: 'twitter:card', content: 'summary_large_image'},
    {name: 'twitter:title', content: 'Designers | Mario Bologna'},
    {name: 'twitter:description', content: metaDescription}
  ];
};

export async function loader({context}: LoaderFunctionArgs) {
  const {storefront} = context;
  return defer({});
}

type DesignerType = {
  imgSrc: string;
  imgLogo?: string;
  title: string;
  link: string;
  bgColor: string;
  isFull?: boolean;
};

const designerList: DesignerType[] = [
  
  {
    imgSrc: 'Baldinini.jpg',
    imgLogo: 'baldinini.png',
    link: '/products?designer=baldinini',
    title: 'Baldinini',
    bgColor: 'bg-white/10',
    // isFull: true,
  },
  {
    imgSrc: 'LoveMoschino.WEBP',       
    imgLogo: 'love-moschino.png',     
    link: '/products?designer=love+moschino',
    title: 'Love Moschino',
    bgColor: 'bg-black/10',
  },
  {
    imgSrc: 'Claudia Rossi.png',
    imgLogo: 'claudia_rossi.png',
    link: '/products?designer=claudia+rossi',
    title: 'Claudia Rossi',
    bgColor: 'bg-black/10',
    // isFull: true,
  },
  {
    imgSrc: 'SV Salvi Calzados.png',
    imgLogo: 'salvi.png',
    link: '/products?designer=salvi',
    title: 'SV Salvi Calzados',
    bgColor: 'bg-black/10',
    // isFull: true,
  },
  {
    imgSrc: 'Cromia.jpg',
    imgLogo: 'cromia.png',
    link: '/products?designer=cromia',
    title: 'Cromia',
    bgColor: 'bg-black/10',
    // isFull: true,
  },
  {
    imgSrc: 'Ermanno Scervino.png',
    imgLogo: 'ermanno-scervino.png',
    link: '/products?designer=ermanno+scervino',
    title: 'Ermanno Scervino',
    bgColor: 'bg-black/10',
    // isFull: true,
  },
  {
    imgSrc: 'Byblos.png',
    imgLogo: 'ByByblos.png',
    link: '/products?designer=byblos',
    title: 'By Byblos',
    bgColor: 'bg-black/10',
    // isFull: true,
  },
  {
    imgSrc: 'plein_sport-2.png',
    imgLogo: 'plein_sport.svg',
    link: '/products?designer=plein+sport',
    title: 'Plein Sport',
    bgColor: 'bg-black/10',
    // isFull: true,
  },
  {
    imgSrc: 'KANNA.png',
    imgLogo: 'KANNA.png',
    link: '/products?designer=kanna',
    title: 'KANNA',
    bgColor: 'bg-black/10',
    // isFull: true,
  },
  {
    imgSrc: 'Roberto Festa.png',
    imgLogo: 'roberto-festa.png',
    link: '/products?designer=roberto+festa',
    title: 'Roberto Festa',
    bgColor: 'bg-black/10',
    // isFull: true,
  },
  {
    imgSrc: 'Jijil.jpg',
    imgLogo: 'JIJIL.png',
    link: '/products?designer=jijil',
    title: 'Jijil',
    bgColor: 'bg-black/10',
    // isFull: true,
  },
  {
    imgSrc: 'SAY.png',
    imgLogo: 'SAY.png',
    link: '/products?designer=say',
    title: 'Say',
    bgColor: 'bg-black/10',
    // isFull: true,
  },
  {
    imgSrc: 'Cesare Casadei.png',
    imgLogo: 'casadei.png',
    link: '/products?designer=cesare+casadei',
    title: 'Cesare Casadei',
    bgColor: 'bg-black/10',
    // isFull: true,
  },
  {
    imgSrc: 'Pollini.jpeg',
    imgLogo: 'pollini.svg',
    link: '/products?designer=pollini',
    title: 'Pollini',
    bgColor: 'bg-white/10',
    // isFull: true,
  },
  {
    imgSrc: 'Peserico.png',
    imgLogo: 'Peserico.png',
    link: '/products?designer=peserico',
    title: 'Peserico',
    bgColor: 'bg-white/10',
    // isFull: true,
  },
  {
    imgSrc: '120 Lino.png',
    imgLogo: '120_lino-2.png',
    link: '/products?designer=120%25+lino',
    title: '120% Lino',
    bgColor: 'bg-black/10',
    // isFull: true,
  },
  {
    imgSrc: 'mario_cerutti.png',
    imgLogo: 'mario_cerutti-2.png',
    link: '/products?designer=mario+cerutti',
    title: 'Mario Cerutti',
    bgColor: 'bg-black/10',
  },
  {
    imgSrc: 'Hinnominate1.webp',
    imgLogo: 'HINNOMINATE.png',
    link: '/products?designer=hinnominate',
    title: 'Hinnominate',
    bgColor: 'bg-white/10',
    // isFull: true,
  },
];

export default function Designers() {
  const {t} = useTranslation();
  const {setCurrentPage, direction, language} = useCustomContext();
  const {height, width} = useWindowDimensions(50);
  const data = useLoaderData<typeof loader>();
  const {ref, inView} = useInView();

  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    let lastScrollTop = 0;
    const onScroll = () => {
      const scrollTop = document.documentElement.scrollTop;
      if (scrollTop > lastScrollTop) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    };

    window.addEventListener('scroll', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  useEffect(() => {
    setCurrentPage('Designers');
  }, []);
  return (
    <div className="designers">
      <div className="relative flex flex-wrap items-stretch justify-start">
        <NavLink
          to="/search"
          ref={ref}
          style={{
            transform: isVisible
              ? 'translateY(0)'
              : width < 1024
                ? 'translateY(-64px)'
                : 'translateY(-183px)',
          }}
          className={`${direction === 'ltr' ? 'left-4.5 lg:left-8' : 'right-4.5 lg:right-8'} z-10 bg-secondary-S-90 rounded shadow text-white p-2 lg:p-4 fixed top-19 lg:top-53.75 transition-all duration-500`}
        >
          <GoSearch className="w-4 h-4 lg:w-6 lg:h-6" />
        </NavLink>
        {designerList.map((designer) => (
          <DesignerSection
            key={designer.title}
            imgSrc={designer.imgSrc}
            imgLogo={designer.imgLogo}
            designerLink={designer.link}
            designerTitle={designer.title}
            bgColor={designer.bgColor}
            isFull={designer.isFull}
            t={t}
          />
        ))}
      </div>

      {/* Hidden SEO Content - Visible to search engines only */}
      <div style={{display: 'none'}} className="seo-content">
        <h1>New Season, Summer 2025 - Mario Bologna House of Brands</h1>
        <p>Step into Summer 2025 with <a href="/">Mario Bologna House of Brands</a>, latest arrivals – where Italian luxury meets Dubai and Gulf elegance. Explore exclusive collections for <a href="/collections/women">women</a>, <a href="/collections/men">men</a>, and <a href="/collections/kids">kids</a>, designed for Dubai's vibrant days and refined nights.</p>
        <p>Lightweight silks, airy linens, bold silhouettes. Fast delivery across Dubai, Riyadh, and the GCC.</p>
        <p>Check out our luxury brands like <a href="/products?designer=baldinini">Baldinini</a>, <a href="/products?designer=peserico">Peserico</a>, <a href="/products?designer=cromia">Cromia</a>, <a href="/products?designer=jijil">Jijil</a>, <a href="/products?designer=mario+cerutti">Mario Cerutti</a>, <a href="/products?designer=claudia+rossi">Claudia Rossi</a> and more! From high heels to comfortable, stylish ballerinas, Mario Bologna House of Brands has the most stylish summer collection for you.</p>
        <p>Shop the look. Own the season.</p>
        <p><strong>SEO Keywords:</strong> luxury fashion Dubai, summer collection 2025, designer clothing UAE, fast delivery Dubai, high-end fashion online GCC</p>

        <h2>New Arrivals Section</h2>
        <h3>Just In: Summer Icons You'll Love</h3>
        <p>Discover fresh drops from top European designers, curated for the modern Middle East lifestyle. From statement eveningwear to effortlessly chic day looks, our <a href="/collections/new-arrivals">new arrivals</a> embody refinement, versatility, and global sophistication.</p>
        <p>Perfect for events, meetings, travel, or simply showing up in style. Enjoy fast and secure delivery across the UAE, KSA, and Gulf countries.</p>
        <p><strong>SEO Keywords:</strong> new luxury arrivals Dubai, summer 2025 fashion, designer clothes UAE, shop new in women men kids, latest trends GCC</p>

        <h2>Shop Women's Collection</h2>
        <h3>Luxury Looks for the Elegant Woman</h3>
        <p>Explore our <a href="/collections/women">Summer 2025 Women's Collection</a> – designed for women who dress with passion. From flowing maxi dresses and kaftans to sharp tailoring and luxe essentials, every piece is made to impress.</p>
        <p>Inspired by Dubai's high fashion scene & Saudi elegance. Order now for fast delivery to your doorstep.</p>
        <p><strong>SEO Keywords:</strong> women's luxury fashion UAE, summer dresses Dubai, Italian designer women's wear, high-end abayas, fast shipping Saudi Arabia</p>

        <h2>Shop Men's Collection</h2>
        <h3>Luxury Style for Every Occasion</h3>
        <p>Upgrade your wardrobe with <a href="/collections/men">House of Brands Mario Bologna's Summer 2025 Men's Edit</a>, a refined blend of lightweight tailoring, soft cotton shirts, classic shoes, sneakers, and timeless silhouettes.</p>
        <p>Ideal for DIFC boardrooms, sunset dinners in Jeddah, and effortless elegance at every turn. Express delivery available in Dubai, Riyadh & more.</p>
        <p><strong>SEO Keywords:</strong> men's luxury fashion Dubai, summer shirts UAE, classy outfits for men, linen suits Gulf, designer menswear Saudi Arabia, designer clothes</p>

        <h2>Shop Kids' Collection</h2>
        <h3>Stylish Little Looks for Big Summer Moments</h3>
        <p>Let your kids shine with <a href="/collections/kids">House of Brands Mario Bologna's premium children's collection</a>, designed for comfort, movement, and celebration. Shop adorable Eid outfits, stylish sets, and breathable fabrics perfect for hot climates.</p>
        <p>Fast delivery across Dubai and the GCC, get ready in time for the holidays!</p>
        <p><strong>SEO Keywords:</strong> luxury kids fashion UAE, Eid outfits children Dubai, stylish boys & girls clothes GCC, designer kidswear online, kids clothing fast shipping Dubai</p>

        <h2>Designers Page</h2>
        <h3>Discover the Luxury Designers Behind Mario Bologna House of Brands' Signature Style</h3>
        <p>At <a href="/">Mario Bologna – House of Brands</a>, we curate the finest in Italian fashion and global luxury. Each designer in our portfolio brings a unique flair, from modern streetwear to timeless elegance, ensuring our elegant, prestigious clients across Dubai, Abu Dhabi, Riyadh, Jeddah, and the Gulf always find a look that speaks to them.</p>
        <p>Explore the world of our premium brands below:</p>

        <h3>Jijil</h3>
        <p>A contemporary Italian brand for the modern woman, <a href="/products?designer=jijil">Jijil</a> blends bold design with effortless femininity. Known for flowy cuts, eye-catching prints, and seasonal color palettes, it's the go-to choice for women who want to stand out in the Middle East.</p>
        <p><strong>Keywords:</strong> Italian women's fashion Dubai, modern feminine style UAE, Jijil dresses summer, Jijil Abaya</p>

        <h3>Baldinini</h3>
        <p>Crafting luxury footwear since 1910, <a href="/products?designer=baldinini">Baldinini</a> is synonymous with elegance, innovation, and craftsmanship. Expect refined heels, classic ankle boots, and summer platform sandals, luxury trendy purses made for style-conscious women across the Gulf. As for men, expect classic shoes, suede shoes and loafers, semi formal shoes, premium leather wallets, high-end sneakers and loafers perfect for the weather in Dubai.</p>
        <p><strong>Keywords:</strong> Baldinini UAE, Italian luxury shoes Dubai, elegant heels Riyadh, premium brands</p>

        <h3>Cromia</h3>
        <p>Where fashion meets function, <a href="/products?designer=cromia">Cromia</a> creates statement handbags and purses for women who love bold yet classy accessories. Made in Italy with premium leathers and signature metallic hardware.</p>
        <p><strong>Keywords:</strong> Cromia bags Dubai, Cromia bags KSA, Premium Handbags Saudi Arabia Italian leather handbags UAE, luxury women's accessories KSA</p>

        <h3>Mario Cerutti</h3>
        <p>From classic elegance to modern flair, <a href="/products?designer=mario+cerutti">Mario Cerutti</a> is your destination for premium Italian footwear across all ages and occasions. Whether you're shopping for sleek office shoes, elegant evening heels, or comfortable kids' loafers, Mario Cerutti offers luxury that fits.</p>
        
        <h4>For Men</h4>
        <p>Step into sophistication with handcrafted leather shoes, Oxford shoes, Derby Styles, monk straps, leather loafers, ankle boots, brogues, and summer-ready driving shoes. Designed for the Gulf's discerning gentleman — perfect for the boardroom, events, conferences or upscale weekend outings.</p>
        
        <h4>For Women</h4>
        <p>Elegance meets function in our women's selection. Explore stiletto heels, slingbacks, block heels, ballerinas, platform sandals, espadrilles and sneakers, strappy heels, and contemporary mules. Designed with premium Italian leather to elevate every look, from Dubai brunches to Riyadh soirées.</p>
        
        <h4>For Kids</h4>
        <p>Style starts young. Our kids' collection includes soft loafers and stylish kid Na'al perfect for Eid, weddings, or family gatherings. Comfortable, breathable, and crafted with care.</p>
        <p>Available online with fast delivery across Dubai, Abu Dhabi, Riyadh, Kuwait and the entire GCC.</p>

        <h3>Plein Sport</h3>
        <p>From the edgy house of Philipp Plein, <a href="/products?designer=plein+sport">Plein Sport</a> fuses activewear with luxury. Think bold logos, dynamic cuts, colorful sneakers, special edition shoes, and statement pieces perfect for fashion-driven athletes.</p>
        <p><strong>Keywords:</strong> Plein Sport Dubai, designer sportswear UAE, luxury activewear GCC, GenZ</p>

        <h3>Hinnominate</h3>
        <p>Minimal, urban, and ultra-modern: <a href="/products?designer=hinnominate">Hinnominate</a> reflects the street-chic energy of today's youth, for the girls and guys who follow the trendy shoes. Shoulder bags, premium hats, and trendy sneakers, make it a must-have in any casual luxury wardrobe.</p>
        <p><strong>Keywords:</strong> Hinnominate UAE, modern streetwear Dubai, casual fashion Saudi, GenZ</p>

        <h3>SAY</h3>
        <p><a href="/products?designer=say">SAY</a> focuses on expressive fashion with a youthful twist. From printed shirts to trend-driven sets, the brand combines creativity with urban sensibility, designed for confident self-expression. Say has a variety of dresses collection, modest dresses, luxury event dresses and classy jumpsuits.</p>
        <p><strong>Keywords:</strong> SAY clothing Dubai, classy women fashion UAE, bold women's style GCC, Classy brand dresses</p>

        <h3>Claudia Rossi</h3>
        <p>Delicate. Feminine. Timeless. <a href="/products?designer=claudia+rossi">Claudia Rossi</a> offers a collection of beautifully tailored pieces with intricate details, soft palettes, and effortless silhouettes made for summer elegance. Check Claudia Rossi summer sandals and summer collection, with a variety of colorful designs and prints. Shop now elegant sneakers, ballerinas, heel sandals.</p>
        <p><strong>Keywords:</strong> Claudia Rossi Dubai, elegant women's fashion UAE, Italian shoes, heels, and sandals KSA</p>

        <h3>Ermanno Scervino</h3>
        <p>Step into the world of <a href="/products?designer=ermanno+scervino">Ermanno Scervino</a>, where handbags become work of art. Made in Italy with masterful craftsmanship and unmistakable attention to detail, each piece reflects a blend of feminine strength, contemporary design, and timeless sophistication.</p>
        
        <h4>A Style for Every Moment</h4>
        <p>Whether you're heading to a power lunch in DIFC, an occasion in Jeddah, or a weekend brunch in Dubai Marina — Ermanno's bags complete the look.</p>
        <p>Explore an exceptional selection of:</p>
        <ul>
          <li>Structured top-handle bags for refined elegance and classy style</li>
          <li>Crossbody and backpacks for everyday lifestyle and travel ease</li>
          <li>Mini bags & micro purses for bold, fashion-forward statements</li>
          <li>Pouch bags for effortless Gulf chic</li>
          <li>Elegant shoulder bags that transition from day to night</li>
          <li>Tote bags in textured leathers and oversized designs — perfect for work or shopping in the city</li>
          <li>Clutches & evening pouches embellished for gala nights and formal events</li>
        </ul>

        <h3>Roberto Festa</h3>
        <p>Sophisticated yet fashion-forward, <a href="/products?designer=roberto+festa">Roberto Festa's</a> footwear collections feature sculpted heels, rich textures, and bold color choices. Perfect for women who turn every sidewalk into a runway with her trendy pumps, heels made in Italy, and comfortable Italian shoes.</p>
        <p><strong>Keywords:</strong> Roberto Festa shoes UAE, luxury women's heels Dubai, Italian designer footwear GCC</p>

        <h3>Pollini - Iconic Italian Footwear for Him & Her</h3>
        <p><a href="/products?designer=pollini">Pollini</a> brings together over six decades of Italian shoemaking heritage with a bold, fashion-forward spirit. Known for its artful blend of tradition and trend, the brand delivers footwear that's equal parts luxurious, wearable, and expressive.</p>
        
        <h4>Women's Footwear Collection: Color, Glamour, & Confidence</h4>
        <p>Pollini's women's shoes are made to turn heads. Whether you're walking into a Dubai soirée or dressing up for a summer wedding in Riyadh, you'll find a pair that elevates your look.</p>
        <p>Highlights include:</p>
        <ul>
          <li>Colorful strappy sandals in glossy, matte, and metallic finishes</li>
          <li>Block heels that blend stability with sophistication</li>
          <li>Loafers and wedge sandals for daytime chic</li>
          <li>High stiletto pumps in bold shades and patterns</li>
          <li>Platform sandals with flair — ideal for summer outings</li>
          <li>Slingbacks in vibrant leathers and suedes</li>
        </ul>
        <p>Expect playful palettes, artistic prints, sculptural heels, and ultra-feminine silhouettes.</p>
        
        <h4>Men's Collection: Casual Meets Class</h4>
        <p>Pollini redefines men's casual footwear with elegant lines and everyday comfort. These aren't your basic shoes, they're designed for the modern Gulf man who appreciates quality and quiet luxury.</p>
        <p>Explore:</p>
        <ul>
          <li>Leather loafers and classic shoes in neutral, pastel and earthy tones</li>
          <li>Minimalist sneakers with premium Italian finishes</li>
          <li>Summer sneakers and moccasins ideal for laid-back weekends or resort style</li>
        </ul>

        {/* Arabic SEO Content */}
        <div dir="rtl" lang="ar">
          <h1>ماريو بولونيا - بيت الماركات العالمية - صيف ٢٠٢٥</h1>
          <p>مرحباً بك في <a href="/">Mario Bologna House of Brands</a>، وجهتك الأولى لأحدث صيحات الأزياء الإيطالية الفاخرة في دبي والخليج.</p>
          <p>اكتشف تشكيلات صيف 2025 المميّزة:</p>
          <ul>
            <li>فساتين صيفية راقية</li>
            <li>بدلات رجالية كلاسيكية بلمسة عصرية</li>
            <li>ملابس أطفال أنيقة تناسب أجواء العيد والمناسبات</li>
          </ul>
          <p>مستوحاة من أناقة دبي، صمّمت تشكيلاتنا لتجمع بين الستايل الأوروبي الإيطالي العصري والذوق الخليجي الفاخر، مثالية للسفر، المناسبات، والعطلات الصيفية.</p>
          <p>توصيل سريع إلى دبي، أبوظبي، الرياض، وجدة خلال أيام</p>
          <p>تسوق آمن وسهل عبر الإنترنت</p>
          <p>الكمية محدودة… لا تفوّت فرصتك</p>
          <p>ابدأ التسوق الآن وتميّز بإطلالة لا تُنسى هذا الصيف</p>

          <h2>قسم النساء – صيف ٢٠٢٥</h2>
          <p>هذا صيفك، وهذه لحظتك! اكتشفي <a href="/collections/women">تشكيلتنا الفاخرة للمرأة العصرية</a> من ماريو بولونيا. فساتين خفيفة وأنيقة، عبايات وكافتانات بلمسة أوروبية، وتنانير تعكس نعومة القطن وأناقة القصّات الإيطالية.</p>
          <p>اختاري تصاميم مميزة للسهرات أو للنهار، واحصلي على ستايل راقٍ يلفت الأنظار ويترك انطباع لا ينتسى.</p>
          <p>تسوقي إطلالاتك القادمة مثل النجمات بتصاميم تلائم رقيّ دبي وسحر أناقة المرأة السعودية.</p>
          <p>الأناقة هنا ليست خيارًا، بل أسلوب حياة.</p>
          <p>ماريو بولونيا... حيث الموضة تلتقي مع الذوق الخليجي الفاخر.</p>
          <p>اطلبي الآن، واستمتعي بخدمة توصيل سريع داخل دبي والإمارات والسعودية.</p>
          <p><strong>الكلمات المفتاحية:</strong> فساتين صيف فخمة، عبايات ستايل، أزياء نسائية فاخرة، ماركات راقية في الإمارات، أزياء نسائية دبي، لوك خليجي راقٍ، عبايات عصرية</p>

          <h2>قسم الرجال – صيف ٢٠٢٥</h2>
          <p>لأنك تحسن الإختيار، قدّمنا لك <a href="/collections/men">تشكيلة راقية رجال صيف 2025</a> من ماريو بولونيا. القماش كتان ناعم وقُطن. الألوان بيج رملي وأبيض صيفي وأزرق ناعم. الموديلات تتألف من القمصان الكاجوال للبدلات الرسمية الخفيفة.</p>
          <p>كن واجهة الأناقة الخليجية حيث تصاميمك تتحدث عنك سواء كنت في دبي مول أو في أحد مقاهي الرياض الراقية.</p>
          <p>ستايل أنيق، عصري، ويعكس حضورك القوي.</p>
          <p>مثالي لأجواء العمل، ولا يُضاهى في المناسبات.</p>
          <p>وللباحثين عن الإطلالة الكلاسيكية الراقية، ستجد قطعًا مثالية للاجتماعات في مركز دبي المالي العالمي DIFC، أو للعشاء الفاخر في فندق الريتز بالرياض.</p>
          <p>بدلات وقمصان وقصّات أنيقة تظهر ثقتك، وتُحاكي ذوقك النخبوي.</p>
          <p>اطلب الآن وتمتّع بـ شحن سريع داخل دبي والإمارات والسعودية، لأن الإطلالة الكاملة تبدأ من الراحة في التجربة.</p>
          <p><strong>الكلمات المفتاحية:</strong> ملابس رجال دبي، ماركات فاخرة في سعودية، قميص كتان صيفي، بدلة خفيفة للحر، توصيل سريع السعودية، توصيل سريع دبي</p>

          <h2>قسم الأطفال – صيف ٢٠٢٥</h2>
          <p>إطلبي اليوم واستلمي الطلب بتوصيل سريع في دبي خلال أيام قليلة. نوفر لكِ تجربة تسوق راقية وسريعة بدون تعب.</p>
          <p>العيد فرحة… خلّي إطلالة أطفالك تكتمل مع <a href="/collections/kids">Mario Bologna</a></p>
          <p>لصيف ونشاطات أجمل مع ماريو بولونيا. تشكيلات راقية للبنات والأولاد، بأقمشة ناعمة لا تسبّب حساسية ولا تقيد الحركة.</p>
          <p>ملابس أطفال بتصاميم راقية توائم ذوق العائلات الخليجية – لأن التميّز يبدأ من الصغر.</p>
          <p>من حفلات الأعياد في دبي والإمارات وجدة والرياض إلى عطلات التسوّق في دبي مول، طفلك سيكون دائمًا أنيق.</p>
          <p>كل تفصيلة مدروسة، من الأزرار للألوان، لتليق بأهم ضيوف هذا الصيف: أطفالك.</p>
          <p><strong>الكلمات المفتاحية:</strong> ملابس أطفال فخمة، ملابس صيفية بنات أولاد، أزياء أطفال دبي، موضة سعودية صيفية، أزياء العيد للأطفال، ملابس أطفال راقية دبي، فساتين بنات العيد، توصيل سريع دبي، ملابس أولاد فخمة</p>
        </div>
      </div>
    </div>
  );
}

type DesignerSectionType = {
  t: TFunction<'translation', undefined>;
  imgSrc: string;
  designerTitle: string;
  imgLogo?: string;
  designerLink: string;
  bgColor: string;
  isFull?: boolean;
};

function DesignerSection({
  t,
  designerLink,
  designerTitle,
  imgLogo,
  imgSrc,
  bgColor,
  isFull = false,
}: DesignerSectionType) {
  return (
    <div
      className={`${isFull ? 'w-full' : 'w-full xs:w-1/2 lg:w-1/4'} relative overflow-hidden min-h-80 sm:min-h-170 flex items-center justify-center`}
    >
      <img
        src={`/images/designers/${imgSrc}`}
        alt={designerTitle}
        className="absolute inset-0 w-full h-80 sm:h-194.5 object-cover object-center"
      />
      <div className={`${bgColor} absolute inset-0`}></div>

      {imgLogo ? (
        <img
          src={`/images/designers/logos/${imgLogo}`}
          alt="logo"
          className="absolute top-1/3 -translate-y-1/2 w-50 sm:w-87.5 p-2 sm:p-4"
        />
      ) : (
        <></>
      )}
      <NavLink
        to={designerLink}
        className="absolute top-3/4 bg-primary-P-40 text-white border border-transparent px-6 py-2.5 rounded-md text-sm"
      >
        {t('Shop Now')}
      </NavLink>
    </div>
  );
}
