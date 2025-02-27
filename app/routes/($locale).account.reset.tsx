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
import {updateDocumentUsingEmail} from '~/utils/firestore';

export const meta: MetaFunction = () => {
  return [{title: 'Reset Password'}];
};

export default function ResetPassword() {
  const {t} = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const {setCurrentPage, setShowHeaderFooter, direction} = useCustomContext();
  const {height, width} = useWindowDimensions(50);
  const [id, setId] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  useEffect(() => {
    setCurrentPage('Reset Password');
    setShowHeaderFooter(true);
    const searchParams = new URLSearchParams(location.search);
    const id = searchParams.get('id');
    const email = searchParams.get('email');
    if (!email || !id) {
      navigate('/account/forgot_password');
    } else {
      setId(id);
      setEmail(email);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingSubmit(true);
    setMessage('');
    try {
      const response = await fetch('/api/account/reset_password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({id, password, confirmPassword}),
      });

      const result: any = await response.json();
      console.log('result', result);

      if (result.success) {
        setMessage('Password reset successfully.');
        await updateDocumentUsingEmail(email, password);
        navigate('/account/login', {replace: true});
      } else {
        throw new Error(result.error);
      }
    } catch (error: any) {
      setMessage(error.message);
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
        <h1 className="text-2xl mb-5.5 md:my-8">{t('Reset Password')}</h1>
        <form
          onSubmit={handleSubmit}
          className="min-w-full xs:min-w-67 flex flex-col gap-2"
        >
          <div className={direction === 'rtl' ? 'rtl-container' : ''}>
            <FloatLabel>
              <InputText
                required
                id="password"
                type="text"
                value={password ?? ''}
                onChange={(e) => setPassword(e.target.value)}
                className="!bg-transparent p-4 w-full rounded border border-neutral-N-50 focus:shadow-none focus:outline-none"
              />
              <label className="ml-2 -mt-2" htmlFor="code">
                {t('Password')}
              </label>
            </FloatLabel>
          </div>
          <div className={direction === 'rtl' ? 'rtl-container' : ''}>
            <FloatLabel>
              <InputText
                required
                id="password_confirmation"
                type="password"
                invalid={
                  confirmPassword !== undefined && password !== confirmPassword
                }
                value={confirmPassword ?? ''}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="!bg-transparent p-4 w-full rounded border border-neutral-N-50 focus:shadow-none focus:outline-none"
              />
              <label className="ml-2 -mt-2" htmlFor="code">
                {t('Confirm Password')}
              </label>
            </FloatLabel>
          </div>
          <input
            type="submit"
            value={!loadingSubmit ? t('Save') : t('Saving...')}
            disabled={loadingSubmit}
            className={`${loadingSubmit ? 'opacity-50' : ''} text-balance py-2.5 px-6 border-transparent text-white bg-primary-P-40 rounded font-medium text-sm`}
          />
        </form>
        {message !== '' ? <p className="text-sm">{message}</p> : <></>}
      </div>
    </div>
  );
}
