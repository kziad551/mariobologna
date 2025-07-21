import {Link, type MetaFunction} from '@remix-run/react';
import React, {useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import {useCustomContext} from '~/contexts/App';

export const meta: MetaFunction = () => {
  return [
    // English Meta Tags
    { title: 'About Us | Mario Bologna - House of Brands' },
    { name: 'description', content: 'Learn about Mario Bologna, a premier house of brands with over 30 years of retail excellence offering curated fashion collections for men, women, and kids.' },
    { name: 'keywords', content: 'Mario Bologna history, fashion brand, luxury retail, about Mario Bologna, fashion house history, luxury fashion Dubai, Italian fashion brands, premium fashion UAE, designer brands Dubai, fashion house Dubai, luxury boutique UAE, high-end fashion brands, exclusive fashion Dubai, premium retail Dubai, luxury fashion house history, Italian designer brands UAE, fashion retail excellence, luxury brand story, premium fashion house, designer fashion heritage' },
    
    // Arabic Meta Tags
    { title: 'من نحن | ماريو بولونيا - دار الماركات الفاخرة', lang: 'ar' },
    { name: 'description', content: 'تعرف على ماريو بولونيا، دار الماركات الفاخرة الرائدة مع أكثر من 30 عاماً من التميز في البيع بالتجزئة، نقدم مجموعات أزياء منتقاة بعناية للرجال والنساء والأطفال في دبي والإمارات.', lang: 'ar' },
    { name: 'keywords', content: 'تاريخ ماريو بولونيا، ماركة أزياء فاخرة، بيع تجزئة فاخر، عن ماريو بولونيا، تاريخ دار الأزياء، أزياء فاخرة دبي، الماركات الإيطالية، أزياء راقية الإمارات، ماركات مصممة دبي، دار أزياء دبي، بوتيك فاخر الإمارات، ماركات أزياء راقية، أزياء حصرية دبي، بيع تجزئة راقي دبي، تاريخ دار أزياء فاخرة، ماركات مصممة إيطالية الإمارات، تميز بيع أزياء، قصة ماركة فاخرة، دار أزياء راقية، تراث أزياء مصممة، قصة نجاح أزياء، خبرة أزياء فاخرة، ماركات عالمية دبي', lang: 'ar' },
    
    // Open Graph Tags - English
    { property: 'og:title', content: 'About Us | Mario Bologna - House of Brands' },
    { property: 'og:description', content: 'Learn about Mario Bologna, a premier house of brands with over 30 years of retail excellence offering curated fashion collections.' },
    { property: 'og:type', content: 'website' },
    { property: 'og:site_name', content: 'Mario Bologna' },
    { property: 'og:locale', content: 'en_US' },
    { property: 'og:locale:alternate', content: 'ar_AE' },
    { property: 'og:url', content: 'https://mariobologna.com/aboutus' },
    { property: 'og:image', content: '/images/mario-bologna-about-us.jpg' },
    { property: 'og:image:width', content: '1200' },
    { property: 'og:image:height', content: '630' },
    
    // Open Graph Tags - Arabic
    { property: 'og:title', content: 'من نحن | ماريو بولونيا - دار الماركات الفاخرة', lang: 'ar' },
    { property: 'og:description', content: 'تعرف على ماريو بولونيا، دار الماركات الفاخرة الرائدة مع أكثر من 30 عاماً من التميز في البيع بالتجزئة، نقدم مجموعات أزياء منتقاة بعناية في دبي والإمارات.', lang: 'ar' },
    
    // Twitter Meta Tags - English
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: 'About Us | Mario Bologna - House of Brands' },
    { name: 'twitter:description', content: 'Learn about Mario Bologna, a premier house of brands with over 30 years of retail excellence.' },
    { name: 'twitter:image', content: '/images/mario-bologna-about-us.jpg' },
    
    // Twitter Meta Tags - Arabic
    { name: 'twitter:title', content: 'من نحن | ماريو بولونيا - دار الماركات الفاخرة', lang: 'ar' },
    { name: 'twitter:description', content: 'تعرف على ماريو بولونيا، دار الماركات الفاخرة الرائدة مع أكثر من 30 عاماً من التميز في البيع بالتجزئة.', lang: 'ar' },
    
    // Additional SEO Meta Tags
    { name: 'robots', content: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1' },
    { name: 'author', content: 'Mario Bologna - House of Brands' },
    { name: 'publisher', content: 'Mario Bologna - House of Brands' },
    { name: 'geo.region', content: 'AE-DU' },
    { name: 'geo.placename', content: 'Dubai' },
    { name: 'geo.position', content: '25.2048;55.2708' },
    { name: 'ICBM', content: '25.2048, 55.2708' },
    
    // Additional Arabic SEO Meta Tags
    { name: 'author', content: 'ماريو بولونيا - دار الماركات الفاخرة', lang: 'ar' },
    { name: 'publisher', content: 'ماريو بولونيا - دار الماركات الفاخرة', lang: 'ar' },
    { name: 'geo.placename', content: 'دبي', lang: 'ar' },
    
    // Enhanced Keywords for specific aspects
    { name: 'keywords', content: 'luxury fashion history Dubai, Italian fashion heritage UAE, premium retail story Dubai, fashion house legacy UAE, luxury brand journey Dubai, designer brand evolution UAE, high-end fashion expertise Dubai, luxury retail heritage UAE, fashion excellence Dubai, premium brand story UAE, luxury fashion legacy Dubai, designer fashion journey UAE' },
    { name: 'keywords', content: 'تاريخ أزياء فاخرة دبي، تراث أزياء إيطالية الإمارات، قصة بيع تجزئة راقي دبي، إرث دار أزياء الإمارات، رحلة ماركة فاخرة دبي، تطور ماركة مصممة الإمارات، خبرة أزياء راقية دبي، تراث بيع تجزئة فاخر الإمارات، تميز أزياء دبي، قصة ماركة راقية الإمارات، إرث أزياء فاخرة دبي، رحلة أزياء مصممة الإمارات، نجاح أزياء فاخرة، قصة نجاح ماركة، خبرة عقود أزياء', lang: 'ar' },
    
    // Hreflang alternatives
    { name: 'alternate', content: 'ar', hrefLang: 'ar' },
    { name: 'alternate', content: 'en', hrefLang: 'en' },
    { name: 'alternate', content: 'ar-AE', hrefLang: 'ar-AE' },
    { name: 'alternate', content: 'en-AE', hrefLang: 'en-AE' },
    { name: 'alternate', content: 'ar-SA', hrefLang: 'ar-SA' },
    { name: 'alternate', content: 'en-SA', hrefLang: 'en-SA' },
    
    // Additional context-specific meta tags
    { name: 'page-topic', content: 'Fashion Brand History' },
    { name: 'page-topic', content: 'تاريخ ماركة الأزياء', lang: 'ar' },
    { name: 'audience', content: 'Fashion enthusiasts, luxury shoppers, brand researchers' },
    { name: 'audience', content: 'عشاق الأزياء، متسوقين فاخرين، باحثين عن الماركات', lang: 'ar' },
  ];
};

const AboutUs = () => {
  const {setCurrentPage} = useCustomContext();
  const {t} = useTranslation();

  useEffect(() => {
    setCurrentPage('About Us');
  }, []);

  return (
    <div className="about_us">
      <div className="py-3 px-4 sm:py-36 sm:px-8">
        <div className="hidden sm:flex flex-col items-start gap-7 mb-16">
          <h1 className="text-5xl font-medium">{t('Mario Bologna')}</h1>
          <p className="text-medium">
            {t('Welcome to Mario Bologna - House of Brands!')}
          </p>
        </div>
        <div className="flex items-start justify-start flex-col sm:flex-row w-full gap-8 sm:gap-18 lg:gap-54">
          <div className="max-w-192 2xl:max-w-250 flex flex-col items-start gap-10">
            <div className="flex flex-col text-sm sm:text-base gap-6">
              <p className="text-justify">{t('about_us_desc_one')}</p>
              <p className="text-justify">{t('about_us_desc_two')}</p>
              <p className="text-justify">{t('about_us_desc_three')}</p>
              {/* <p className="text-justify">{t('about_us_desc_four')}</p> */}
              {/* <p
                className="text-justify"
                dangerouslySetInnerHTML={{__html: t('about_us_desc_five')}}
              ></p>
              <p
                className="text-justify"
                dangerouslySetInnerHTML={{__html: t('about_us_desc_six')}}
              ></p>
              <p
                className="text-justify"
                dangerouslySetInnerHTML={{__html: t('about_us_desc_seven')}}
              ></p> */}
              {/* <p className="text-justify">
                {t(
                  '(Presence Projection: Figures to be added in circular frame, Text below for each):',
                )}
              </p> */}
              {/* <ul className="">
                <li className="text-justify">
                  {t('33 Years: Celebrating Retail Excellence!')}
                </li>
                <li className="text-justify">
                  {t('15 Brands: Handpicked for your desire')}
                </li>
                <li className="text-justify">
                  {t('85,808 Articles: Tell the Tale of success')}
                </li>
                <li className="text-justify">
                  {t('503,801 Valued Customers: ... and growing!')}
                </li>
              </ul> */}
              {/* <p
                className="text-justify"
                dangerouslySetInnerHTML={{
                  __html: t('Phrases to use over sliders:'),
                }}
              ></p> */}
              {/* <ul className="">
                <li
                  className="text-justify"
                  dangerouslySetInnerHTML={{__html: t('about_us_phrase_one')}}
                ></li>
                <li
                  className="text-justify"
                  dangerouslySetInnerHTML={{__html: t('about_us_phrase_two')}}
                ></li>
                <li
                  className="text-justify"
                  dangerouslySetInnerHTML={{__html: t('about_us_phrase_three')}}
                ></li>
                <li
                  className="text-justify"
                  dangerouslySetInnerHTML={{__html: t('about_us_phrase_four')}}
                ></li>
              </ul> */}
            </div>
          </div>
        </div>
      </div>
      
      {/* SEO Content - Hidden from users but visible to search engines */}
      <div style={{display: 'none'}}>
        <section>
          <h1>Mario Bologna - House of Brands | About Our Luxury Fashion Legacy in Dubai</h1>
          <h2>30+ Years of Retail Excellence - Our Story</h2>
          <p>
            <a href="/" title="Mario Bologna - Luxury Fashion Brands in Dubai Homepage">Mario Bologna - House of Brands</a> stands as Dubai's premier destination for luxury fashion brands, with over three decades of retail excellence in the heart of the Middle East. 
            Our story began with a vision to bring the finest <a href="https://www.vogue.com/article/italian-fashion-designers" target="_blank" rel="noopener noreferrer" title="Italian Fashion Designers - Vogue">Italian designer collections</a> to discerning customers in Dubai and across the UAE.
            Since our inception, Mario Bologna has curated exclusive partnerships with prestigious <a href="https://www.camera-nazionale-moda.it/" target="_blank" rel="noopener noreferrer" title="Camera Nazionale della Moda Italiana">Italian fashion houses</a>, establishing ourselves as the trusted name for luxury fashion brands in Dubai.
            Our commitment to excellence has made us a cornerstone of Dubai's luxury retail landscape, serving fashion enthusiasts who appreciate authentic Italian craftsmanship and contemporary design.
            From our flagship location, we continue to offer personalized service and expert styling advice, ensuring every customer discovers their perfect luxury fashion pieces.
            <a href="/collections/new-arrivals" title="New Arrivals - Mario Bologna Dubai">Explore our latest luxury collections</a> and experience the Mario Bologna difference.
          </p>
          <p>
            SEO Keywords: Mario Bologna history Dubai, luxury fashion house UAE, Italian fashion brands Dubai, premium retail excellence, 
            designer fashion heritage Dubai, luxury brand story UAE, fashion retail legacy Dubai, Italian luxury brands UAE
          </p>
        </section>

        <section>
          <h2>Our Italian Fashion Heritage & Designer Partnerships</h2>
          <h3>Authentic Italian Luxury in the Heart of Dubai</h3>
          <p>
            Mario Bologna's deep roots in <a href="https://www.italy.it/en/discover-italy/fashion" target="_blank" rel="noopener noreferrer" title="Italian Fashion Heritage">Italian fashion culture</a> set us apart in Dubai's competitive luxury market.
            Our carefully selected brand portfolio includes prestigious names like <a href="https://www.baldinini.it/" target="_blank" rel="noopener noreferrer" title="Baldinini Official Website">Baldinini</a>, <a href="https://www.peserico.it/" target="_blank" rel="noopener noreferrer" title="Peserico Official Website">Peserico</a>, <a href="https://www.cromia.it/" target="_blank" rel="noopener noreferrer" title="Cromia Official Website">Cromia</a>, and other exclusive Italian designers.
            Each brand in our portfolio represents decades of Italian craftsmanship, innovative design, and commitment to quality that resonates with Dubai's sophisticated clientele.
            Our team travels regularly to <a href="https://www.milanounica.it/" target="_blank" rel="noopener noreferrer" title="Milano Unica Fashion Fair">Milan's fashion districts</a> and Italian manufacturing centers to source the finest collections for our Dubai customers.
            This direct relationship with Italian fashion houses ensures authenticity, exclusivity, and access to limited-edition pieces you won't find elsewhere in the UAE.
            Visit our <a href="/contact" title="Contact Mario Bologna Dubai">Dubai showroom</a> to experience authentic Italian luxury fashion firsthand.
          </p>
          <p>
            SEO Keywords: Italian fashion brands Dubai, authentic Italian luxury UAE, designer partnerships Dubai, Milan fashion Dubai, 
            Italian craftsmanship UAE, exclusive Italian designers Dubai, luxury Italian brands UAE, premium Italian fashion Dubai
          </p>
        </section>

        <section>
          <h2>Curated Collections for Modern Luxury Living</h2>
          <h3>Men's, Women's & Kids' Premium Fashion in Dubai</h3>
          <p>
            Our expertly curated collections span <a href="/collections/women" title="Women's Luxury Fashion Dubai">women's luxury fashion</a>, <a href="/collections/men" title="Men's Designer Fashion Dubai">men's designer wear</a>, and <a href="/collections/kids" title="Kids Luxury Clothing Dubai">children's premium clothing</a>, each selected to meet the diverse lifestyle needs of our Dubai and UAE clientele.
            For women, we offer everything from elegant <a href="/collections/evening-wear" title="Evening Wear Collection Dubai">evening wear</a> perfect for Dubai's social calendar to sophisticated <a href="/collections/workwear" title="Professional Wear Dubai">business attire</a> for the modern professional.
            Our men's collection features contemporary Italian suits, casual luxury pieces, and accessories that embody the refined taste expected in Dubai's business and social circles.
            The children's line continues our commitment to quality with age-appropriate luxury pieces that don't compromise on comfort or style.
            Every piece in our collection undergoes rigorous quality checks and styling assessments to ensure it meets our standards for luxury fashion in Dubai.
            <a href="/size-guide" title="Size Guide - Mario Bologna Dubai">Find your perfect fit</a> with our comprehensive sizing assistance and personal styling services.
          </p>
          <p>
            SEO Keywords: curated fashion collections Dubai, luxury women's fashion UAE, men's designer wear Dubai, kids luxury clothing UAE, 
            premium fashion curation Dubai, luxury lifestyle fashion UAE, designer collections Dubai, exclusive fashion UAE
          </p>
        </section>

        <section>
          <h2>Customer Excellence & Service Philosophy</h2>
          <h3>Personalized Luxury Shopping Experience in Dubai</h3>
          <p>
            At Mario Bologna, we believe luxury extends beyond the product to encompass the entire shopping experience.
            Our trained fashion consultants provide personalized styling services, helping customers navigate our extensive collection to find pieces that perfectly complement their lifestyle and aesthetic preferences.
            We offer private shopping appointments, seasonal wardrobe consultations, and exclusive access to limited-edition collections for our VIP clientele.
            Our <a href="/delivery" title="Delivery Information - Mario Bologna Dubai">express delivery service</a> across Dubai, Abu Dhabi, and the broader UAE ensures convenient access to luxury fashion.
            For international customers, we provide secure shipping to <a href="/international-shipping" title="International Shipping - Mario Bologna">Saudi Arabia and other GCC countries</a>.
            Our commitment to customer satisfaction is reflected in our comprehensive <a href="/returns" title="Returns Policy - Mario Bologna Dubai">returns policy</a> and ongoing customer support services.
            Join thousands of satisfied customers who trust Mario Bologna for their luxury fashion needs in Dubai and beyond.
          </p>
          <p>
            SEO Keywords: luxury shopping experience Dubai, personal styling Dubai, VIP fashion service UAE, luxury customer service Dubai, 
            express delivery Dubai fashion, premium shopping UAE, luxury retail service Dubai, fashion consultation UAE
          </p>
        </section>

        {/* Arabic SEO Content */}
        <section lang="ar" dir="rtl">
          <h2>ماريو بولونيا - دار الماركات الفاخرة | قصة نجاحنا في دبي</h2>
          <h3>أكثر من 30 عاماً من التميز في عالم الأزياء الفاخرة</h3>
          <p>
            يقف ماريو بولونيا - دار الماركات الفاخرة كوجهة رائدة للأزياء الفاخرة في دبي، مع أكثر من ثلاثة عقود من التميز في البيع بالتجزئة في قلب الشرق الأوسط.
            بدأت قصتنا برؤية لجلب أرقى مجموعات المصممين الإيطاليين للعملاء المميزين في دبي وعبر دولة الإمارات العربية المتحدة.
            منذ تأسيسنا، قام ماريو بولونيا بتطوير شراكات حصرية مع دور الأزياء الإيطالية المرموقة، مما جعلنا الاسم الموثوق للماركات الفاخرة في دبي.
            التزامنا بالتميز جعلنا حجر الزاوية في المشهد التجاري الفاخر في دبي، حيث نخدم عشاق الأزياء الذين يقدرون الحرفية الإيطالية الأصيلة والتصميم المعاصر.
            من موقعنا الرئيسي، نواصل تقديم خدمة شخصية ونصائح تنسيقية خبيرة، مما يضمن اكتشاف كل عميل لقطع الأزياء الفاخرة المثالية له.
            اكتشف مجموعاتنا الفاخرة الأحدث واختبر الفرق الذي يميز ماريو بولونيا.
          </p>
          <p>
            كلمات البحث: تاريخ ماريو بولونيا دبي، دار أزياء فاخرة الإمارات، الماركات الإيطالية دبي، تميز بيع تجزئة راقي، 
            تراث أزياء مصممة دبي، قصة ماركة فاخرة الإمارات، إرث بيع أزياء دبي، ماركات إيطالية فاخرة الإمارات
          </p>
        </section>

        <section lang="ar" dir="rtl">
          <h2>تراثنا في الأزياء الإيطالية وشراكاتنا مع المصممين</h2>
          <h3>الفخامة الإيطالية الأصيلة في قلب دبي</h3>
          <p>
            جذور ماريو بولونيا العميقة في ثقافة الأزياء الإيطالية تميزنا في السوق الفاخر التنافسي في دبي.
            تتضمن محفظة الماركات المنتقاة بعناية أسماء مرموقة مثل بالدينيني، بيسيريكو، كروميا، ومصممين إيطاليين حصريين آخرين.
            كل ماركة في محفظتنا تمثل عقود من الحرفية الإيطالية والتصميم المبتكر والالتزام بالجودة التي تتردد صداها مع عملاء دبي المتطورين.
            يسافر فريقنا بانتظام إلى أحياء الموضة في ميلان ومراكز التصنيع الإيطالية لمصادر أجود المجموعات لعملائنا في دبي.
            هذه العلاقة المباشرة مع دور الأزياء الإيطالية تضمن الأصالة والحصرية والوصول إلى القطع محدودة الإصدار التي لن تجدها في مكان آخر في الإمارات.
            زر صالة عرضنا في دبي لتختبر الأزياء الإيطالية الفاخرة الأصيلة بنفسك.
          </p>
          <p>
            كلمات البحث: ماركات أزياء إيطالية دبي، فخامة إيطالية أصيلة الإمارات، شراكات مصممين دبي، أزياء ميلان دبي، 
            حرفية إيطالية الإمارات، مصممين إيطاليين حصريين دبي، ماركات إيطالية فاخرة الإمارات، أزياء إيطالية راقية دبي
          </p>
        </section>

        <section lang="ar" dir="rtl">
          <h2>مجموعات منتقاة للحياة الفاخرة العصرية</h2>
          <h3>أزياء راقية للرجال والنساء والأطفال في دبي</h3>
          <p>
            تمتد مجموعاتنا المنتقاة بخبرة لتشمل أزياء نسائية فاخرة وملابس رجالية مصممة وملابس أطفال راقية، كل منها مختارة لتلبية احتياجات نمط الحياة المتنوعة لعملائنا في دبي والإمارات.
            للنساء، نقدم كل شيء من ملابس السهرة الأنيقة المثالية للأجندة الاجتماعية في دبي إلى الملابس المهنية المتطورة للمرأة العصرية.
            تتميز مجموعة الرجال لدينا بالبدلات الإيطالية المعاصرة والقطع الفاخرة الكاجوال والاكسسوارات التي تجسد الذوق الراقي المتوقع في الدوائر التجارية والاجتماعية في دبي.
            يواصل خط الأطفال التزامنا بالجودة مع قطع فاخرة مناسبة للعمر لا تتنازل عن الراحة أو الأناقة.
            كل قطعة في مجموعتنا تخضع لفحوصات جودة صارمة وتقييمات تنسيقية لضمان تلبيتها لمعاييرنا للأزياء الفاخرة في دبي.
            اعثر على المقاس المثالي لك مع مساعدة المقاسات الشاملة وخدمات التنسيق الشخصي.
          </p>
          <p>
            كلمات البحث: مجموعات أزياء منتقاة دبي، أزياء نسائية فاخرة الإمارات، ملابس رجالية مصممة دبي، ملابس أطفال فاخرة الإمارات، 
            تنسيق أزياء راقي دبي، أزياء نمط حياة فاخر الإمارات، مجموعات مصممة دبي، أزياء حصرية الإمارات
          </p>
        </section>

        <section lang="ar" dir="rtl">
          <h2>التميز في خدمة العملاء وفلسفة الخدمة</h2>
          <h3>تجربة تسوق فاخرة شخصية في دبي</h3>
          <p>
            في ماريو بولونيا، نؤمن أن الفخامة تمتد إلى ما هو أبعد من المنتج لتشمل تجربة التسوق بأكملها.
            يوفر استشاريو الأزياء المدربون لدينا خدمات تنسيقية شخصية، مما يساعد العملاء على التنقل في مجموعتنا الواسعة للعثور على القطع التي تكمل بشكل مثالي نمط حياتهم وتفضيلاتهم الجمالية.
            نقدم مواعيد تسوق خاصة واستشارات خزانة ملابس موسمية ووصول حصري إلى مجموعات محدودة الإصدار لعملائنا المميزين.
            تضمن خدمة التوصيل السريع عبر دبي وأبو ظبي ودولة الإمارات الأوسع وصولاً مريحاً للأزياء الفاخرة.
            للعملاء الدوليين، نوفر شحناً آمناً إلى المملكة العربية السعودية ودول مجلس التعاون الخليجي الأخرى.
            التزامنا برضا العملاء ينعكس في سياسة الإرجاع الشاملة وخدمات دعم العملاء المستمرة.
            انضم إلى آلاف العملاء الراضين الذين يثقون بماريو بولونيا لاحتياجات الأزياء الفاخرة في دبي وما بعدها.
          </p>
          <p>
            كلمات البحث: تجربة تسوق فاخرة دبي، تنسيق شخصي دبي، خدمة أزياء مميزة الإمارات، خدمة عملاء فاخرة دبي، 
            توصيل سريع أزياء دبي، تسوق راقي الإمارات، خدمة بيع تجزئة فاخرة دبي، استشارة أزياء الإمارات
          </p>
        </section>
      </div>
    </div>
  );
};

export default AboutUs;
