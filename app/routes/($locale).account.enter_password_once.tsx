import {
  NavLink,
  useLocation,
  useNavigate,
  type MetaFunction,
} from '@remix-run/react';
import useWindowDimensions from '~/hooks/useWindowDimensions';
import {useEffect, useState} from 'react';
import {InputText} from 'primereact/inputtext';
import {FloatLabel} from 'primereact/floatlabel';
import {useCustomContext} from '~/contexts/App';
import {useTranslation} from 'react-i18next';
import {RiArrowLeftLine} from 'react-icons/ri';
import {addDocument, updateDocument} from '~/utils/firestore';

export const meta: MetaFunction = () => {
  return [{title: 'Enter Password Once'}];
};

export default function EnterPasswordOnce() {
  const {t} = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const {setCurrentPage, setShowHeaderFooter, direction} = useCustomContext();
  const {height, width} = useWindowDimensions(50);
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [uid, setUid] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  useEffect(() => {
    setCurrentPage('Enter Password Once');
    setShowHeaderFooter(true);
    const searchParams = new URLSearchParams(location.search);
    const email = searchParams.get('email');
    const uid = searchParams.get('uid');
    if (!email || !uid) {
      navigate('/account/login');
    } else {
      setEmail(email);
      setUid(uid);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingSubmit(true);
    setErrorMessage('');
    try {
      const response = await fetch('/api/account/authentication/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = (await response.json()) as any;

      if (data.error) {
        setErrorMessage(data.error);
      } else {
        const searchParams = new URLSearchParams(location.search);
        const newDoc = searchParams.get('newDoc');
        if (newDoc) {
          await addDocument({uid, email, password});
        } else {
          await updateDocument({uid, password});
        }
        navigate('/account');
      }
    } catch (error: any) {
      setErrorMessage(error.message);
    }
    setLoadingSubmit(false);
  };

  return (
    <div className="reset_password">
      <div
        className={`${direction === 'ltr' ? 'md:ml-93.5' : ' md:mr-93.5'} flex flex-col items-start justify-start px-8 pt-3 md:pt-14 pb-14 md:pb-40`}
      >
        <NavLink
          to="/account/login"
          className={`${direction === 'ltr' ? 'pr-4' : ' pl-4'} flex items-center justify-start gap-2 py-2.5`}
        >
          <RiArrowLeftLine
            className={`${direction === 'rtl' ? 'rotate-180' : ''} w-4 h-4`}
          />
          <span className="text-sm">{t('Back to Login page')}</span>
        </NavLink>
        <div className="flex flex-col mb-5.5 md:my-8">
          <h1 className="text-2xl">{t('Enter Password Once')}</h1>
          <p className="text-primary-P-80 text-xs sm:text-sm font-semibold leading-none">
            {t('This is a one time operation')}
          </p>
        </div>
        <form
          onSubmit={handleSubmit}
          className="min-w-full xs:min-w-67 flex flex-col gap-2"
        >
          <div className={direction === 'rtl' ? 'rtl-container' : ''}>
            <FloatLabel>
              <InputText
                required
                id="password"
                type="password"
                value={password ?? ''}
                onChange={(e) => setPassword(e.target.value)}
                className="!bg-transparent p-4 w-full rounded border border-neutral-N-50 focus:shadow-none focus:outline-none"
              />
              <label className="ml-2 -mt-2" htmlFor="code">
                {t('Password')}
              </label>
            </FloatLabel>
          </div>
          <input
            type="submit"
            value={!loadingSubmit ? t('Log In') : t('Processing...')}
            disabled={loadingSubmit}
            className={`${loadingSubmit ? 'opacity-50' : ''} cursor-pointer text-balance py-2.5 px-6 border-transparent text-white bg-primary-P-40 rounded font-medium text-sm`}
          />
        </form>
        {errorMessage !== '' ? (
          <p className="text-red-600 text-sm">{errorMessage}</p>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}
