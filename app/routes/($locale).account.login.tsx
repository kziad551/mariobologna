import {defer, redirect, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {
  Link,
  NavigateFunction,
  useLoaderData,
  useNavigate,
  type MetaFunction,
} from '@remix-run/react';
import useWindowDimensions from '~/hooks/useWindowDimensions';
import {useEffect, useRef, useState} from 'react';
import {InputText} from 'primereact/inputtext';
import {FloatLabel} from 'primereact/floatlabel';
import {FcGoogle} from 'react-icons/fc';
import {FaApple, FaFacebookF} from 'react-icons/fa';
import {
  PiMegaphoneSimpleThin,
  PiPercentLight,
  PiStarThin,
} from 'react-icons/pi';
import {CiDeliveryTruck} from 'react-icons/ci';
import {useCustomContext} from '~/contexts/App';
import {tokenCookie, verifyToken} from '~/utils/auth';
import {useTranslation} from 'react-i18next';
import {TFunction} from 'i18next';
import {
  FacebookAuthProvider,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import {
  auth,
  googleProvider,
  // facebookProvider,
  // appleProvider,
} from 'firebaseConfig';
import {addDocument, getUserByEmail} from '~/utils/firestore';

export const meta: MetaFunction = () => {
  return [{title: 'Login'}];
};

export async function loader({context, request}: LoaderFunctionArgs) {
  const cookieHeader = request.headers.get('Cookie');
  const token = await tokenCookie.parse(cookieHeader);

  if (token) {
    const customer = await verifyToken(token, context.storefront);
    if (customer) {
      return redirect('/account');
    }
    return defer(
      {},
      {
        headers: {
          'Set-Cookie': await tokenCookie.serialize('', {maxAge: 0}),
        },
      },
    );
  }
  return defer({});
}

export default function Login() {
  const {t} = useTranslation();
  const navigate = useNavigate();
  const {
    setCurrentPage,
    setShowHeaderFooter,
    setShowBoardingPage,
    direction,
    setPasswordOnce,
    ref,
  } = useCustomContext();
  const {height, width} = useWindowDimensions(50);
  const data = useLoaderData<typeof loader>();
  const [section, setSection] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMeChecked, setRememberMeChecked] = useState(false);
  const [agreementChecked, setAgreementChecked] = useState(false);
  const [preferences, setPreferences] = useState<{[x: string]: boolean}>({});
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setCurrentPage('Login | Sign Up');
    setShowHeaderFooter(true);
    setShowBoardingPage(false);
  }, []);

  const handleSocialSignIn = async (
    provider: GoogleAuthProvider | FacebookAuthProvider,
  ) => {
    setLoading(true);
    setErrorMessage('');
    try {
      const result = await signInWithPopup(auth, provider);
      // console.log('result', result);
      const user = result.user;
      const userDoc = await getUserByEmail(user.email as string);
      const response = await fetch('/api/account/authentication/social_login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({user, userDoc}),
      });
      const data = (await response.json()) as any;
      if (data.error) {
        console.log('data.error', data.error);
        setErrorMessage(data.error);
      } else if (data.success) {
        if (data.isNewUser) {
          await addDocument({
            uid: user.uid,
            email: user.email as string,
            password: data.password,
          });

          setShowBoardingPage(true);
          navigate('/account/onboarding');
          setPasswordOnce(data.password);
          ref.current.openTrigger();
        } else if (userDoc) {
          const response = await fetch('/api/account/authentication/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: userDoc.email,
              password: userDoc.password,
            }),
          });

          const data = (await response.json()) as any;

          if (data.error) {
            navigate(
              `/account/enter_password_once?email=${userDoc.email}&uid=${user.uid}`,
            );
          } else {
            navigate('/account');
          }
        } else {
          navigate(
            `/account/enter_password_once?email=${user.email}&uid=${user.uid}&newDoc=true`,
          );
        }
      }
    } catch (error: any) {
      console.log('error', error);
      setErrorMessage(error.message);
    }
    setLoading(false);
  };

  return (
    <div className="login">
      <div className="flex items-stretch justify-between flex-col lg:flex-row gap-2 sm:gap-56 mx-4 sm:mx-8">
        <div className="flex-1 mt-3 sm:mt-36">
          <div className="flex items-center justify-start mb-5 sm:mb-8">
            <button
              className={`${section === 'login' ? 'font-bold text-3xl sm:text-[45px]' : 'text-2xl sm:text-[36px]'}`}
              onClick={() => setSection('login')}
            >
              {t('Log In')}
            </button>
            <span className="font-bold text-[45px]">&nbsp;|&nbsp;</span>
            <button
              className={`${section === 'register' ? 'font-bold text-3xl sm:text-[45px]' : 'text-2xl sm:text-[36px]'}`}
              onClick={() => setSection('register')}
            >
              {t('Sign Up')}
            </button>
          </div>
          {section === 'login' ? (
            <LoginSection
              t={t}
              direction={direction}
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}
              rememberMeChecked={rememberMeChecked}
              setRememberMeChecked={setRememberMeChecked}
              setSection={setSection}
              navigate={navigate}
              handleSocialSignIn={handleSocialSignIn}
              errorMessage={errorMessage}
              setErrorMessage={setErrorMessage}
              loading={loading}
              setLoading={setLoading}
            />
          ) : (
            <RegisterSection
              t={t}
              direction={direction}
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}
              agreementChecked={agreementChecked}
              setAgreementChecked={setAgreementChecked}
              setSection={setSection}
              preferences={preferences}
              setPreferences={setPreferences}
              navigate={navigate}
              setShowBoardingPage={setShowBoardingPage}
              handleSocialSignIn={handleSocialSignIn}
              errorMessage={errorMessage}
              setErrorMessage={setErrorMessage}
              loading={loading}
              setLoading={setLoading}
            />
          )}
        </div>
        {section === 'login' ? <LoginBanner t={t} /> : <RegisterBanner t={t} />}
      </div>
    </div>
  );
}

