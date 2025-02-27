import {AnimatePresence, motion} from 'framer-motion';
import React from 'react';

type PopupProps = {
  openPopup: boolean;
  setOpenPopup: React.Dispatch<React.SetStateAction<boolean>>;
  children: React.ReactNode;
  innerContainerStyle?: string;
  outsideClickable?: boolean;
};

const PopupContainer = ({
  openPopup,
  setOpenPopup,
  innerContainerStyle,
  children,
  outsideClickable = true,
}: PopupProps) => {
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
          id="popup-container"
          className="fixed inset-0 z-50 flex h-screen w-screen items-center justify-center bg-black/30"
          onClick={(e) => {
            // @ts-ignore
            if (outsideClickable && e.target.id === 'popup-container') {
              setOpenPopup(false);
              e.stopPropagation();
            }
          }}
        >
          <motion.div
            initial={{
              scale: 0,
            }}
            animate={{
              scale: 1,
            }}
            exit={{
              scale: 0,
            }}
            className={`${innerContainerStyle ? innerContainerStyle : 'mx-5 my-auto'} relative scrollbar-none overflow-auto w-fit h-fit max-h-screen inset-0 flex flex-col items-center justify-center ss:m-auto`}
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PopupContainer;
