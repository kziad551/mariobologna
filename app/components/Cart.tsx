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

type CartLine = CartApiQueryFragment['lines']['nodes'][0];

/* -------------------------------------------------------------------------- */
/*  CART-LINE QUANTITY HANDLING                                               */
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
  merchandise?: CartLine['merchandise'];
}) {
  if (typeof quantity === 'undefined') return null;

  /* ---------- DETERMINE LIMIT -------------------------------------------- */
  // 1. real stock if Shopify returns it
  // 2. fallback hard limit (prevents infinite adding during dev if
  //    quantityAvailable is null for some reason)
  const HARD_LIMIT = 5;
  const availableQty =
    typeof (merchandise as any)?.quantityAvailable === 'number'
      ? (merchandise as any).quantityAvailable
      : HARD_LIMIT;

  const outOfStock = merchandise && !(merchandise as any).availableForSale;
  const reachedMax = quantity >= availableQty || outOfStock;

  /* ---------- VALUES FOR UPDATE FORMS ------------------------------------ */
  const prevQuantity = Math.max(0, quantity - 1);
  const nextQuantity = quantity + 1;

  const btnBase =
    'overflow-hidden rounded flex items-center justify-center h-6 w-6 ss:w-8 ss:h-8 p-2.5 text-white focus:outline-none';

  /* ---------------------------------------------------------------------- */
  return (
    <div className="flex items-center xs:justify-center gap-0.5">
      {/* ––– DECREMENT ––– */}
      <CartLineUpdateButton lines={[{id, quantity: prevQuantity}]}>
        <button
          aria-label={t('Decrease quantity')}
          disabled={quantity <= 1}
          type="submit"
          className={`${btnBase} bg-secondary-S-90 ${
            quantity <= 1
              ? 'opacity-50 cursor-not-allowed'
              : 'active:bg-secondary-S-80'
          }`}
        >
          <span className="text-2xl ss:text-3xl">−</span>
        </button>
      </CartLineUpdateButton>

      {/* current qty */}
      <span className="flex items-center justify-center w-6 h-6 ss:w-8 ss:h-8 text-center">
        {quantity}
      </span>

      {/* ––– INCREMENT ––– */}
      {reachedMax ? (
        <button
          type="button"
          aria-label={t('Increase quantity')}
          onClick={() =>
            window.alert(
              outOfStock
                ? t('This item is out of stock')
                : t('No more items in stock'),
            )
          }
          className={`${btnBase} bg-gray-500 opacity-50 cursor-not-allowed`}
          title={t('No more items in stock')}
        >
          <span className="text-2xl ss:text-3xl">＋</span>
        </button>
      ) : (
        <CartLineUpdateButton lines={[{id, quantity: nextQuantity}]}>
          <button
            aria-label={t('Increase quantity')}
            type="submit"
            className={`${btnBase} bg-secondary-S-90 active:bg-secondary-S-80`}
            title={t('Increase quantity')}
          >
            <span className="text-2xl ss:text-3xl">＋</span>
          </button>
        </CartLineUpdateButton>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  LINE PRICE                                                                */
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

  const money =
    priceType === 'regular'
      ? cost.totalAmount
      : cost.compareAtAmountPerQuantity;

  if (!money) return null;

  return (
    <Money
      className="text-sm ss:text-base"
      data={{
        amount: (
          parseFloat(money.amount) * currency.exchange_rate
        ).toString(),
        currencyCode: currency.currency.en as CurrencyCode,
      }}
    />
  );
}

/* -------------------------------------------------------------------------- */
/*  HELPERS                                                                   */
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