type OrSectionType = {
  t: TFunction<'translation', undefined>;
  setSection: React.Dispatch<React.SetStateAction<string>>;
  section: string;
  message: string;
  buttonText: string;
};

const OrSection = ({
  t,
  setSection,
  section,
  message,
  buttonText,
}: OrSectionType) => {
  const handleGoogleSignIn = async () => {
    const searchParams = new URLSearchParams(window.location.search);
    const returnTo = searchParams.get('returnTo') || '/';
    
    // Redirect to Google OAuth
    window.location.href = `/auth/google/login?returnTo=${encodeURIComponent(returnTo)}`;
  };

  return (
    <>
      <div className="flex items-center justify-center gap-7 my-4">
        <div className="flex-1 h-0.25 bg-neutral-N-80"></div>
        <p>{t('Or')}</p>
        <div className="flex-1 h-0.25 bg-neutral-N-80"></div>
      </div>
      <div className="flex items-center justify-center gap-4">
        <button
          onClick={handleGoogleSignIn}
          className="flex items-center justify-center gap-2 border border-neutral-N-80 rounded-lg px-4 py-2 hover:bg-neutral-N-95"
        >
          <FcGoogle size={24} />
          <span>
            {section === 'login' 
              ? t('Login with Google')
              : t('Sign up with Google')}
          </span>
        </button>
      </div>
      <div className="flex items-center justify-center mt-4">
        <p className="text-sm text-neutral-N-60">
          {message}{' '}
          <button
            className="text-primary-P-50 hover:underline"
            onClick={() => setSection(section)}
          >
            {buttonText}
          </button>
        </p>
      </div>
    </>
  );
};

type LoginSectionType = {
  email: string;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
  password: string;
  setPassword: React.Dispatch<React.SetStateAction<string>>;
  rememberMeChecked: boolean;
  setRememberMeChecked: React.Dispatch<React.SetStateAction<boolean>>;
  setSection: React.Dispatch<React.SetStateAction<string>>;
  navigate: NavigateFunction;
  t: TFunction<'translation', undefined>;
  direction: 'ltr' | 'rtl';
  handleSocialSignIn: (
    provider: GoogleAuthProvider | FacebookAuthProvider,
  ) => Promise<void>;
  errorMessage: string;
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

function LoginSection({
  t,
  direction,
  email,
  setEmail,
  password,
  setPassword,
  rememberMeChecked,
  setRememberMeChecked,
  setSection,
  navigate,
  handleSocialSignIn,
  errorMessage,
  setErrorMessage,
  loading,
  setLoading,
}: LoginSectionType) {
  useEffect(() => {
    setErrorMessage('');
  }, [email, password]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    const response = await fetch('/api/account/authentication/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({email, password}),
    });

    const data = (await response.json()) as any;

    if (data.error) {
      setErrorMessage(data.error);
    } else {
      navigate('/account');
    }
    setLoading(false);
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="min-w-full flex flex-col items-stretch justify-start gap-4"
      >
        <div className="flex flex-col items-stretch gap-8">
          <div className={direction === 'rtl' ? 'rtl-container' : ''}>
            <FloatLabel>
              <InputText
                required
                invalid={errorMessage !== ''}
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="!bg-transparent p-4 w-full rounded border border-neutral-N-50 focus:shadow-none focus:outline-none"
              />
              <label className="ml-2 -mt-2" htmlFor="email">
                {t('Email')}
              </label>
            </FloatLabel>
          </div>
          <div className={direction === 'rtl' ? 'rtl-container' : ''}>
            <FloatLabel>
              <InputText
                required
                invalid={errorMessage !== ''}
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="!bg-transparent p-4 w-full rounded border border-neutral-N-50 focus:shadow-none focus:outline-none"
              />
              <label className="ml-2 -mt-2" htmlFor="password">
                {t('Password')}
              </label>
            </FloatLabel>
            <Link to="/account/forgot_password" className="text-xs ml-4">
              {t('Forgot password?')}
            </Link>
          </div>
        </div>
        <label className="w-fit flex items-center justify-self-center gap-2 ml-4 cursor-pointer">
          <input
            type="checkbox"
            name="remember_me"
            id="remember_me"
            className="w-5 h-5 cursor-pointer"
            checked={rememberMeChecked}
            onChange={(e) => setRememberMeChecked(e.target.checked)}
          />
          <span>{t('Remember me?')}</span>
        </label>
        {errorMessage !== '' ? (
          <p className="text-red-600">{errorMessage}</p>
        ) : (
          <></>
        )}
        <input
          type="submit"
          disabled={loading}
          value={!loading ? t('Log In') : t('Processing...')}
          className={`${loading ? 'bg-primary-P-40/50 cursor-not-allowed' : 'bg-primary-P-40 cursor-pointer transition-colors hover:shadow hover:shadow-black/30 hover:bg-primary-P-80 active:shadow-none active:bg-primary-P-90'} text-white py-2.5 text-sm rounded border-transparent`}
        />
      </form>
      <OrSection
        t={t}
        setSection={setSection}
        section="register"
        message={t("Don't have an account?")}
        buttonText={t('Sign Up')}
      />
    </>
  );
}

