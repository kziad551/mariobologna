type FilterListType = {
  title: string;
  isSize: boolean;
  checkboxGroup: string;
  dropdownList: {
    name: string;
  }[];
};

export const filterList: FilterListType[] = [
  {
    title: 'Shoes',
    isSize: false,
    checkboxGroup: 'shoes',
    dropdownList: [
      {
        name: 'Ballerina',
      },
      {
        name: 'Boots',
      },
      {
        name: 'Classic',
      },
      {
        name: 'Heals',
      },
      {
        name: 'Loafers',
      },
      {
        name: 'Mocassin',
      },
      {
        name: "Na'al",
      },
      {
        name: 'Platforms',
      },
      {
        name: 'Pumps',
      },
      {
        name: 'Sandals',
      },
      {
        name: 'Semi-formal',
      },
      {
        name: 'Slippers',
      },
      {
        name: 'Sneakers',
      },
    ],
  },
  {
    title: 'Clothing',
    isSize: false,
    checkboxGroup: 'clothing',
    dropdownList: [
      {
        name: 'Dresses',
      },
      {
        name: 'Jackets',
      },
      {
        name: 'Pants',
      },
      {
        name: 'Shorts',
      },
      {
        name: 'Skirts',
      },
      {
        name: 'Swimwear',
      },
      {
        name: 'tops',
      },
    ],
  },
  {
    title: 'Bags',
    isSize: false,
    checkboxGroup: 'bags',
    dropdownList: [
      {
        name: 'Backpack',
      },
      {
        name: 'Brief Case',
      },
      {
        name: 'Cross Bag',
      },
      {
        name: 'Handbag',
      },
      {
        name: 'Luggage Bag',
      },
      {
        name: 'Purse',
      },
      {
        name: 'Shoulder Bag',
      },
    ],
  },
  {
    title: 'Accessories',
    isSize: false,
    checkboxGroup: 'accessories',
    dropdownList: [
      {
        name: 'Beach Accessories',
      },
      {
        name: 'Belts',
      },
      {
        name: 'Hats',
      },
      {
        name: 'Scarfs',
      },
      {
        name: 'Sunglasses',
      },
      {
        name: 'Wallets',
      },
    ],
  },
  {
    title: 'Shoes Size',
    isSize: true,
    checkboxGroup: 'shoes_size',
    dropdownList: [
      {
        name: '36',
      },
      {
        name: '37',
      },
      {
        name: '38',
      },
      {
        name: '39',
      },
      {
        name: '41',
      },
      {
        name: '42',
      },
      {
        name: '43',
      },
      {
        name: '44',
      },
      {
        name: '45',
      },
      {
        name: '46',
      },
      {
        name: 'XS',
      },
      {
        name: 'S',
      },
      {
        name: 'M',
      },
      {
        name: 'L',
      },
      {
        name: 'XL',
      },
      {
        name: 'XXL',
      },
      {
        name: 'XXXL',
      },
    ],
  },
  {
    title: 'Clothing Size',
    isSize: true,
    checkboxGroup: 'clothing_size',
    dropdownList: [
      {
        name: 'XXS',
      },
      {
        name: 'XS',
      },
      {
        name: 'S',
      },
      {
        name: 'NO SIZE',
      },
      {
        name: 'ONE SIZE',
      },
      {
        name: 'M',
      },
      {
        name: 'L',
      },
      {
        name: 'XL',
      },
      {
        name: 'XXL',
      },
      {
        name: 'XXXL',
      },
      {
        name: 'UNI',
      },
    ],
  },
  {
    title: 'Colour',
    isSize: true,
    checkboxGroup: 'colour',
    dropdownList: [
      {
        name: 'Black',
      },
      {
        name: 'Blue',
      },
      {
        name: 'Yellow',
      },
      {
        name: 'Pink',
      },
      {
        name: 'Red',
      },
    ],
  },
  {
    title: 'Designers',
    isSize: false,
    checkboxGroup: 'designers',
    dropdownList: [
      {
        name: 'All Designers',
      },
      {
        name: 'Claudia Rossie',
      },
      {
        name: 'Byblos',
      },
      {
        name: 'Cromia',
      },
      {
        name: 'Jijil',
      },
      {
        name: 'Kanna',
      },
      {
        name: 'Parah',
      },
      {
        name: 'Plein Sport',
      },
      {
        name: 'Pollini',
      },
      {
        name: 'Sat',
      },
    ],
  },
];
