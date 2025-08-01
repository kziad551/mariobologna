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
  
  // Special patterns
  'Print': '#E6BEAA', // Leopard print peachy/tan base color
  
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
  
  // Special handling for Print pattern
  const isPrint = normalizedOption.toLowerCase() === 'print';
  
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
  const printPatternId = `printPattern-${productId}-${normalizedOption.replace(/\s+/g, '')}`;
  
  // Scale up the selected color for better visibility
  const scaleFactor = isSelected ? 1.1 : 1;
  const selectedDimensions = dimensions * scaleFactor;
  
  return (
    <div 
      className={`relative inline-flex items-center justify-center rounded-full ${
        isSelected ? 'scale-110 transition-transform duration-200' : ''
      }`}
      style={{
        width: dimensions,
        height: dimensions
      } as React.CSSProperties}
    >
      <svg
        width={isSelected ? selectedDimensions : dimensions}
        height={isSelected ? selectedDimensions : dimensions}
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
        className={`rounded-full ${
          !isSelected && isMetallic ? 'border border-[#E0E0E0]' : 'border-transparent'
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
          
          {/* Print pattern gradient */}
          {isPrint && (
            <pattern id={printPatternId} patternUnits="userSpaceOnUse" width="20" height="20">
              <rect width="20" height="20" fill="#E6BEAA" /> {/* Peachy/tan base */}
              
              {/* Irregular leopard spots */}
              <path d="M4,3 Q6,1 8,3 T12,4 Q14,6 12,8 T8,9 Q5,10 4,8 T3,4 Z" fill="#50290A" fillOpacity="0.8" />
              <path d="M14,12 Q16,10 18,12 T15,15 Q12,16 11,14 T13,11 Z" fill="#50290A" fillOpacity="0.8" />
              <path d="M2,15 Q3,13 5,14 T6,17 Q5,19 3,18 T2,15 Z" fill="#50290A" fillOpacity="0.8" />
              <path d="M16,3 Q17,2 18,3 T17,5 Q16,6 15,5 T16,3 Z" fill="#50290A" fillOpacity="0.8" />
              
              {/* Smaller spots */}
              <circle cx="10" cy="10" r="1.5" fill="#50290A" fillOpacity="0.7" />
              <circle cx="7" cy="16" r="1" fill="#50290A" fillOpacity="0.7" />
              <circle cx="13" cy="2" r="1" fill="#50290A" fillOpacity="0.7" />
            </pattern>
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
            : isPrint
              ? `url(#${printPatternId})`
              : isMetallic 
                ? `url(#${metallicId})`
                : colorValue
          }
        />
        
        {/* Border for light colors and metallics (only when not selected) */}
        {(normalizedOption === 'White' || 
          normalizedOption === 'Cream' || 
          normalizedOption === 'Ivory' ||
          normalizedOption === 'Beige' ||
          isMetallic) && !isSelected && (
          <circle
            cx="10"
            cy="10"
            r="9"
            fill="none"
            stroke={isMetallic ? `url(#${metallicStrokeId})` : 
              (normalizedOption === 'White' || normalizedOption === 'Beige') ? 
              "rgba(140, 114, 35, 1)" : "#E0E0E0"}
            strokeWidth={(normalizedOption === 'White' || normalizedOption === 'Beige') ? "1.5" : "1"}
          />
        )}
        
        {/* Add a thin border for Print pattern */}
        {isPrint && !isSelected && (
          <circle
            cx="10"
            cy="10"
            r="9"
            fill="none"
            stroke="#50290A"
            strokeWidth="0.5"
          />
        )}
        
        {/* Additional border for white/beige color when selected */}
        {(normalizedOption === 'White' || normalizedOption === 'Beige') && isSelected && (
          <circle
            cx="10"
            cy="10"
            r="9"
            fill="none"
            stroke="rgba(140, 114, 35, 1)"
            strokeWidth="2"
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
      
      {/* Selection checkmark for better visibility */}
      {isSelected && (
        <div className="absolute bottom-0 right-0 w-3 h-3 bg-secondary-S-90 rounded-full flex items-center justify-center text-white text-xs">
          <svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </div>
      )}
    </div>
  );
};

export default ColorCircleIcon;
