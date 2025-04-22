import {Link, NavLink, useLocation, useNavigate} from '@remix-run/react';
import {useEffect, useState} from 'react';
import type {HeaderQuery} from 'storefrontapi.generated';
import type {LayoutProps} from './Layout';
import {useRootLoaderData} from '~/root';
import {Image} from '@shopify/hydrogen';
import {GoSearch} from 'react-icons/go';
import useWindowDimensions from '~/hooks/useWindowDimensions';
import {useCustomContext} from '~/contexts/App';
import {PredictiveSearchForm} from './Search';
import {useTranslation} from 'react-i18next';
import {TFunction} from 'i18next';
import CurrencyDropdown from './Currency';
import {MenuItem} from '@shopify/hydrogen/storefront-api-types';
import {AnimatePresence, motion} from 'framer-motion';
import {useInView} from 'react-intersection-observer';
import {useWishlist} from '~/contexts/WishList';
import {MdArrowBack} from 'react-icons/md';
import {Dropdown, DropdownProps} from 'primereact/dropdown';

type HeaderProps = Pick<LayoutProps, 'header' | 'cart' | 'submenus'>;

function activeLinkStyle({
  isActive,
  isPending,
}: {
  isActive: boolean;
  isPending: boolean;
}) {
  return {
    fontWeight: isActive ? 'bold' : undefined,
    color: isPending ? 'grey' : 'black',
  };
}