function LoginBanner({t}: {t: TFunction<'translation', undefined>}) {
  return (
    <div className="flex-1">
      {/* <video width="100%" autoPlay loop muted>
        <source src="/videos/login_banner.mp4" type="video/mp4" />
        {t('Your browser does not support the video tag.')}
      </video> */}
    </div>
  );
}

type RegisterSectionType = {
  email: string;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
  password: string;
  setPassword: React.Dispatch<React.SetStateAction<string>>;
  agreementChecked: boolean;
  setAgreementChecked: React.Dispatch<React.SetStateAction<boolean>>;
  setSection: React.Dispatch<React.SetStateAction<string>>;
  preferences: {[x: string]: boolean};
  setPreferences: React.Dispatch<React.SetStateAction<{[x: string]: boolean}>>;
  navigate: NavigateFunction;
  setShowBoardingPage: React.Dispatch<React.SetStateAction<boolean>>;
  t: TFunction<'translation', undefined>;
  direction: 'ltr' | 'rtl';
  handleSocialSignIn: (
    provider: GoogleAuthProvider | FacebookAuthProvider,
  ) => Promise<void>;
  errorMessage: string;
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

function RegisterSection({
  t,
  direction,
  email,
  setEmail,
  password,
  setPassword,
  agreementChecked,
  setAgreementChecked,
  setSection,
  preferences,
  setPreferences,
  navigate,
  setShowBoardingPage,
  handleSocialSignIn,
  errorMessage,
  setErrorMessage,
  loading,
  setLoading,
}: RegisterSectionType) {
  useEffect(() => {
    setErrorMessage('');
  }, [email, password]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);
    localStorage.setItem('preferences', JSON.stringify(preferences));

    const response = await fetch('/api/account/authentication/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({email, password}),
    });

    const data = (await response.json()) as any;

    if (data.error) {
      setErrorMessage(data.error);
    } else {
      setShowBoardingPage(true);
      navigate('/account/onboarding');
    }
    setLoading(false);
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="min-w-full flex flex-col items-stretch justify-start gap-4"
      >
        <div className="flex flex-col items-stretch gap-8">
          <div className={direction === 'rtl' ? 'rtl-container' : ''}>
            <FloatLabel>
              <InputText
                required
                invalid={errorMessage !== ''}
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="!bg-transparent p-4 w-full rounded border border-neutral-N-50 focus:shadow-none focus:outline-none"
              />
              <label className="ml-2 -mt-2" htmlFor="email">
                {t('Email')}
              </label>
            </FloatLabel>
          </div>
          <div className={direction === 'rtl' ? 'rtl-container' : ''}>
            <FloatLabel>
              <InputText
                required
                invalid={errorMessage !== ''}
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="!bg-transparent p-4 w-full rounded border border-neutral-N-50 focus:shadow-none focus:outline-none"
              />
              <label className="ml-2 -mt-2" htmlFor="password">
                {t('Password')}
              </label>
            </FloatLabel>
            <p className="text-xs mt-1 ml-4 text-neutral-N-30">
              {t('Password must contain: 8 character')}
            </p>
            <p className="text-xs ml-4 text-neutral-N-30">
              {t('Upper and Lower case characters Special character like !&*>')}
            </p>
          </div>
          <div className="flex flex-col items-stretch justify-start gap-1.25 ml-4">
            <p className="text-neutral-N-30 text-sm">
              {t('Shopping preference')}
            </p>
            <div className="flex items-stretch justify-start flex-wrap gap-8">
              <label className="flex items-center justify-center gap-3">
                <input
                  type="checkbox"
                  id="men"
                  name="shopping_preference"
                  value="Men"
                  onChange={(e) =>
                    setPreferences({
                      ...preferences,
                      [e.target.value]: e.target.checked,
                    })
                  }
                  checked={preferences['men']}
                />
                <span>{t('Men')}</span>
              </label>
              <label className="flex items-center justify-center gap-3">
                <input
                  type="checkbox"
                  id="women"
                  name="shopping_preference"
                  value="Women"
                  onChange={(e) =>
                    setPreferences({
                      ...preferences,
                      [e.target.value]: e.target.checked,
                    })
                  }
                  checked={preferences['women']}
                />
                <span>{t('Women')}</span>
              </label>
              <label className="flex items-center justify-center gap-3">
                <input
                  type="checkbox"
                  id="kids"
                  name="shopping_preference"
                  value="Kids"
                  onChange={(e) =>
                    setPreferences({
                      ...preferences,
                      [e.target.value]: e.target.checked,
                    })
                  }
                  checked={preferences['kids']}
                />
                <span>{t('Kids')}</span>
              </label>
              <label className="flex items-center justify-center gap-3">
                <input
                  type="checkbox"
                  id="none"
                  name="shopping_preference"
                  value="Prefer not to say"
                  onChange={(e) =>
                    setPreferences({
                      ...preferences,
                      [e.target.value]: e.target.checked,
                    })
                  }
                  checked={preferences['none']}
                />
                <span>{t('Prefer not to say')}</span>
              </label>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-self-center gap-2 ml-4">
          <input
            type="checkbox"
            name="agreement"
            id="agreement"
            className="w-5 h-5"
            checked={agreementChecked}
            onChange={(e) => setAgreementChecked(e.target.checked)}
          />
          <label htmlFor="agreement">
            {t('I have read and agree to the')}{' '}
            <Link to="/terms" className="hover:underline hover:text-black/80">
              {t('terms and conditions')}
            </Link>
          </label>
        </div>
        {errorMessage !== '' ? (
          <p className="text-red-600">{errorMessage}</p>
        ) : (
          <></>
        )}
        <input
          type="submit"
          disabled={!agreementChecked || loading}
          value={!loading ? t('Sign Up') : t('Processing...')}
          className={`${
            !agreementChecked || loading
              ? 'bg-primary-P-40/50 cursor-not-allowed'
              : 'bg-primary-P-40 cursor-pointer transition-colors hover:shadow hover:shadow-black/30 hover:bg-primary-P-80 active:shadow-none active:bg-primary-P-90'
          } transition-colors text-white py-2.5 text-sm rounded border-transparent`}
        />
      </form>
      <OrSection
        t={t}
        setSection={setSection}
        section="login"
        message={t('Have an account?')}
        buttonText={t('Log In')}
      />
    </>
  );
}

