import {Filter, ProductFilter} from '@shopify/hydrogen/storefront-api-types';
import {TFunction} from 'i18next';
import React, {useEffect, useState} from 'react';
import {
  AppliedFilter,
  AppliedFilters,
  FILTER_URL_PREFIX,
  PriceRangeFilter,
  getFilterLink,
} from './SortFilter';
import {Link, useLocation, useSearchParams} from '@remix-run/react';
import {AnimatePresence, motion} from 'framer-motion';

type Props = {
  t: TFunction<'translation', undefined>;
  direction: 'ltr' | 'rtl';
  filters: Filter[];
  appliedFilters?: AppliedFilter[];
};

const FiltersDrawerMobile = ({
  t,
  direction,
  filters = [],
  appliedFilters = [],
}: Props) => {
  const [params] = useSearchParams();
  const location = useLocation();
  const [openFilter, setOpenFilter] = useState<{[key: string]: boolean}>({});

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
            className="focus:underline hover:underline block text-sm pb-2 px-3"
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
    <>
      <nav className="z-10 bg-[#f5f5f5] border-t border-b border-neutral-N-80 scrollbar-none overflow-x-auto flex md:hidden p-0 m-0 gap-0 text-neutral-N-30">
        {filters.map((filter: Filter, index) => {
          return (
            <div key={index} className="relative w-full">
              <button
                onClick={() =>
                  setOpenFilter({[filter.label]: !openFilter[filter.label]})
                }
                className="transition-all min-w-24 h-12 text-sm flex items-center justify-center text-neutral-N-30 hover:no-underline hover:bg-neutral-N-92 active:bg-neutral-N-87"
              >
                {t(filter.label)}
              </button>
              <AnimatePresence>
                {openFilter[filter.label] && (
                  <motion.div
                    initial={{
                      height: 0,
                      opacity: 0,
                    }}
                    animate={{
                      height: 'auto',
                      opacity: 1,
                    }}
                    exit={{
                      height: 0,
                      opacity: 0,
                    }}
                    className="min-w-max max-h-33 overflow-y-auto scrollbar-none flex flex-col rounded-b bg-[#F5F5F5]"
                  >
                    <div className="p-4">
                      {filter.values?.map((option, index) => (
                        <div key={index} className="w-fit">
                          {filterMarkup(filter, option)}
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </nav>
      {appliedFilters.length > 0 ? (
        <div className="pb-6 md:hidden">
          <AppliedFilters t={t} filters={appliedFilters} />
        </div>
      ) : null}
    </>
  );
};

export default FiltersDrawerMobile;
