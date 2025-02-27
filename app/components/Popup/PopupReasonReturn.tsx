import {IoClose} from 'react-icons/io5';
import PopupContainer from './PopupContainer';
import {FloatLabel} from 'primereact/floatlabel';
import {InputText} from 'primereact/inputtext';
import {TFunction} from 'i18next';

type ReasonReturnPopupType = {
  openPopup: boolean;
  setOpenPopup: React.Dispatch<React.SetStateAction<boolean>>;
  returnReason: string;
  setReturnReason: React.Dispatch<React.SetStateAction<string>>;
  t: TFunction<'translation', undefined>;
  direction: 'rtl' | 'ltr';
};

export default function ReasonReturnPopup({
  t,
  direction,
  openPopup,
  setOpenPopup,
  returnReason,
  setReturnReason,
}: ReasonReturnPopupType) {
  function handleReasonSelected(
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) {
    // @ts-ignore
    const reason = e.target.textContent;
    setReturnReason(reason);
    setOpenPopup(false);
  }
  function handleKeyboard(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' && returnReason !== '') {
      setOpenPopup(false);
    }
  }

  return (
    <PopupContainer openPopup={openPopup} setOpenPopup={setOpenPopup}>
      <div className="md:min-w-166 rounded flex flex-col gap-3 px-4 md:px-8 pb-4 md:pb-8 pt-8 md:pt-16 bg-[#F5F5F5]">
        <div className="flex items-start justify-between gap-4">
          <h1 className="text-2xl md:text-4xl">{t('Reason for Return')}</h1>
          <IoClose
            className="w-5 h-5 md:w-8 md:h-8 cursor-pointer"
            onClick={() => setOpenPopup(false)}
          />
        </div>
        <div className="flex flex-col items-stretch justify-start w-full gap-4">
          <button
            onClick={handleReasonSelected}
            className={`${direction === 'ltr' ? 'text-left' : 'text-right'} text-xs md:text-sm pb-2 border-b border-b-neutral-N-80`}
          >
            {t("The item doesn't look like the one in the photo")}
          </button>
          <button
            onClick={handleReasonSelected}
            className={`${direction === 'ltr' ? 'text-left' : 'text-right'} text-xs md:text-sm pb-2 border-b border-b-neutral-N-80`}
          >
            {t('The color does not match the one displayed in the image')}
          </button>
          <button
            onClick={handleReasonSelected}
            className={`${direction === 'ltr' ? 'text-left' : 'text-right'} text-xs md:text-sm pb-2 border-b border-b-neutral-N-80`}
          >
            {t('The size is too big')}
          </button>
          <button
            onClick={handleReasonSelected}
            className={`${direction === 'ltr' ? 'text-left' : 'text-right'} text-xs md:text-sm pb-2 border-b border-b-neutral-N-80`}
          >
            {t('The quality of the product is not what I expected')}
          </button>
          <button
            onClick={handleReasonSelected}
            className={`${direction === 'ltr' ? 'text-left' : 'text-right'} text-xs md:text-sm pb-2 border-b border-b-neutral-N-80`}
          >
            {t('Wrong item')}
          </button>
          <button
            onClick={handleReasonSelected}
            className={`${direction === 'ltr' ? 'text-left' : 'text-right'} text-xs md:text-sm pb-2 border-b border-b-neutral-N-80`}
          >
            {t("It's too long for me")}
          </button>
          <div className={`${direction === 'rtl' ? 'rtl-container' : ''} mt-5`}>
            <FloatLabel>
              <InputText
                required
                id="other"
                type="text"
                value={returnReason}
                onChange={(e) => setReturnReason(e.target.value)}
                onKeyDown={handleKeyboard}
                className="!bg-transparent border border-neutral-N-50 p-2.5 md:p-4 w-full text-sm md:text-base rounded focus:shadow-none focus:outline-none"
              />
              <label className="ml-2 -mt-2" htmlFor="other">
                {t('Other')}
              </label>
            </FloatLabel>
            <p className="text-xs mt-1 ml-2.5 md:ml-4 text-neutral-N-30">
              {t('Please Specify')}
            </p>
          </div>
        </div>
      </div>
    </PopupContainer>
  );
}
