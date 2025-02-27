import React from 'react';

const ColorCircleIcon = ({
  option,
  productId,
  selectedVariant,
}: {
  selectedVariant: {
    [id: string]: {
      [key: string]: string;
    };
  };
  productId: string;
  option: string;
}) => {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
      className={`rounded-full ${
        Object.keys(selectedVariant)[0] === productId &&
        selectedVariant[productId].Color === option
          ? 'border-secondary-S-90 border-[3px]'
          : 'border-transparent'
      }`}
    >
      <defs>
        <linearGradient id="multiColorGradient">
          <stop offset="0%" stopColor="#ff6e6e" />
          <stop offset="25%" stopColor="#6eff6e" />
          <stop offset="50%" stopColor="#6e6eff" />
          <stop offset="75%" stopColor="#ffff6e" />
          <stop offset="100%" stopColor="#ff6eff" />
        </linearGradient>
      </defs>
      <circle
        cx="10"
        cy="10"
        r="10"
        fill={option === 'Multi Color' ? 'url(#multiColorGradient)' : option}
      />
    </svg>
  );
};

export default ColorCircleIcon;
