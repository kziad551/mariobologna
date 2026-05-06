import React from 'react';
import type {MoneyV2} from '@shopify/hydrogen/storefront-api-types';

type MoneyProps = {
  data?: MoneyV2 | null;
  as?: keyof JSX.IntrinsicElements;
  className?: string;
  withoutCurrency?: boolean;
  withoutTrailingZeros?: boolean;
  measurement?: unknown;
  measurementSeparator?: string;
} & Omit<React.HTMLAttributes<HTMLElement>, 'children'>;

// Drop-in replacement for @shopify/hydrogen's Money. Truncates the amount
// (does not round) and renders without fractional digits, so 2,880.95 displays
// as "AED 2,880". The underlying numeric data is unchanged — Shopify checkout
// still totals the real amounts.
export function Money({
  data,
  as: Tag = 'div',
  className,
  withoutCurrency = false,
  // accepted for API compatibility, intentionally ignored:
  withoutTrailingZeros: _withoutTrailingZeros,
  measurement: _measurement,
  measurementSeparator: _measurementSeparator,
  ...rest
}: MoneyProps) {
  const raw = parseFloat(data?.amount ?? '0');
  const truncated = Number.isFinite(raw) ? Math.trunc(raw) : 0;
  const currency = data?.currencyCode || 'USD';

  let formatted: string;
  try {
    formatted = new Intl.NumberFormat(undefined, {
      ...(withoutCurrency ? {} : {style: 'currency', currency}),
      maximumFractionDigits: 0,
      minimumFractionDigits: 0,
    }).format(truncated);
  } catch {
    formatted = withoutCurrency ? String(truncated) : `${currency} ${truncated}`;
  }

  return React.createElement(Tag, {className, ...rest}, formatted);
}
