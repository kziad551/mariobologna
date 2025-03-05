import React from 'react';

// Map of color names to their hex values for consistent display
const COLOR_MAP: Record<string, string> = {
  // Basic colors
  'Black': '#000000',
  'White': '#FFFFFF',
  'Red': '#FF0000',
  'Blue': '#0000FF',
  'Green': '#008000',
  'Yellow': '#FFFF00',
  'Purple': '#800080',
  'Orange': '#FFA500',
  'Pink': '#FFC0CB',
  'Brown': '#A52A2A',
  'Grey': '#808080',
  'Gray': '#808080', // Alternative spelling
  
  // Metallics
  'Bronze': '#CD7F32',
  'Gold': '#FFD700',
  'Silver': '#C0C0C0',
  'Copper': '#B87333',
  
  // Blues
  'Navy': '#000080',
  'Sky Blue': '#87CEEB',
  'Teal': '#008080',
  'Turquoise': '#40E0D0',
  'Aqua': '#00FFFF',
  'Royal Blue': '#4169E1',
  
  // Reds/Pinks
  'Burgundy': '#800020',
  'Maroon': '#800000',
  'Coral': '#FF7F50',
  'Salmon': '#FA8072',
  'Magenta': '#FF00FF',
  
  // Greens
  'Olive': '#808000',
  'Lime': '#00FF00',
  'Forest Green': '#228B22',
  'Mint': '#98FB98',
  
  // Neutrals
  'Beige': '#F5F5DC',
  'Cream': '#FFFDD0',
  'Tan': '#D2B48C',
  'Khaki': '#C3B091',
  'Taupe': '#483C32',
  'Ivory': '#FFFFF0',
  
  // Add more colors as needed
};

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
  // Normalize color name to handle case differences
  const normalizedOption = option.trim();
  
  // Get the color value from the map or use the option directly if not found
  const colorValue = COLOR_MAP[normalizedOption] || option;
  
  // Special handling for Multi Color
  const isMultiColor = normalizedOption.toLowerCase().includes('multi');
  
  // Check if this color is selected
  const isSelected = 
    Object.keys(selectedVariant)[0] === productId &&
    selectedVariant[productId]?.Color === option;
    
  // Check if this is a metallic color
  const isMetallic = ['Bronze', 'Gold', 'Silver', 'Copper'].includes(normalizedOption);
  
  // Create unique IDs for gradients
  const multiColorId = `multiColorGradient-${productId}-${normalizedOption.replace(/\s+/g, '')}`;
  const metallicId = `metallicGradient-${productId}-${normalizedOption.replace(/\s+/g, '')}`;
  
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
      className={`rounded-full ${
        isSelected
          ? 'border-secondary-S-90 border-[3px]'
          : 'border-transparent'
      }`}
    >
      <defs>
        {/* Multi-color gradient */}
        <linearGradient id={multiColorId}>
          <stop offset="0%" stopColor="#ff6e6e" />
          <stop offset="25%" stopColor="#6eff6e" />
          <stop offset="50%" stopColor="#6e6eff" />
          <stop offset="75%" stopColor="#ffff6e" />
          <stop offset="100%" stopColor="#ff6eff" />
        </linearGradient>
        
        {/* Metallic effect gradient */}
        {isMetallic && (
          <radialGradient id={metallicId}>
            <stop offset="0%" stopColor="white" stopOpacity="0.8" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </radialGradient>
        )}
      </defs>
      
      {/* Base color circle */}
      <circle
        cx="10"
        cy="10"
        r="10"
        fill={isMultiColor ? `url(#${multiColorId})` : colorValue}
      />
      
      {/* Border for light colors */}
      {(normalizedOption === 'White' || normalizedOption === 'Cream' || normalizedOption === 'Ivory') && (
        <circle
          cx="10"
          cy="10"
          r="9.5"
          fill="none"
          stroke="#E0E0E0"
          strokeWidth="1"
        />
      )}
      
      {/* Metallic shine effect */}
      {isMetallic && (
        <circle
          cx="10"
          cy="10"
          r="10"
          fill={`url(#${metallicId})`}
          opacity="0.6"
        />
      )}
    </svg>
  );
};

export default ColorCircleIcon;
