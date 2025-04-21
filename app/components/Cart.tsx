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

export function CartLineQuantity({
  t,
  id,
  quantity,
}: {
  t: TFunction<'translation', undefined>;
  id: string;
  quantity: number;
}) {
  if (typeof quantity === 'undefined') return null;
  const prevQuantity = Number(Math.max(0, quantity - 1).toFixed(0));
  const nextQuantity = Number((quantity + 1).toFixed(0));

  return (
    <div className="flex items-center xs:justify-center gap-0.5">
      <CartLineRemoveButton t={t} lineIds={[id]} />
      <CartLineUpdateButton lines={[{id, quantity: prevQuantity}]}>
        <button
          aria-label="Decrease quantity"
          disabled={quantity <= 1}
          name="decrease-quantity"
          value={prevQuantity}
          type="submit"
          className="overflow-hidden rounded flex items-center justify-center h-6 w-6 ss:w-8 ss:h-8 p-2.5 bg-secondary-S-90 text-white disabled:opacity-50 focus:outline-none active:bg-secondary-S-80"
        >
          <span className="text-2xl ss:text-3xl">&#8722;</span>
        </button>
      </CartLineUpdateButton>
      <span className="flex items-center justify-center w-6 h-6 ss:w-8 ss:h-8 text-center">
        {quantity}
      </span>
      <CartLineUpdateButton lines={[{id, quantity: nextQuantity}]}>
        <button
          aria-label="Increase quantity"
          name="increase-quantity"
          value={nextQuantity}
          type="submit"
          className="overflow-hidden rounded flex items-center justify-center h-6 w-6 ss:w-8 ss:h-8 p-2.5 bg-secondary-S-90 text-white focus:outline-none active:bg-secondary-S-80"
        >
          <span className="text-2xl ss:text-3xl">&#43;</span>
        </button>
      </CartLineUpdateButton>
    </div>
  );
}

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

  if (moneyV2 == null) {
    return null;
  }

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
