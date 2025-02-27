import type {SyntheticEvent} from 'react';
import {useEffect, useMemo, useState} from 'react';
import {Menu, Disclosure} from '@headlessui/react';
import type {Location} from '@remix-run/react';
import {
  Link,
  useLocation,
  useSearchParams,
  useNavigate,
} from '@remix-run/react';
import useDebounce from 'react-use/esm/useDebounce';
import type {
  Filter,
  ProductFilter,
} from '@shopify/hydrogen/storefront-api-types';

import {IconFilters, IconCaret, IconXMark} from '~/components/Icon';
import {CgClose} from 'react-icons/cg';
import {GiHamburgerMenu} from 'react-icons/gi';
import {GoSearch} from 'react-icons/go';
import {MdArrowRight} from 'react-icons/md';
import {AnimatePresence, motion} from 'framer-motion';
import {FloatLabel} from 'primereact/floatlabel';
import {InputText} from 'primereact/inputtext';
import {TFunction} from 'i18next';
import {filterList} from '~/lib/filter';
import FiltersDrawerMobile from './FiltersDrawerMobile';
import {PredictiveSearchForm} from './Search';

export type AppliedFilter = {
  label: string;
  filter: ProductFilter;
};

export type SortParam =
  | 'price-low-high'
  | 'price-high-low'
  | 'best-selling'
  | 'newest'
  | 'featured';

type Props = {
  handle: string;
  t: TFunction<'translation', undefined>;
  direction: 'ltr' | 'rtl';
  filteredLength: number;
  totalLength: number;
  filters: Filter[];
  appliedFilters?: AppliedFilter[];
  children: React.ReactNode;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};
export const FILTER_URL_PREFIX = 'filter.';

