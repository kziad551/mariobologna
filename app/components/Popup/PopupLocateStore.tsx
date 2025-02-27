import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import PopupContainer from './PopupContainer';
import {CgClose} from 'react-icons/cg';
import {TFunction} from 'i18next';
import GoogleMapComponent, {Position} from '../GoogleMap';
import useWindowDimensions from '~/hooks/useWindowDimensions';
import PopupLocations from './PopupLocations';

const UAE_center = {
  lat: 25.133300122449686,
  lng: 55.10859301406823,
};
const UK_center = {
  lat: 51.46482442730116,
  lng: -0.3448740267722978,
};

const UK_positions: Position[] = [
  {
    position: {
      lat: 51.46482442730116,
      lng: -0.3448740267722978,
    },
    name: 'Claudia Rossi, 14 Worton Court, Worton Road Isleworth, TW7 6ER',
  },
];

const UAE_positions: Position[] = [
  {
    position: {
      lat: 25.072714968252686,
      lng: 55.40089351040797,
    },
    name: 'The Outlet Mall',
    locations: ['Baldinini - the Outlet Mall, G floor, Unit G75'],
  },
  {
    position: {
      lat: 25.229793372408505,
      lng: 55.31893602634606,
    },
    name: 'Wafi Mall',
    locations: ['Baldinini - Wafi Mall, 1st Floor, Unit 57C-58B'],
  },
  {
    position: {
      lat: 25.254529966917172,
      lng: 55.30349202633591,
    },
    name: 'Burjuman Mall',
    locations: ['Mario Cerutti - Burjuman Mall, First Floor, Unit BJC/L2/1030'],
  },
  {
    position: {
      lat: 25.197237081630487,
      lng: 55.279749482367805,
    },
    name: 'The Dubai Mall',
    locations: [
      'Baldinini - The Dubai Mall, G floor, Unit 078, P3 Cinema Parking',
      'Parah - The Dubai Mall G floor, unit 099, P3 Cinema Parking',
      'Baldinini - Galleries Lafayette, the Dubai Mall, Shoe Box',
      'Kanna - Galleries Lafayette, the Dubai Mall, Ibn Battuta, Shoe Box',
      'Salvi - Galleries Lafayette, the Dubai Mall, Ibn Battuta, Shoe Box',
      'Claudia Rossi - Galleries Lafayette, the Dubai Mall, Ibn Battuta, Shoe Box',
      'Jijil - Galleries Lafayette, the Dubai Mall, Ibn Battuta.',
    ],
  },
  {
    position: {
      lat: 24.911952955639446,
      lng: 55.01031696657953,
    },
    name: 'The Outlet village',
    locations: ['Parah - the Outlet village, Ground floor, Unit AU19'],
  },
];

const UAE_locations = [
  {
    title: 'Baldinini - The Dubai Mall, G floor, Unit 078, P3 Cinema Parking',
    tel: '+971 (4) 339 8595',
  },
  {
    title: 'Baldinini - the Outlet Mall, G floor, Unit G75',
    tel: '+971 (4) 439 0449',
  },
  {
    title: 'Baldinini - the Outlet Village, G floor, Unit AL40',
    tel: '+971 (4) 881 2257',
  },
  {
    title: 'Baldinini - The Galleries Lafayette, the Dubai Mall, Shoe Box',
  },
  {
    title: 'Baldinini - Wafi Mall, 1st Floor, Unit 57C-58B',
    tel: '+971 (4) 324 0614',
  },
  {
    title: 'Mario Cerutti - Burjuman Mall, First Floor, Unit BJC/L2/1030',
    tel: '+971 (4) 343 7997',
  },
  {
    title: 'Parah - The Dubai Mall G floor, unit 099, P3 Cinema Parking',
    tel: '+971 (4) 339 8489',
  },
  {
    title: 'Parah - the Outlet village, Ground floor, Unit AU19',
    tel: '+971 (4) 591 2638',
  },
  {
    title: 'Kanna - Galleries Lafayette, the Dubai Mall, Ibn Battuta, Shoe Box',
  },
  {
    title: 'Salvi - Galleries Lafayette, the Dubai Mall, Ibn Battuta, Shoe Box',
  },
  {
    title:
      'Claudia Rossi - Galleries Lafayette, the Dubai Mall, Ibn Battuta, Shoe Box',
  },
  {
    title: 'Jijil - Galleries Lafayette, the Dubai Mall, Ibn Battuta',
  },
];
const UK_locations = [
  {
    title: 'Claudia Rossi, 14 Worton Court, Worton Road Isleworth, TW7 6ER',
  },
];

