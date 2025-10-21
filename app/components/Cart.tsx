import {useEffect, useRef, useState} from 'react';
import {CartForm, Money} from '@shopify/hydrogen';
import type {
  CartLineUpdateInput,
  CurrencyCode,
} from '@shopify/hydrogen/storefront-api-types';
import type {CartApiQueryFragment} from 'storefrontapi.generated';
import {TFunction} from 'i18next';
import {useCustomContext} from '~/contexts/App';

/* -------------------------------------------------------------------------- */
/*  TYPES                                                                     */
/* -------------------------------------------------------------------------- */
type CartLine = CartApiQueryFragment['lines']['nodes'][0];

/* -------------------------------------------------------------------------- */
/*  CART‑LINE QUANTITY HANDLING – pure client guard                           */
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
  // Guard against SSR missing value
  if (typeof quantity === 'undefined') return null;

  /* ---------------------- LOCAL STATE / REFS ----------------------------- */
  const [blocked, setBlocked] = useState(false);        // user hit max detected client‑side
  const timerRef = useRef<NodeJS.Timeout | null>(null); // pending + click timer
  const prevQty = useRef(quantity);                     // last known qty

  /* ------------------ WHEN QUANTITY CHANGES ----------------------------- */
  useEffect(() => {
    // Successful update clears the timer & un‑blocks if stock replenished
    if (quantity !== prevQty.current) {
      if (timerRef.current) clearTimeout(timerRef.current);
      setBlocked(false);
      prevQty.current = quantity;
    }
  }, [quantity]);

  /* ------------------ HANDLERS ----------------------------- */
  function handleIncreaseAttempt() {
    if (blocked) return; // already maxed

    // Set a 2‑second watchdog: if qty doesn't change → no stock
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      if (quantity === prevQty.current) {
        setBlocked(true);
      }
    }, 2000);
  }

  /* ------------------ DERIVED VALUES ------------------------ */
  // Consider a variant available if either availableForSale is true OR quantityAvailable > 0
  const hasStock = merchandise 
    ? ((merchandise as any).availableForSale || ((merchandise as any).quantityAvailable ?? 0) > 0)
    : true;
  const outOfStock = !hasStock;
  const reachedMax = blocked || outOfStock; // rely on client watchdog + stock availability

  const prevQuantity = Math.max(0, quantity - 1);
  const nextQuantity = quantity + 1;

  const btnBase =
    'overflow-hidden rounded flex items-center justify-center h-6 w-6 ss:h-8 ss:w-8 p-2.5 text-white focus:outline-none transition-colors';

  /* ------------------ RENDER ------------------------------- */
  return (
    <div className="flex flex-col items-center gap-2">
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
                : 'hover:bg-secondary-S-80 active:bg-secondary-S-70'
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
        <CartLineUpdateButton lines={[{id, quantity: nextQuantity}]}>         
          <button
            onClick={handleIncreaseAttempt}
            aria-label={t('Increase quantity')}
            type="submit"
            disabled={reachedMax}
            className={`${btnBase} ${
              reachedMax
                ? 'bg-gray-400 opacity-50 cursor-not-allowed'
                : 'bg-secondary-S-90 hover:bg-secondary-S-80 active:bg-secondary-S-70'
            }`}
            title={
              reachedMax
                ? t(outOfStock ? 'This item is out of stock' : 'No more stock for this item')
                : t('Increase quantity')
            }
          >
            <span className="text-2xl ss:text-3xl">＋</span>
          </button>
        </CartLineUpdateButton>
      </div>
      
      {/* ––– REMOVE BUTTON ––– */}
      <CartLineRemoveButton id={id} t={t} />
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

/* -------------------------------------------------------------------------- */
/*  CART‑LINE REMOVE BUTTON                                                  */
/* -------------------------------------------------------------------------- */
export function CartLineRemoveButton({
  id,
  t,
}: {
  id: string;
  t: TFunction<'translation', undefined>;
}) {
  return (
    <CartLineUpdateButton lines={[{id, quantity: 0}]}>
      <button
        aria-label={t('Remove item')}
        type="submit"
        className="text-xs text-red-600 hover:text-red-800 hover:underline transition-colors"
      >
        {t('Remove')}
      </button>
    </CartLineUpdateButton>
  );
}