export function Header({header, cart, submenus}: HeaderProps) {
  const {currentPage, language, setLanguage, direction} = useCustomContext();
  const {t} = useTranslation();
  const shop = header?.shop;
  const menu = header?.menu;
  const {width, height} = useWindowDimensions(50);
  const navigate = useNavigate();
  const {wishlist} = useWishlist();
  const location = useLocation();
  const {ref, inView} = useInView();

  const [showHeaderMenu, setShowHeaderMenu] = useState(true);
  const [showHeaderSearch, setShowHeaderSearch] = useState(true);
  const [isVisible, setIsVisible] = useState(true);

  type LangType = {
    value: string;
    name: string;
  };

  const mobileLangs: LangType[] = [
    {value: 'en', name: 'EN'},
    {value: 'ar', name: 'AR'},
  ];

  const langs: any[] = [
    {value: 'en', name: 'English'},
    {value: 'ar', name: 'العربية'},
  ];

  const selectedLanguageTemplate = (option: LangType, props: DropdownProps) => {
    if (option) {
      return <p>{option.name}</p>;
    }

    return <span>{props.placeholder}</span>;
  };

  const languageOptionTemplate = (option: LangType) => {
    return <p>{option.name}</p>;
  };

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
    if (location.pathname === '/') {
      setShowHeaderMenu(true);
    } else {
      setShowHeaderMenu(false);
    }
    if (location.pathname !== '/search') {
      setShowHeaderSearch(true);
    } else {
      setShowHeaderSearch(false);
    }
  }, [location]);
  return (
    <header
      id="main-header"
      ref={ref}
      className="z-50 sticky top-0 transition-all duration-500 flex flex-col items-stretch gap-7 bg-[#F5F5F5]"
      style={{
        transform: isVisible
          ? 'translateY(0)'
          : width < 1024
            ? 'translateY(-130%)'
            : 'translateY(-100%)',
      }}
    >
      <div className="lg:flex hidden justify-between items-center px-8 pt-10 gap-4">
        <div className="flex-1 flex items-center justify-start gap-4">
          <Dropdown
            id="language"
            value={language}
            onChange={(e) => setLanguage(e.value)}
            options={langs}
            optionLabel="name"
            className="flex items-center gap-2 px-3 py-2.5 !border-none !shadow-none !bg-transparent hover:!bg-neutral-N-92 active:!bg-neutral-N-87 transition-all rounded-md"
            checkmark={true}
            highlightOnSelect={false}
          />
          <CurrencyDropdown />
          <Link
            to="/search"
            className="bg-transparent hover:bg-neutral-N-92 active:!bg-neutral-N-87 transition-colors py-2.5 px-3 rounded-md"
          >
            <GoSearch className="w-6 h-6" />
          </Link>
        </div>
        <div className="relative flex-1 items-center justify-center">
          <NavLink className="w-fit mx-auto block" prefetch="intent" to="/" end>
            {shop?.brand?.logo?.image?.url && (
              <img src={shop.brand.logo.image.url} className="w-90" />
            )}
          </NavLink>
        </div>
        <div className="flex-1 gap-4 flex text-neutral-N-30 items-center justify-end">
          <NavLink
            prefetch="intent"
            to="/account/login"
            style={activeLinkStyle}
            className="text-neutral-N-30 px-3 py-2.5 hover:no-underline hover:bg-neutral-N-92 active:bg-neutral-N-87 focus:bg-neutral-N-87 transition-all rounded-md"
          >
            {t('Account')}
          </NavLink>
          <NavLink
            to="/wishlist"
            className="px-3 py-2.5 text-nowrap hover:no-underline hover:bg-neutral-N-92 active:bg-neutral-N-87 focus:bg-neutral-N-87 transition-all rounded-md"
          >
            {direction === 'ltr'
              ? `${t('Wishlist')} ${wishlist.length}`
              : `${t('Wishlist')} ${wishlist.length}`}
          </NavLink>
          <CartToggle cart={cart} t={t} direction={direction} />
        </div>

        {/* <HeaderCtas
          cart={cart}
          language={language}
          setLanguage={setLanguage}
          t={t}
          direction={direction}
        /> */}
      </div>

      {/* MOBILE HEADER */}
      <div className="relative lg:hidden w-full h-16 px-4 ss:px-8 flex shadow items-center justify-between bg-[#F5F5F5]">
        {currentPage === '' ? (
          <>
            <NavLink
              prefetch="intent"
              to="/"
              end
              className="absolute left-1/2 -translate-x-1/2"
            >
              {shop?.brand?.logo?.image?.url && (
                <Image
                  data={{url: shop.brand.logo.image.url}}
                  sizes="100vw"
                  className="min-w-30 xs:min-w-36"
                />
              )}
            </NavLink>
            <div className="flex flex-wrap gap-0.5">
              <CurrencyDropdown showLabel={false} />
              <Dropdown
                id="language_2"
                value={language}
                onChange={(e) => setLanguage(e.value)}
                options={mobileLangs}
                optionLabel="name"
                className="flex items-center gap-2 px-1 xs:px-3 py-2.5 !border-none !shadow-none !bg-transparent hover:!bg-neutral-N-92 active:!bg-neutral-N-87 transition-all rounded-md"
                valueTemplate={selectedLanguageTemplate}
                itemTemplate={languageOptionTemplate}
              />
            </div>
          </>
        ) : (
          <>
            <button onClick={() => navigate(-1)}>
              <MdArrowBack
                className={`${direction === 'ltr' ? '' : 'rotate-180'} w-5 h-5`}
              />
            </button>
            <h1 className="absolute left-1/2 -translate-x-1/2 text-lg xs:text-2xl">
              {t(currentPage)}
            </h1>
          </>
        )}
        {showHeaderSearch ? (
          <NavLink to="/search">
            <GoSearch className="w-5 h-5" />
          </NavLink>
        ) : (
          <></>
        )}
      </div>

      {/* THE NAV MENU (MEN, WOMEN, ...) */}
      {width < 1024 ? (
        showHeaderMenu ? (
          <HeaderMenu
            t={t}
            direction={direction}
            menu={menu}
            submenus={submenus}
            primaryDomainUrl={shop?.primaryDomain.url || ''}
          />
        ) : (
          <></>
        )
      ) : (
        <HeaderMenu
          t={t}
          direction={direction}
          menu={menu}
          submenus={submenus}
          primaryDomainUrl={shop?.primaryDomain.url || ''}
        />
      )}
    </header>
  );
}