export type LocateStoreProps = {
  t: TFunction<'translation', undefined>;
  direction: 'ltr' | 'rtl';
};

const PopupLocateStore = forwardRef(
  (
    {t, direction}: LocateStoreProps,
    ref: React.ForwardedRef<{
      openTrigger: () => void;
      closeTrigger: () => void;
    }>,
  ) => {
    const detailedRef = useRef<{
      openTrigger: () => void;
      closeTrigger: () => void;
    }>({
      openTrigger: () => {},
      closeTrigger: () => {},
    });
    const {width} = useWindowDimensions();

    const [openPopup, setOpenPopup] = useState(false);
    const [locationList, setLocationList] = useState<
      {title: string; tel?: string}[]
    >([]);

    useEffect(() => {
      const close = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          setOpenPopup(false);
        }
      };

      window.addEventListener('keyup', close);

      return () => {
        window.removeEventListener('keyup', close);
      };
    }, []);

    useImperativeHandle(ref, () => {
      return {
        openTrigger: () => setOpenPopup(true),
        closeTrigger: () => setOpenPopup(false),
      };
    });

    const containerStyle = {
      width: '100%',
      height: width >= 450 ? '312px' : '256px',
    };

    return (
      <PopupContainer
        innerContainerStyle="m-auto overflow-auto ss:overflow-visible"
        openPopup={openPopup}
        setOpenPopup={setOpenPopup}
      >
        <div className="w-[98vw] lg:w-250 xl:w-[1200px] rounded-xl border bg-white border-neutral-N-80 p-2 ss:p-5">
          <button
            className={`${direction === 'ltr' ? 'right-2 ss:right-3' : 'left-2 ss:left-3'} absolute top-2 ss:top-4 rounded-lg z-10 bg-white p-1 ss:py-2 ss:px-3 hover:bg-neutral-N-92/80`}
            onClick={() => setOpenPopup(false)}
          >
            <CgClose className="ss:h-6 ss:w-6 w-5 h-5" />
          </button>
          <div className="max-h-108 xs:max-h-150 overflow-y-auto scrollbar-none w-full flex flex-col ss:flex-row gap-3 ss:gap-6">
            <div className="ss:w-full flex flex-col items-start gap-1 ss:gap-10">
              <h1 className="text-2xl ss:text-5xl font-medium">{t('UAE')}</h1>
              <GoogleMapComponent
                t={t}
                containerStyle={containerStyle}
                center={UAE_center}
                positions={UAE_positions}
                zoom={9.6}
              />
            </div>
            <div className="ss:w-3/5 flex flex-col items-start gap-1 ss:gap-10">
              <h1 className="text-2xl ss:text-5xl font-medium">{t('UK')}</h1>
              <GoogleMapComponent
                t={t}
                containerStyle={containerStyle}
                center={UK_center}
                positions={UK_positions}
                zoom={11}
              />
            </div>
          </div>
          <div className="flex gap-2 mt-5">
            <button
              className="w-full ss:w-fit bg-primary-P-40 text-white rounded justify-between py-2 px-6 hover:shadow-md active:shadow-none transition-all"
              onClick={() => {
                setLocationList(UAE_locations);
                detailedRef.current.openTrigger();
              }}
            >
              {t('UAE')}
            </button>
            <button
              className="w-full ss:w-fit bg-primary-P-40 text-white rounded justify-between py-2 px-6 hover:shadow-md active:shadow-none transition-all"
              onClick={() => {
                setLocationList(UK_locations);
                detailedRef.current.openTrigger();
              }}
            >
              {t('UK')}
            </button>
          </div>
        </div>
        <PopupLocations ref={detailedRef} t={t} locations={locationList} />
      </PopupContainer>
    );
  },
);

export default PopupLocateStore;
