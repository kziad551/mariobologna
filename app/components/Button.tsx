import {forwardRef} from 'react';
import {Link} from '@remix-run/react';
import clsx from 'clsx';

import {missingClass} from '~/lib/utils';

export const Button = forwardRef(
  (
    {
      as = 'button',
      className = '',
      variant = 'primary',
      width = 'auto',
      ...props
    }: {
      as?: React.ElementType;
      className?: string;
      variant?: 'primary' | 'secondary' | 'inline';
      width?: 'auto' | 'full';
      [key: string]: any;
    },
    ref,
  ) => {
    const Component = props?.to ? Link : as;

    const baseButtonClasses =
      'inline-block rounded-md border font-medium text-center py-2.5 px-6 transition';

    const variants = {
      primary: `${baseButtonClasses} border-transparent bg-primary-P-40 text-white`,
      secondary: `${baseButtonClasses} border-neutral-N-80 text-black`,
      inline: 'border-b border-primary/10 leading-none pb-1',
    };

    const widths = {
      auto: 'w-auto',
      full: 'w-full',
    };

    const styles = clsx(
      missingClass(className, 'bg-') && variants[variant],
      missingClass(className, 'w-') && widths[width],
      className,
    );

    return (
      <Component
        // @todo: not supported until react-router makes it into Remix.
        preventScrollReset={true}
        className={styles}
        {...props}
        ref={ref}
      />
    );
  },
);
