export interface Country {
  name: string;
  value: string;
  code: string;
  dialing_code: string;
}

export const countries: Country[] = [
  {name: 'Australia', value: 'Australia', code: 'AU', dialing_code: '+61'},
  {name: 'Bahrain', value: 'Bahrain', code: 'BH', dialing_code: '+973'},
  {name: 'Brazil', value: 'Brazil', code: 'BR', dialing_code: '+55'},
  {name: 'China', value: 'China', code: 'CN', dialing_code: '+86'},
  {name: 'Egypt', value: 'Egypt', code: 'EG', dialing_code: '+20'},
  {name: 'France', value: 'France', code: 'FR', dialing_code: '+33'},
  {name: 'Germany', value: 'Germany', code: 'DE', dialing_code: '+49'},
  {name: 'India', value: 'India', code: 'IN', dialing_code: '+91'},
  {name: 'Japan', value: 'Japan', code: 'JP', dialing_code: '+81'},
  {name: 'Kuwait', value: 'Kuwait', code: 'KW', dialing_code: '+965'},
  {name: 'Lebanon', value: 'Lebanon', code: 'LB', dialing_code: '+961'},
  {name: 'Oman', value: 'Oman', code: 'OM', dialing_code: '+968'},
  {name: 'Qatar', value: 'Qatar', code: 'QA', dialing_code: '+971'},
  {
    name: 'Saudi Arabia',
    value: 'Saudi Arabia',
    code: 'SA',
    dialing_code: '+34',
  },
  {name: 'Spain', value: 'Spain', code: 'ES', dialing_code: '+34'},
  {
    name: 'United Arab Emirates',
    value: 'United Arab Emirates',
    code: 'AE',
    dialing_code: '+971',
  },
  {
    name: 'United Kingdom',
    value: 'United Kingdom',
    code: 'UK',
    dialing_code: '+44',
  },
  {
    name: 'United States',
    value: 'United States',
    code: 'US',
    dialing_code: '+1',
  },
];
