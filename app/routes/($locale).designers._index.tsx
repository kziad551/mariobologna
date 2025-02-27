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
  return [{title: 'Designers'}];
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
    imgSrc: 'mario_cerutti.jpg',
    imgLogo: 'mario_cerutti-2.png',
    link: '/products?designer=mario+cerutti',
    title: 'Mario Cerutti',
    bgColor: 'bg-black/10',
    isFull: true,
  },
  {
    imgSrc: 'Baldinini.jpg',
    imgLogo: 'baldinini.png',
    link: '/products?designer=baldinini',
    title: 'Baldinini',
    bgColor: 'bg-white/10',
    // isFull: true,
  },
  {
    imgSrc: 'Parah.jpeg',
    imgLogo: 'parah.svg',
    link: '/products?designer=parah',
    title: 'Parah',
    bgColor: 'bg-black/10',
    // isFull: true,
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