export function SortFilter({
  handle,
  t,
  direction,
  totalLength,
  filteredLength,
  filters,
  appliedFilters = [],
  children,
  isOpen,
  setIsOpen,
}: Props) {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div id="filtering_section" className="px-4 ss:px-8 pt-6 md:pt-36">
      <div className="md:flex hidden items-start justify-between flex-wrap">
        <div className="flex items-start flex-wrap gap-x-16 gap-y-4">
          <div className="w-72">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-2xl font-bold">{t('Filters')}</h2>
              <button onClick={() => setIsOpen(false)} title="Close Filter">
                <CgClose className="w-7 h-7" />
              </button>
              <Link
                to={location.pathname.split('?')[0]}
                className="hover:underline"
                preventScrollReset={true}
              >
                {t('Clear all')}
              </Link>
            </div>
            <div className="flex gap-1 pt-4">
              <span>{t('Showing')}</span>
              <span>{filteredLength}</span>
              <span>{t('of')}</span>
              <span>{totalLength}</span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-4 p-2 bg-neutral-N-92 text-neutral-N-30 rounded-md overflow-hidden">
            <button onClick={() => setIsOpen(true)} title="Open Filter">
              <GiHamburgerMenu className="w-5 h-5" />
            </button>
            <PredictiveSearchForm>
              {({fetchResults, inputRef}) => (
                <div className="flex items-center justify-center gap-4 bg-neutral-N-92">
                  <input
                    name="q"
                    onChange={fetchResults}
                    onFocus={fetchResults}
                    placeholder={t('Search products')}
                    ref={inputRef}
                    type="search"
                    className="bg-transparent outline-none border-none sm:w-64"
                  />
                  <label htmlFor="search_product" className="flex">
                    <button
                      onClick={() => {
                        if (inputRef?.current?.value) {
                          navigate(
                            `/search?handle=${handle}&q=${inputRef.current.value}`,
                          );
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
            {/* <input
              type="search"
              name="search_products"
              id="search_products"
              placeholder={t('Search products')}
              className="bg-transparent outline-none border-none sm:w-64"
            />
            <label htmlFor="search_products">
              <GoSearch className="w-5 h-5" />
            </label> */}
          </div>
        </div>
        <SortMenu t={t} direction={direction} />
      </div>
      <div className="flex flex-col gap-4 md:gap-16 md:flex-row">
        {isOpen && (
          <div className="hidden md:block w-72">
            <FiltersDrawer
              t={t}
              direction={direction}
              filters={filters}
              appliedFilters={appliedFilters}
            />
          </div>
        )}
        <FiltersDrawerMobile
          t={t}
          direction={direction}
          filters={filters}
          appliedFilters={appliedFilters}
        />
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
}

export function FiltersDrawer({
  t,
  direction,
  filters = [],
  appliedFilters = [],
}: Omit<
  Props,
  | 'children'
  | 'isOpen'
  | 'setIsOpen'
  | 'totalLength'
  | 'filteredLength'
  | 'handle'
>) {
  const [params] = useSearchParams();
  const location = useLocation();

  const filterMarkup = (filter: Filter, option: Filter['values'][0]) => {
    switch (filter.type) {
      case 'PRICE_RANGE':
        const priceFilter = params.get(`${FILTER_URL_PREFIX}price`);
        const price = priceFilter
          ? (JSON.parse(priceFilter) as ProductFilter['price'])
          : undefined;
        const min = isNaN(Number(price?.min)) ? undefined : Number(price?.min);
        const max = isNaN(Number(price?.max)) ? undefined : Number(price?.max);

        return (
          <PriceRangeFilter t={t} direction={direction} min={min} max={max} />
        );

      default:
        const to = getFilterLink(option.input as string, params, location);
        return (
          <Link
            className="focus:underline hover:underline"
            prefetch="intent"
            to={to}
            preventScrollReset={true}
          >
            {option.label === 'Out of stock' ? t('Sold out') : t(option.label)}
          </Link>
        );
    }
  };

  return (
    // <div className="flex flex-col gap-5 border-b border-b-black pb-5">
    //   {filters.map((filter, index) => {
    //     console.log('filter', filter)
    //     return (
    //     <div key={index}>
    //       <button
    //         onClick={() =>
    //           setOpenDropdown({
    //             [filter.id]: !openDropdown[filter.id],
    //           })
    //         }
    //         className="flex w-full items-center justify-between py-5 border-t border-t-black"
    //       >
    //         <p className="text-2xl">{filter.label}</p>
    //         <IoIosArrowDown
    //           className={`${
    //             openDropdown[filter.id] ? 'rotate-0' : 'rotate-180'
    //           } ml-2 transition-transform`}
    //         />
    //       </button>
    //       <AnimatePresence>
    //         {openDropdown[filter.id] &&
    //           (!filter.isSize ? (
    //             <motion.div
    //               initial={{
    //                 height: 0,
    //               }}
    //               animate={{
    //                 height: 'auto',
    //               }}
    //               exit={{
    //                 height: 0,
    //               }}
    //               className="overflow-hidden"
    //             >
    //               {filter.dropdownList.map((dropdown, index) => (
    //                 <div
    //                   key={index}
    //                   className="flex gap-3 items-center justify-start py-2"
    //                 >
    //                   <input
    //                     type="checkbox"
    //                     name={filter.checkboxGroup}
    //                     id={`${filter.checkboxGroup}_${index}`}
    //                     checked={
    //                       selectedOptions[filter.title]?.[dropdown.name] ?? false
    //                     }
    //                     onChange={() => {
    //                       setSelectedOptions({
    //                         ...selectedOptions,
    //                         [filter.title]: {
    //                           ...selectedOptions[filter.title],
    //                           [dropdown.name]:
    //                             !selectedOptions[filter.title][dropdown.name],
    //                         },
    //                       });
    //                     }}
    //                   />
    //                   <label htmlFor={`${filter.checkboxGroup}_${index}`}>
    //                     {dropdown.name}
    //                   </label>
    //                 </div>
    //               ))}
    //             </motion.div>
    //           ) : (
    //             <motion.div
    //               initial={{
    //                 height: 0,
    //               }}
    //               animate={{
    //                 height: 'auto',
    //               }}
    //               exit={{
    //                 height: 0,
    //               }}
    //               className="flex flex-wrap gap-2 overflow-hidden"
    //             >
    //               {filter.dropdownList.map((dropdown, index) => (
    //                 <button
    //                   key={index}
    //                   className={`${selectedOptions[filter.title][dropdown.name] ? 'border-transparent text-white bg-secondary-S-90' : 'border-neutral-N-50 text-primary-P-40'} py-2.5 px-6 text-sm rounded-md border`}
    //                   onClick={() => {
    //                     setSelectedOptions({
    //                       ...selectedOptions,
    //                       [filter.title]: {
    //                         ...selectedOptions[filter.title],
    //                         [dropdown.name]:
    //                           !selectedOptions[filter.title][dropdown.name],
    //                       },
    //                     });
    //                   }}
    //                 >
    //                   {dropdown.name}
    //                 </button>
    //               ))}
    //             </motion.div>
    //           ))}
    //       </AnimatePresence>
    //     </div>
    //   )})}
    // </div>
    <>
      <nav className="pb-5 pt-6">
        {appliedFilters.length > 0 ? (
          <div className="pb-6">
            <AppliedFilters t={t} filters={appliedFilters} />
          </div>
        ) : null}
        {filters.map((filter: Filter, index) => {
          return (
            <Disclosure as="div" key={index} className="w-full">
              {({open}) => (
                <>
                  <Disclosure.Button className="flex w-full items-center justify-between py-5 border-t border-t-black text-2xl">
                    <span className="font-medium">{t(filter.label)}</span>
                    <IconCaret direction={open ? 'up' : 'down'} />
                  </Disclosure.Button>
                  <Disclosure.Panel key={filter.id}>
                    <ul key={filter.id}>
                      {filter.values?.map(
                        (option, index) =>
                          (option.label === 'Price' || option.count !== 0) && (
                            <li key={index} className="py-2">
                              {filterMarkup(filter, option)}
                            </li>
                          ),
                      )}
                    </ul>
                  </Disclosure.Panel>
                </>
              )}
            </Disclosure>
          );
        })}
      </nav>
    </>
  );
}

export function AppliedFilters({
  t,
  filters = [],
}: {
  t: TFunction<'translation', undefined>;
  filters: AppliedFilter[];
}) {
  const [params] = useSearchParams();
  const location = useLocation();

  return (
    <>
      <h4 className="pb-4 font-bold">{t('Applied filters')}</h4>
      <div className="flex flex-wrap gap-2">
        {filters.map((filter: AppliedFilter, index) => (
          <Link
            to={getAppliedFilterLink(filter, params, location)}
            className="flex px-2 border border-neutral-N-80 rounded-full"
            key={index}
            preventScrollReset={true}
          >
            <span className="flex-grow">{t(filter.label)}</span>
            <span>
              <IconXMark />
            </span>
          </Link>
        ))}
      </div>
    </>
  );
}

export function getAppliedFilterLink(
  filter: AppliedFilter,
  params: URLSearchParams,
  location: Location,
) {
  const paramsClone = new URLSearchParams(params);
  Object.entries(filter.filter).forEach(([key, value]) => {
    const fullKey = FILTER_URL_PREFIX + key;
    paramsClone.delete(fullKey, JSON.stringify(value));
  });
  return `${location.pathname}?${paramsClone.toString()}`;
}

function getSortLink(
  sort: SortParam,
  params: URLSearchParams,
  location: Location,
) {
  params.set('sort', sort);
  return `${location.pathname}?${params.toString()}`;
}

export function getFilterLink(
  rawInput: string | ProductFilter,
  params: URLSearchParams,
  location: ReturnType<typeof useLocation>,
) {
  const paramsClone = new URLSearchParams(params);
  const newParams = filterInputToParams(rawInput, paramsClone);
  return `${location.pathname}?${newParams.toString()}`;
}

const PRICE_RANGE_FILTER_DEBOUNCE = 500;

export function PriceRangeFilter({
  t,
  direction,
  max,
  min,
}: {
  t: TFunction<'translation', undefined>;
  direction: 'rtl' | 'ltr';
  max?: number;
  min?: number;
}) {
  const location = useLocation();
  const params = useMemo(
    () => new URLSearchParams(location.search),
    [location.search],
  );
  const navigate = useNavigate();

  const [minPrice, setMinPrice] = useState(min);
  const [maxPrice, setMaxPrice] = useState(max);

  useDebounce(
    () => {
      if (minPrice === undefined && maxPrice === undefined) {
        params.delete(`${FILTER_URL_PREFIX}price`);
        navigate(`${location.pathname}?${params.toString()}`, {
          preventScrollReset: true,
        });
        return;
      }

      const price = {
        ...(minPrice === undefined ? {} : {min: minPrice}),
        ...(maxPrice === undefined ? {} : {max: maxPrice}),
      };
      const newParams = filterInputToParams({price}, params);
      navigate(`${location.pathname}?${newParams.toString()}`, {
        preventScrollReset: true,
      });
    },
    PRICE_RANGE_FILTER_DEBOUNCE,
    [minPrice, maxPrice],
  );

  const onChangeMax = (event: SyntheticEvent) => {
    const value = (event.target as HTMLInputElement).value;
    const newMaxPrice = Number.isNaN(parseFloat(value))
      ? undefined
      : parseFloat(value);
    setMaxPrice(newMaxPrice);
  };

  const onChangeMin = (event: SyntheticEvent) => {
    const value = (event.target as HTMLInputElement).value;
    const newMinPrice = Number.isNaN(parseFloat(value))
      ? undefined
      : parseFloat(value);
    setMinPrice(newMinPrice);
  };

  return (
    <div className="flex flex-col gap-8">
      <FloatLabel>
        <InputText
          type="number"
          name="minPrice"
          value={`${minPrice ?? 0}`}
          onChange={onChangeMin}
          className="bg-transparent p-1 md:p-4 w-full rounded border border-neutral-N-50 focus:!shadow-none focus:outline-none"
        />
        <label
          className={`ml-2 -mt-2 ${direction === 'rtl' ? 'rtl:mr-2 rtl:-mt-2 rtl:text-right' : 'ltr:ml-2 ltr:-mt-2 ltr:text-left'}`}
          htmlFor="email"
        >
          {t('From')}
        </label>
      </FloatLabel>
      <FloatLabel>
        <InputText
          type="number"
          name="maxPrice"
          value={`${maxPrice ?? 0}`}
          onChange={onChangeMax}
          className="bg-transparent p-1 md:p-4 w-full rounded border border-neutral-N-50 focus:!shadow-none focus:outline-none"
        />
        <label
          className={`ml-2 -mt-2 ${direction === 'rtl' ? 'rtl:mr-2 rtl:-mt-2 rtl:text-right' : 'ltr:ml-2 ltr:-mt-2 ltr:text-left'}`}
          htmlFor="email"
        >
          {t('To')}
        </label>
      </FloatLabel>
    </div>
  );
}

function filterInputToParams(
  rawInput: string | ProductFilter,
  params: URLSearchParams,
) {
  const input =
    typeof rawInput === 'string'
      ? (JSON.parse(rawInput) as ProductFilter)
      : rawInput;

  Object.entries(input).forEach(([key, value]) => {
    if (params.has(`${FILTER_URL_PREFIX}${key}`, JSON.stringify(value))) {
      return;
    }
    if (key === 'price') {
      // For price, we want to overwrite
      params.set(`${FILTER_URL_PREFIX}${key}`, JSON.stringify(value));
    } else {
      params.append(`${FILTER_URL_PREFIX}${key}`, JSON.stringify(value));
    }
  });

  return params;
}

export default function SortMenu({
  t,
  direction,
}: {
  t: TFunction<'translation', undefined>;
  direction: 'ltr' | 'rtl';
}) {
  const items: {label: string; key: SortParam}[] = [
    {label: 'Featured', key: 'featured'},
    {
      label: 'Price: Low - High',
      key: 'price-low-high',
    },
    {
      label: 'Price: High - Low',
      key: 'price-high-low',
    },
    {
      label: 'Best Selling',
      key: 'best-selling',
    },
    {
      label: 'Newest',
      key: 'newest',
    },
  ];
  const [params] = useSearchParams();
  const location = useLocation();

  const [activeItem, setActiveItem] = useState(
    items.find((item) => item.key === params.get('sort')) ?? items[0],
  );

  useEffect(() => {
    setActiveItem(
      items.find((item) => item.key === params.get('sort')) ?? items[0],
    );
  }, [params]);

  return (
    <Menu as="div" className="relative z-40">
      <div className="flex flex-col items-stretch">
        <Menu.Button className="flex items-center justify-between px-3 py-4 gap-3">
          <p className="px-2">
            <span className="px-2 font-medium">{t('Sort by')}:</span>
            {activeItem && <span>{t(activeItem.label)}</span>}
          </p>
          <MdArrowRight
            className={`${direction === 'rtl' ? 'rotate-180' : ''} w-6 h-6`}
          />
        </Menu.Button>
        <div className="bg-black h-[1px] my-2" />
      </div>

      <Menu.Items
        as="nav"
        className="absolute right-0 left-0 flex flex-col p-4 text-right rounded-b bg-[#F5F5F5]"
      >
        {items.map((item, index) => (
          <Menu.Item key={index}>
            {() => (
              <Link
                className={`block text-sm pb-2 px-3 ${
                  (activeItem || items[0]).key === item.key
                    ? 'font-bold'
                    : 'font-normal'
                }`}
                to={getSortLink(item.key, params, location)}
                preventScrollReset={true}
              >
                {t(item.label)}
              </Link>
            )}
          </Menu.Item>
        ))}
      </Menu.Items>
    </Menu>
  );
}