export function HeaderMenu({
  t,
  direction,
  menu,
  submenus,
  primaryDomainUrl,
}: {
  t: TFunction<'translation', undefined>;
  direction: 'rtl' | 'ltr';
  menu: HeaderProps['header']['menu'] | null;
  submenus: LayoutProps['submenus'];
  primaryDomainUrl: string;
}) {
  const {publicStoreDomain} = useRootLoaderData();
  const [customURL, setCustomURL] = useState('');
  const [openMegaMenu, setOpenMegaMenu] = useState<{[x: string]: boolean}>({});
  const [selectedMegaMenu, setSelectedMegaMenu] = useState('');
  const [subMenuItems, setSubMenuItems] = useState<MenuItem[]>([]);

  const handleOpenSubMenu = (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    item: any,
    url: string,
  ) => {
    e.preventDefault();
    if (
      ['Men', 'Women', 'Kids', 'Designers'].includes(item.title) &&
      item.items.length > 0
    ) {
      if (item.title === 'Designers') {
        const designersSubMenu = (submenus as any).designers || item.items;
        setSubMenuItems(designersSubMenu);
      } else {
        const key = item.title.toLowerCase() as keyof LayoutProps['submenus'];
        if (key in submenus) {
          setSubMenuItems(submenus[key]);
        }
      }
      setSelectedMegaMenu(item.title);
      setCustomURL(url);
      setOpenMegaMenu({[item.title]: true});
    }
  };

  const rightSections: {
    [key: string]: {imgSrc: string; label: string; linkShop: string};
  } = {
    Men: {
      imgSrc: 'men.jpg',
      label: t("Men's Collection Spring"),
      linkShop: '/collections/men',
    },
    Women: {
      imgSrc: 'women.jpg',
      label: t("Women's Collection Summer"),
      linkShop: '/collections/women',
    },
    Kids: {
      imgSrc: 'kids.jpeg',
      label: t("Kids' Collection"),
      linkShop: '/collections/kids',
    },
    Designers: {
      imgSrc: 'designers.jpg',
      label: t('Explore our Designers'),
      linkShop: '/designers',
    },
  };

  return (
    <div>
      <nav
        className={`z-50 bg-[#f5f5f5] rounded-md scrollbar-none lg:rounded-none lg:shadow-none lg:relative lg:top-auto lg:left-auto lg:right-auto overflow-auto shadow-md top-17.5 left-3 right-3 absolute flex sm:justify-center p-0 m-0 gap-0 text-neutral-N-30`}
        role="navigation"
      >
        {menu &&
          menu.items.map((item) => {
            if (!item.url) return null;

            const url =
              item.url.includes('myshopify.com') ||
              item.url.includes(publicStoreDomain) ||
              item.url.includes(primaryDomainUrl)
                ? new URL(item.url).pathname
                : item.url;

            return (
              <NavLink
                className={({isActive, isPending}) =>
                  `${isActive ? 'text-primary-P-40 after:h-1 after:bg-primary-P-40 after:absolute after:w-full after:bottom-0 after:rounded-t-xl relative' : ''} ${isPending ? 'text-neutral-N-80' : ''} text-nowrap transition-all px-6 py-3 flex items-center justify-center text-neutral-N-30 hover:no-underline hover:bg-neutral-N-92 active:bg-neutral-N-87`
                }
                end
                key={item.id}
                onMouseEnter={(e) =>
                  handleOpenSubMenu(
                    e,
                    item,
                    item.title !== 'Designers' ? url : '/designers'
                  )
                }
                onMouseLeave={() => setOpenMegaMenu({})}
                to={item.title !== 'Designers' ? url : '/designers'}
              >
                {t(`${item.title}`)}
              </NavLink>
            );
          })}
      </nav>
      <AnimatePresence>
        {openMegaMenu[selectedMegaMenu] && (
          <motion.div
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0, transition: {delay: 0.25, ease: 'easeInOut'}}}
            onMouseEnter={() => setOpenMegaMenu({[selectedMegaMenu]: true})}
            onMouseLeave={() => setOpenMegaMenu({})}
            className="z-50 absolute top-full left-0 right-0 pt-8 pb-2 px-16 bg-[#F5F5F5] hidden lg:flex items-start justify-between gap-16 shadow-xl shadow-black/30"
          >
            <div className="flex gap-8 w-full items-stretch justify-start">
              {subMenuItems.length > 0 &&
                subMenuItems.map((item, index) => {
                  const URL = (item.url || '').split('?')[1]; 
                  const fullURL = (customURL || '') + '?' + (URL || '') + '#filtering_section';
                  const designerHandle = (item as any).handle;
                  const designerLink = designerHandle ? `/products?designer=${designerHandle}` : '/designers';

                  return (
                    <div
                      key={index}
                      className="flex-1 flex flex-col items-start gap-4"
                    >
                      <NavLink
                        to={
                          selectedMegaMenu === 'Designers'
                            ? item.title === 'All Designers'
                              ? '/designers'
                              : designerLink
                            : fullURL
                        }
                        className={`${item.title === 'All Designers' ? 'self-center font-semibold' : 'font-semibold'} text-xs hover:underline`}
                        onClick={() => setOpenMegaMenu({})}
                      >
                        {t(item.title)}
                      </NavLink>
                      <div
                        className={`${selectedMegaMenu === 'Designers' ? 'w-full' : 'w-max'} flex flex-col flex-wrap max-h-67.5 items-start gap-y-4 gap-x-8`}
                      >
                        {item.items && item.items.map((sub_item, index) => {
                          const subItemURL = (sub_item.url || '').split('?')[1];
                          let subItemFullURL = '';
                          
                          if (selectedMegaMenu === 'Designers') {
                            const designerName = sub_item.title.toLowerCase().replace(/ /g, '+');
                            subItemFullURL = `/products?designer=${designerName}`;
                          } else {
                            subItemFullURL = (customURL || '') + '?' + (subItemURL || '');
                            subItemFullURL += '#filtering_section';
                          }

                          return (
                            <NavLink
                              key={index}
                              to={subItemFullURL}
                              className="text-sm hover:underline"
                              data-discover="true"
                              onClick={() => setOpenMegaMenu({})}
                            >
                              {t(sub_item.title)}
                            </NavLink>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
            </div>
            {selectedMegaMenu && rightSections[selectedMegaMenu] && (
              <div className="flex flex-col gap-2 items-start">
                <img
                  src={`/images/mega menus/${rightSections[selectedMegaMenu].imgSrc}`}
                  alt="collection image"
                  className="w-70 h-60 rounded object-cover object-center"
                />
                <h2 className='text-sm'>{rightSections[selectedMegaMenu].label}</h2>
                <NavLink
                  to={rightSections[selectedMegaMenu].linkShop}
                  onClick={() => setOpenMegaMenu({})}
                  className="bg-primary-P-40 text-white border text-sm py-2.5 px-6 border-primary-P-40 rounded-md"
                >
                  {t('Shop Now')}
                </NavLink>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function HeaderCtas({
  cart,
  language,
  setLanguage,
  t,
  direction,
}: Pick<HeaderProps, 'cart'> & {
  language: string;
  setLanguage: React.Dispatch<React.SetStateAction<string>>;
  t: TFunction<'translation', undefined>;
  direction: 'rtl' | 'ltr';
}) {
  const {wishlist} = useWishlist();
  return (
    <nav
      className="gap-4 flex text-neutral-N-30 items-center"
      role="navigation"
    >
      <SearchToggle direction={direction} t={t} />
      <NavLink
        prefetch="intent"
        to="/account/login"
        style={activeLinkStyle}
        className="text-neutral-N-30 px-3 py-2.5 hover:no-underline hover:bg-neutral-N-92 active:bg-neutral-N-87 focus:bg-neutral-N-87 transition-all rounded-md"
      >
        {t('Account')}
      </NavLink>
      <CurrencyDropdown />
      <NavLink
        to="/wishlist"
        className="px-3 py-2.5 text-nowrap hover:no-underline hover:bg-neutral-N-92 active:bg-neutral-N-87 focus:bg-neutral-N-87 transition-all rounded-md"
      >
        {direction === 'ltr'
          ? `${t('Wishlist')} ${wishlist.length}`
          : `${t('Wishlist')} ${wishlist.length}`}
      </NavLink>
      <CartToggle cart={cart} t={t} direction={direction} />
      <LanguageToggle lang={language} setLang={setLanguage} />
    </nav>
  );
}

function SearchToggle({
  t,
  direction,
}: {
  t: TFunction<'translation', undefined>;
  direction: 'rtl' | 'ltr';
}) {
  const navigate = useNavigate();

  return (
    <PredictiveSearchForm>
      {({fetchResults, inputRef}) => (
        <div className="flex items-center justify-center gap-4 p-2 bg-neutral-N-92 text-neutral-N-30 rounded-md overflow-hidden">
          <input
            name="q"
            onChange={fetchResults}
            onFocus={fetchResults}
            placeholder={t('Search products')}
            ref={inputRef}
            type="search"
            className="bg-transparent outline-none border-none w-34 xl:hover:w-64 transition-all xl:focus-within:w-64"
          />
          <label htmlFor="search_product" className="flex">
            <button
              onClick={() => {
                if (inputRef?.current?.value) {
                  navigate(`/search?q=${inputRef.current.value}`);
                } else {
                  navigate(`/search`);
                }
              }}
            >
              <GoSearch className="w-5 h-5" />
            </button>
          </label>
        </div>
      )}
    </PredictiveSearchForm>
  );
}

function CartBadge({
  count,
  t,
  direction,
}: {
  count: number;
  t: TFunction<'translation', undefined>;
  direction: 'rtl' | 'ltr';
}) {
  return (
    <NavLink
      className="px-3 py-2.5 hover:no-underline hover:bg-neutral-N-92 active:bg-neutral-N-87 focus:bg-neutral-N-87 transition-all rounded-md"
      to="/bag"
      style={{whiteSpace: 'nowrap'}}
    >
      {direction === 'ltr' ? `${t('Bag')} ${count}` : `${t('Bag')} ${count}`}
    </NavLink>
  );
}

function CartToggle({
  cart,
  t,
  direction,
}: Pick<HeaderProps, 'cart'> & {
  t: TFunction<'translation', undefined>;
  direction: 'rtl' | 'ltr';
}) {
  const uniqueItemsCount = cart?.lines?.nodes?.length || 0;
  return (
    <CartBadge t={t} direction={direction} count={uniqueItemsCount} />
  );
}

function LanguageToggle({
  lang,
  setLang,
}: {
  lang: string;
  setLang: React.Dispatch<React.SetStateAction<string>>;
}) {
  return (
    <div className="flex rounded-full overflow-hidden border border-neutral-N-50">
      <button
        className={`${
          lang == 'en'
            ? 'text-white bg-secondary-S-90 hover:bg-secondary-S-80 active:bg-secondary-S-40'
            : 'text-neutral-N-10 bg-transparent hover:no-underline hover:bg-neutral-N-92 active:bg-neutral-N-87'
        } flex items-center gap-2 justify-center w-28 px-3 py-2.5 transition-all`}
        onClick={() => setLang('en')}
      >
        {lang === 'en' ? <img src="/icons/check.svg" alt="" /> : <></>}
        English
      </button>
      <button
        className={`${
          lang === 'ar'
            ? 'text-white bg-secondary-S-90 hover:bg-secondary-S-80 active:bg-secondary-S-40'
            : 'text-neutral-N-10 bg-transparent hover:no-underline hover:bg-neutral-N-92 active:bg-neutral-N-87'
        } flex items-center gap-2 justify-center w-28 px-3 py-2.5 transition-all`}
        onClick={() => setLang('ar')}
      >
        {lang === 'ar' ? <img src="/icons/check.svg" alt="" /> : <></>}
        العربية
      </button>
    </div>
  );
}
