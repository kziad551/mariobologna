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
  
  // Metallics with updated values for better visibility
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
  size = 'small', // Add size prop with default value 'small'
}: {
  selectedVariant: {
    [id: string]: {
      [key: string]: string;
    };
  };
  productId: string;
  option: string;
  size?: 'small' | 'large'; // Define size options
}) => {
  // Get dimensions based on size
  const dimensions = size === 'small' ? 24 : 40;
  
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
  const metallicStrokeId = `metallicStroke-${productId}-${normalizedOption.replace(/\s+/g, '')}`;
  
  // Adjust border width based on size
  const borderWidth = size === 'small' ? 2 : 3;
  
  return (
    <svg
      width={dimensions}
      height={dimensions}
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
      className={`rounded-full ${
        isSelected
          ? `border-secondary-S-90 border-[${borderWidth}px]`
          : isMetallic 
            ? 'border border-[#E0E0E0]' 
            : 'border-transparent'
      }`}
    >
      <defs>
        {/* Multi-color gradient */}
        {isMultiColor && (
          <linearGradient id={multiColorId}>
            <stop offset="0%" stopColor="#ff6e6e" />
            <stop offset="25%" stopColor="#6eff6e" />
            <stop offset="50%" stopColor="#6e6eff" />
            <stop offset="75%" stopColor="#ffff6e" />
            <stop offset="100%" stopColor="#ff6eff" />
          </linearGradient>
        )}
        
        {/* Metallic effect gradients */}
        {isMetallic && (
          <>
            <linearGradient id={metallicId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={colorValue} />
              <stop offset="50%" stopColor="white" stopOpacity="0.5" />
              <stop offset="100%" stopColor={colorValue} />
            </linearGradient>
            <linearGradient id={metallicStrokeId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={colorValue} stopOpacity="1" />
              <stop offset="50%" stopColor="white" stopOpacity="0.8" />
              <stop offset="100%" stopColor={colorValue} stopOpacity="1" />
            </linearGradient>
          </>
        )}
      </defs>
      
      {/* Base circle */}
      <circle
        cx="10"
        cy="10"
        r="9"
        fill={isMultiColor 
          ? `url(#${multiColorId})` 
          : isMetallic 
            ? `url(#${metallicId})`
            : colorValue
        }
      />
      
      {/* Border for light colors and metallics */}
      {(normalizedOption === 'White' || 
        normalizedOption === 'Cream' || 
        normalizedOption === 'Ivory' ||
        isMetallic) && (
        <circle
          cx="10"
          cy="10"
          r="9"
          fill="none"
          stroke={isMetallic ? `url(#${metallicStrokeId})` : "#E0E0E0"}
          strokeWidth="1"
        />
      )}
      
      {/* Metallic shine effect */}
      {isMetallic && (
        <ellipse
          cx="7"
          cy="7"
          rx="4"
          ry="4"
          fill="white"
          opacity="0.3"
        />
      )}
    </svg>
  );
};

export default ColorCircleIcon;
