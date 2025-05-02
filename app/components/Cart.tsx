import {CartForm, Image, Money} from '@shopify/hydrogen';
import type {
  CartLineUpdateInput,
  CurrencyCode,
} from '@shopify/hydrogen/storefront-api-types';
import {Link} from '@remix-run/react';
import type {CartApiQueryFragment} from 'storefrontapi.generated';
import {useVariantUrl} from '~/lib/variants';
import {TFunction} from 'i18next';
import {useCustomContext} from '~/contexts/App';
import {useEffect, useState} from 'react';

type CartLine = CartApiQueryFragment['lines']['nodes'][0];

/* -------------------------------------------------------------------------- */
/*  CART-LINE QTY                                                             */
/* -------------------------------------------------------------------------- */
export function CartLineQuantity({
  t,
  id,
  quantity,
  merchandise,
}: {
  t: TFunction<'translation', undefined>;
  id: string;
  quantity: number;
  merchandise?: any;
}) {
  if (typeof quantity === 'undefined') return null;

  /* ---------- LIMIT LOGIC ------------------------------------------------- */
  // fallback limit in case `quantityAvailable` is not returned by the Storefront API
  const HARD_LIMIT = 5;

  // quantity reported by Shopify (if present) otherwise fallback to HARD_LIMIT
  const availableQty =
    merchandise?.quantityAvailable != null
      ? merchandise.quantityAvailable
      : HARD_LIMIT;

  const outOfStock = merchandise && !merchandise.availableForSale;
  const reachedMax = quantity >= availableQty || outOfStock;

  /* ---------- BUTTON STATE & HANDLERS ------------------------------------- */
  const prevQuantity = Math.max(0, quantity - 1);
  const nextQuantity = quantity + 1;

  const handleIncrement = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (reachedMax) {
      e.preventDefault();
      e.stopPropagation();
      alert(t('No more items in stock'));
    }
  };

  const commonBtnClasses =
    'overflow-hidden rounded flex items-center justify-center h-6 w-6 ss:w-8 ss:h-8 p-2.5 text-white focus:outline-none';

  /* ------------------------------------------------------------------------ */
  return (
    <div className="flex items-center xs:justify-center gap-0.5">
      {/* ––––– DECREMENT ––––– */}
      <CartLineUpdateButton lines={[{id, quantity: prevQuantity}]}>
        <button
          aria-label={t('Decrease quantity')}
          disabled={quantity <= 1}
          value={prevQuantity}
          type="submit"
          className={`${commonBtnClasses} bg-secondary-S-90 disabled:opacity-50 active:bg-secondary-S-80`}
        >
          <span className="text-2xl ss:text-3xl">&#8722;</span>
        </button>
      </CartLineUpdateButton>

      {/* quantity read-out */}
      <span className="flex items-center justify-center w-6 h-6 ss:w-8 ss:h-8 text-center">
        {quantity}
      </span>

      {/* ––––– INCREMENT ––––– */}
      <CartLineUpdateButton lines={[{id, quantity: nextQuantity}]}>
        <button
          aria-label={t('Increase quantity')}
          onClick={handleIncrement}
          disabled={reachedMax}
          value={nextQuantity}
          type="submit"
          /* visual feedback when max reached */
          className={`${commonBtnClasses} ${
            reachedMax ? 'bg-gray-500 opacity-50 cursor-not-allowed' : 'bg-secondary-S-90 active:bg-secondary-S-80'
          }`}
          title={
            reachedMax
              ? t('No more items in stock')
              : t('Increase quantity')
          }
        >
          <span className="text-2xl ss:text-3xl">&#43;</span>
        </button>
      </CartLineUpdateButton>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  PRICE COMPONENT                                                           */
/* -------------------------------------------------------------------------- */
export function CartLinePrice({
  cost,
  priceType = 'regular',
}: {
  cost: CartLine['cost'];
  priceType?: 'regular' | 'compareAt';
}) {
  const {currency} = useCustomContext();
  if (!cost.amountPerQuantity || !cost.totalAmount) return null;

  const moneyV2 =
    priceType === 'regular'
      ? cost.totalAmount
      : cost.compareAtAmountPerQuantity;

  if (!moneyV2) return null;

  return (
    <Money
      className="text-sm ss:text-base"
      data={{
        amount: (
          parseFloat(moneyV2.amount) * currency.exchange_rate
        ).toString(),
        currencyCode: currency.currency['en'] as CurrencyCode,
      }}
    />
  );
}

/* -------------------------------------------------------------------------- */
/*  WRAPPERS                                                                  */
/* -------------------------------------------------------------------------- */
function CartLineUpdateButton({
  children,
  lines,
}: {
  children: React.ReactNode;
  lines: CartLineUpdateInput[];
}) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.LinesUpdate}
      inputs={{lines}}
    >
      {children}
    </CartForm>
  );
}

function CartLineRemoveButton({
  lineIds,
  t,
}: {
  lineIds: string[];
  t: TFunction<'translation', undefined>;
}) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.LinesRemove}
      inputs={{lineIds}}
    >
      <button type="submit" className="text-xs ss:text-base mx-2">
        {t('Remove')}
      </button>
    </CartForm>
  );
}
