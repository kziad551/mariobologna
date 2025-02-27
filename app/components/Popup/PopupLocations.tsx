import {Link} from '@remix-run/react';
import {AnimatePresence, motion} from 'framer-motion';
import {TFunction} from 'i18next';
import {forwardRef, useImperativeHandle, useState} from 'react';
import {CgClose} from 'react-icons/cg';

export type LocationsProps = {
  t: TFunction<'translation', undefined>;
  locations: {title: string; tel?: string}[];
};

const PopupLocations = forwardRef(
  (
    {t, locations}: LocationsProps,
    ref: React.ForwardedRef<{
      openTrigger: () => void;
      closeTrigger: () => void;
    }>,
  ) => {
    const [openPopup, setOpenPopup] = useState(false);

    useImperativeHandle(ref, () => {
      return {
        openTrigger: () => setOpenPopup(true),
        closeTrigger: () => setOpenPopup(false),
      };
    });

    return (
      <AnimatePresence>
        {openPopup && (
          <motion.div
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
            id="locations-container"
            className="fixed inset-0 z-50 flex h-screen w-screen items-center justify-center bg-black/30"
            onClick={(e) => {
              // @ts-ignore
              if (e.target.id === 'locations-container') {
                setOpenPopup(false);
                e.stopPropagation();
              }
            }}
          >
            <motion.div
              initial={{height: 0}}
              animate={{height: 'auto'}}
              exit={{height: 0}}
              className="absolute top-1/2 -translate-y-1/2 flex flex-col items-stretch bg-white overflow-hidden"
            >
              <button
                className="self-end p-1"
                onClick={() => setOpenPopup(false)}
              >
                <CgClose className="ss:h-6 ss:w-6 w-5 h-5" />
              </button>
              <div className="max-h-100 overflow-y-auto scrollbar-thin flex flex-col gap-2">
                {locations.map((loc, index) => (
                  <div
                    key={index}
                    className="flex bg-neutral-N-98 flex-col gap-1 px-4 py-2"
                  >
                    <p className="text-sm">{t(loc.title)}</p>
                    {loc.tel ? (
                      <p>
                        {t('Tel')}
                        {': '}
                        <Link
                          to={`tel:${loc.tel}`}
                          target="_blank"
                          className="font-bold"
                        >
                          {loc.tel}
                        </Link>
                      </p>
                    ) : (
                      <></>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  },
);

export default PopupLocations;