function RegisterBanner({t}: {t: TFunction<'translation', undefined>}) {
  return (
    <div className="flex-1 bg-neutral-N-90 flex flex-col items-center justify-center p-6 sm:p-4">
      <img src="/logo.svg" className="mb-3 w-79" />
      <h1 className="font-bold text-2xl sm:text-5xl mb-6 sm:mb-12">
        {t('Society')}
      </h1>
      <h3 className="sm:text-3xl mb-5 sm:mb-10">
        {t('Create an Account to Access Our Benefits')}
      </h3>
      <div className="flex flex-col items-start justify-start gap-8 sm:gap-16 mb-8 sm:mb-16">
        <div className="flex items-center justify-start gap-5 sm:gap-10">
          <PiPercentLight className="w-10 h-10" />
          <p className="font-bold text-sm sm:text-2xl">
            {t('15% Off Your First Order')}
          </p>
        </div>
        <div className="flex items-center justify-start gap-5 sm:gap-10">
          <PiMegaphoneSimpleThin className="w-10 h-10" />
          <p className="font-bold text-sm sm:text-2xl">{t('Special Offers')}</p>
        </div>
        <div className="flex items-center justify-start gap-5 sm:gap-10">
          <PiStarThin className="w-10 h-10" />
          <p className="font-bold text-sm sm:text-2xl">{t('Reviews')}</p>
        </div>
        <div className="flex items-center justify-start gap-5 sm:gap-10">
          <CiDeliveryTruck className="w-10 h-10" />
          <p className="font-bold text-sm sm:text-2xl">{t('Free Returns')}</p>
        </div>
      </div>
      <h2 className="text-2xl sm:text-5xl font-bold">{t('Sign Up Now !')}</h2>
    </div>
  );
}
