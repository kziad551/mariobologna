/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable */
import type * as StorefrontAPI from '@shopify/hydrogen/storefront-api-types';

export type CustomerAddressUpdateMutationVariables = StorefrontAPI.Exact<{
  address: StorefrontAPI.MailingAddressInput;
  id: StorefrontAPI.Scalars['ID']['input'];
  customerAccessToken: StorefrontAPI.Scalars['String']['input'];
}>;

export type CustomerAddressUpdateMutation = {
  customerAddressUpdate?: StorefrontAPI.Maybe<{
    customerAddress?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.MailingAddress, 'id'>
    >;
    customerUserErrors: Array<
      Pick<StorefrontAPI.CustomerUserError, 'field' | 'message'>
    >;
  }>;
};

export type CustomerAddressDeleteMutationVariables = StorefrontAPI.Exact<{
  id: StorefrontAPI.Scalars['ID']['input'];
  customerAccessToken: StorefrontAPI.Scalars['String']['input'];
}>;

export type CustomerAddressDeleteMutation = {
  customerAddressDelete?: StorefrontAPI.Maybe<
    Pick<
      StorefrontAPI.CustomerAddressDeletePayload,
      'deletedCustomerAddressId'
    > & {
      customerUserErrors: Array<
        Pick<StorefrontAPI.CustomerUserError, 'field' | 'message'>
      >;
    }
  >;
};

export type CustomerAddressCreateMutationVariables = StorefrontAPI.Exact<{
  address: StorefrontAPI.MailingAddressInput;
  customerAccessToken: StorefrontAPI.Scalars['String']['input'];
}>;

export type CustomerAddressCreateMutation = {
  customerAddressCreate?: StorefrontAPI.Maybe<{
    customerAddress?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.MailingAddress, 'id'>
    >;
    customerUserErrors: Array<
      Pick<StorefrontAPI.CustomerUserError, 'field' | 'message'>
    >;
  }>;
};

export type CustomerDetailsCustomerFragment = Pick<
  StorefrontAPI.Customer,
  'id' | 'firstName' | 'lastName'
> & {
  defaultAddress?: StorefrontAPI.Maybe<
    Pick<
      StorefrontAPI.MailingAddress,
      | 'id'
      | 'formatted'
      | 'firstName'
      | 'lastName'
      | 'company'
      | 'address1'
      | 'address2'
      | 'country'
      | 'province'
      | 'city'
      | 'zip'
      | 'phone'
    >
  >;
  addresses: {
    nodes: Array<
      Pick<
        StorefrontAPI.MailingAddress,
        | 'id'
        | 'formatted'
        | 'firstName'
        | 'lastName'
        | 'company'
        | 'address1'
        | 'address2'
        | 'country'
        | 'province'
        | 'city'
        | 'zip'
        | 'phone'
      >
    >;
  };
};

export type CustomerDetailsAddressFragment = Pick<
  StorefrontAPI.MailingAddress,
  | 'id'
  | 'formatted'
  | 'firstName'
  | 'lastName'
  | 'company'
  | 'address1'
  | 'address2'
  | 'country'
  | 'province'
  | 'city'
  | 'zip'
  | 'phone'
>;

export type CustomerDetailsQueryVariables = StorefrontAPI.Exact<{
  customerAccessToken: StorefrontAPI.Scalars['String']['input'];
}>;

export type CustomerDetailsQuery = {
  customer?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.Customer, 'id' | 'firstName' | 'lastName'> & {
      defaultAddress?: StorefrontAPI.Maybe<
        Pick<
          StorefrontAPI.MailingAddress,
          | 'id'
          | 'formatted'
          | 'firstName'
          | 'lastName'
          | 'company'
          | 'address1'
          | 'address2'
          | 'country'
          | 'province'
          | 'city'
          | 'zip'
          | 'phone'
        >
      >;
      addresses: {
        nodes: Array<
          Pick<
            StorefrontAPI.MailingAddress,
            | 'id'
            | 'formatted'
            | 'firstName'
            | 'lastName'
            | 'company'
            | 'address1'
            | 'address2'
            | 'country'
            | 'province'
            | 'city'
            | 'zip'
            | 'phone'
          >
        >;
      };
    }
  >;
};

export type CustomerOrderMoneyFragment = Pick<
  StorefrontAPI.MoneyV2,
  'amount' | 'currencyCode'
>;

export type CustomerOrderDiscountApplicationFragment = {
  value:
    | ({__typename: 'MoneyV2'} & Pick<
        StorefrontAPI.MoneyV2,
        'amount' | 'currencyCode'
      >)
    | ({__typename: 'PricingPercentageValue'} & Pick<
        StorefrontAPI.PricingPercentageValue,
        'percentage'
      >);
};

export type CustomerOrderLineItemFullFragment = Pick<
  StorefrontAPI.OrderLineItem,
  'title' | 'quantity'
> & {
  variant?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.ProductVariant, 'id' | 'title'> & {
      image?: StorefrontAPI.Maybe<
        Pick<StorefrontAPI.Image, 'altText' | 'height' | 'url' | 'id' | 'width'>
      >;
    }
  >;
  originalTotalPrice: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
  discountAllocations: Array<{
    allocatedAmount: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
    discountApplication: {
      value:
        | ({__typename: 'MoneyV2'} & Pick<
            StorefrontAPI.MoneyV2,
            'amount' | 'currencyCode'
          >)
        | ({__typename: 'PricingPercentageValue'} & Pick<
            StorefrontAPI.PricingPercentageValue,
            'percentage'
          >);
    };
  }>;
};

export type CustomerOrderDetailsFragment = Pick<
  StorefrontAPI.Order,
  'id' | 'name' | 'statusUrl' | 'processedAt' | 'fulfillmentStatus'
> & {
  totalTax?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
  >;
  totalPrice: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
  originalTotalPrice: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
  shippingAddress?: StorefrontAPI.Maybe<
    Pick<
      StorefrontAPI.MailingAddress,
      | 'address1'
      | 'address2'
      | 'city'
      | 'company'
      | 'country'
      | 'firstName'
      | 'lastName'
      | 'phone'
      | 'province'
      | 'zip'
    >
  >;
  discountApplications: {
    nodes: Array<{
      value:
        | ({__typename: 'MoneyV2'} & Pick<
            StorefrontAPI.MoneyV2,
            'amount' | 'currencyCode'
          >)
        | ({__typename: 'PricingPercentageValue'} & Pick<
            StorefrontAPI.PricingPercentageValue,
            'percentage'
          >);
    }>;
  };
  lineItems: {
    nodes: Array<
      Pick<StorefrontAPI.OrderLineItem, 'title' | 'quantity'> & {
        variant?: StorefrontAPI.Maybe<
          Pick<StorefrontAPI.ProductVariant, 'id' | 'title'> & {
            image?: StorefrontAPI.Maybe<
              Pick<
                StorefrontAPI.Image,
                'altText' | 'height' | 'url' | 'id' | 'width'
              >
            >;
          }
        >;
        originalTotalPrice: Pick<
          StorefrontAPI.MoneyV2,
          'amount' | 'currencyCode'
        >;
        discountAllocations: Array<{
          allocatedAmount: Pick<
            StorefrontAPI.MoneyV2,
            'amount' | 'currencyCode'
          >;
          discountApplication: {
            value:
              | ({__typename: 'MoneyV2'} & Pick<
                  StorefrontAPI.MoneyV2,
                  'amount' | 'currencyCode'
                >)
              | ({__typename: 'PricingPercentageValue'} & Pick<
                  StorefrontAPI.PricingPercentageValue,
                  'percentage'
                >);
          };
        }>;
      }
    >;
  };
};

export type CustomerOrderQueryVariables = StorefrontAPI.Exact<{
  orderId: StorefrontAPI.Scalars['ID']['input'];
}>;

export type CustomerOrderQuery = {
  node?: StorefrontAPI.Maybe<
    Pick<
      StorefrontAPI.Order,
      'id' | 'name' | 'statusUrl' | 'processedAt' | 'fulfillmentStatus'
    > & {
      totalTax?: StorefrontAPI.Maybe<
        Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
      >;
      totalPrice: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
      originalTotalPrice: Pick<
        StorefrontAPI.MoneyV2,
        'amount' | 'currencyCode'
      >;
      shippingAddress?: StorefrontAPI.Maybe<
        Pick<
          StorefrontAPI.MailingAddress,
          | 'address1'
          | 'address2'
          | 'city'
          | 'company'
          | 'country'
          | 'firstName'
          | 'lastName'
          | 'phone'
          | 'province'
          | 'zip'
        >
      >;
      discountApplications: {
        nodes: Array<{
          value:
            | ({__typename: 'MoneyV2'} & Pick<
                StorefrontAPI.MoneyV2,
                'amount' | 'currencyCode'
              >)
            | ({__typename: 'PricingPercentageValue'} & Pick<
                StorefrontAPI.PricingPercentageValue,
                'percentage'
              >);
        }>;
      };
      lineItems: {
        nodes: Array<
          Pick<StorefrontAPI.OrderLineItem, 'title' | 'quantity'> & {
            variant?: StorefrontAPI.Maybe<
              Pick<StorefrontAPI.ProductVariant, 'id' | 'title'> & {
                image?: StorefrontAPI.Maybe<
                  Pick<
                    StorefrontAPI.Image,
                    'altText' | 'height' | 'url' | 'id' | 'width'
                  >
                >;
              }
            >;
            originalTotalPrice: Pick<
              StorefrontAPI.MoneyV2,
              'amount' | 'currencyCode'
            >;
            discountAllocations: Array<{
              allocatedAmount: Pick<
                StorefrontAPI.MoneyV2,
                'amount' | 'currencyCode'
              >;
              discountApplication: {
                value:
                  | ({__typename: 'MoneyV2'} & Pick<
                      StorefrontAPI.MoneyV2,
                      'amount' | 'currencyCode'
                    >)
                  | ({__typename: 'PricingPercentageValue'} & Pick<
                      StorefrontAPI.PricingPercentageValue,
                      'percentage'
                    >);
              };
            }>;
          }
        >;
      };
    }
  >;
};

export type OrderItemFragment = Pick<
  StorefrontAPI.Order,
  'financialStatus' | 'fulfillmentStatus' | 'id' | 'name' | 'processedAt'
> & {totalPrice: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>};

export type CustomerOrdersFragment = {
  orders: {
    nodes: Array<
      Pick<
        StorefrontAPI.Order,
        'financialStatus' | 'fulfillmentStatus' | 'id' | 'name' | 'processedAt'
      > & {totalPrice: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>}
    >;
    pageInfo: Pick<
      StorefrontAPI.PageInfo,
      'hasPreviousPage' | 'hasNextPage' | 'endCursor' | 'startCursor'
    >;
  };
};

export type CustomerOrdersQueryVariables = StorefrontAPI.Exact<{
  customerAccessToken: StorefrontAPI.Scalars['String']['input'];
  endCursor?: StorefrontAPI.InputMaybe<
    StorefrontAPI.Scalars['String']['input']
  >;
  first?: StorefrontAPI.InputMaybe<StorefrontAPI.Scalars['Int']['input']>;
  last?: StorefrontAPI.InputMaybe<StorefrontAPI.Scalars['Int']['input']>;
  startCursor?: StorefrontAPI.InputMaybe<
    StorefrontAPI.Scalars['String']['input']
  >;
}>;

export type CustomerOrdersQuery = {
  customer?: StorefrontAPI.Maybe<{
    orders: {
      nodes: Array<
        Pick<
          StorefrontAPI.Order,
          | 'financialStatus'
          | 'fulfillmentStatus'
          | 'id'
          | 'name'
          | 'processedAt'
        > & {totalPrice: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>}
      >;
      pageInfo: Pick<
        StorefrontAPI.PageInfo,
        'hasPreviousPage' | 'hasNextPage' | 'endCursor' | 'startCursor'
      >;
    };
  }>;
};

export type CustomerUpdateMutationVariables = StorefrontAPI.Exact<{
  customerAccessToken: StorefrontAPI.Scalars['String']['input'];
  customer: StorefrontAPI.CustomerUpdateInput;
}>;

export type CustomerUpdateMutation = {
  customerUpdate?: StorefrontAPI.Maybe<{
    customer?: StorefrontAPI.Maybe<
      Pick<
        StorefrontAPI.Customer,
        'id' | 'email' | 'phone' | 'firstName' | 'lastName'
      >
    >;
    customerUserErrors: Array<
      Pick<StorefrontAPI.CustomerUserError, 'field' | 'message'>
    >;
  }>;
};

export type MoneyFragment = Pick<
  StorefrontAPI.MoneyV2,
  'currencyCode' | 'amount'
>;

export type CartLineFragment = Pick<
  StorefrontAPI.CartLine,
  'id' | 'quantity'
> & {
  attributes: Array<Pick<StorefrontAPI.Attribute, 'key' | 'value'>>;
  cost: {
    totalAmount: Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>;
    amountPerQuantity: Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>;
    compareAtAmountPerQuantity?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>
    >;
  };
  merchandise: Pick<
    StorefrontAPI.ProductVariant,
    'id' | 'availableForSale' | 'requiresShipping' | 'title'
  > & {
    compareAtPrice?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>
    >;
    price: Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>;
    image?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.Image, 'id' | 'url' | 'altText' | 'width' | 'height'>
    >;
    product: Pick<StorefrontAPI.Product, 'handle' | 'title' | 'id' | 'vendor'>;
    selectedOptions: Array<
      Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
    >;
  };
};

export type CartApiQueryFragment = Pick<
  StorefrontAPI.Cart,
  'updatedAt' | 'id' | 'checkoutUrl' | 'totalQuantity' | 'note'
> & {
  buyerIdentity: Pick<
    StorefrontAPI.CartBuyerIdentity,
    'countryCode' | 'email' | 'phone'
  > & {
    customer?: StorefrontAPI.Maybe<
      Pick<
        StorefrontAPI.Customer,
        'id' | 'email' | 'firstName' | 'lastName' | 'displayName'
      >
    >;
  };
  lines: {
    nodes: Array<
      Pick<StorefrontAPI.CartLine, 'id' | 'quantity'> & {
        attributes: Array<Pick<StorefrontAPI.Attribute, 'key' | 'value'>>;
        cost: {
          totalAmount: Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>;
          amountPerQuantity: Pick<
            StorefrontAPI.MoneyV2,
            'currencyCode' | 'amount'
          >;
          compareAtAmountPerQuantity?: StorefrontAPI.Maybe<
            Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>
          >;
        };
        merchandise: Pick<
          StorefrontAPI.ProductVariant,
          'id' | 'availableForSale' | 'requiresShipping' | 'title'
        > & {
          compareAtPrice?: StorefrontAPI.Maybe<
            Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>
          >;
          price: Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>;
          image?: StorefrontAPI.Maybe<
            Pick<
              StorefrontAPI.Image,
              'id' | 'url' | 'altText' | 'width' | 'height'
            >
          >;
          product: Pick<
            StorefrontAPI.Product,
            'handle' | 'title' | 'id' | 'vendor'
          >;
          selectedOptions: Array<
            Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
          >;
        };
      }
    >;
  };
  cost: {
    subtotalAmount: Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>;
    totalAmount: Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>;
    totalDutyAmount?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>
    >;
    totalTaxAmount?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>
    >;
  };
  attributes: Array<Pick<StorefrontAPI.Attribute, 'key' | 'value'>>;
  discountCodes: Array<
    Pick<StorefrontAPI.CartDiscountCode, 'code' | 'applicable'>
  >;
};

export type ProductCardFragment = Pick<
  StorefrontAPI.Product,
  | 'id'
  | 'title'
  | 'publishedAt'
  | 'handle'
  | 'vendor'
  | 'productType'
  | 'tags'
  | 'descriptionHtml'
  | 'description'
  | 'availableForSale'
> & {
  collections: {nodes: Array<Pick<StorefrontAPI.Collection, 'handle'>>};
  options: Array<Pick<StorefrontAPI.ProductOption, 'name' | 'values'>>;
  priceRange: {
    minVariantPrice: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
    maxVariantPrice: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
  };
  compareAtPriceRange: {
    minVariantPrice: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
    maxVariantPrice: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
  };
  featuredImage?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.Image, 'id' | 'altText' | 'url' | 'width' | 'height'>
  >;
  images: {
    nodes: Array<
      Pick<StorefrontAPI.Image, 'id' | 'url' | 'altText' | 'width' | 'height'>
    >;
  };
  variants: {
    nodes: Array<
      Pick<StorefrontAPI.ProductVariant, 'id' | 'availableForSale'> & {
        image?: StorefrontAPI.Maybe<
          Pick<StorefrontAPI.Image, 'url' | 'altText' | 'width' | 'height'>
        >;
        price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
        compareAtPrice?: StorefrontAPI.Maybe<
          Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
        >;
        selectedOptions: Array<
          Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
        >;
        product: Pick<StorefrontAPI.Product, 'handle' | 'title'>;
      }
    >;
  };
};

export type CustomerFragment = Pick<
  StorefrontAPI.Customer,
  'id' | 'firstName' | 'lastName' | 'phone' | 'email'
> & {
  defaultAddress?: StorefrontAPI.Maybe<
    Pick<
      StorefrontAPI.MailingAddress,
      | 'id'
      | 'firstName'
      | 'lastName'
      | 'company'
      | 'address1'
      | 'address2'
      | 'city'
      | 'country'
      | 'countryCodeV2'
      | 'zip'
      | 'phone'
    >
  >;
  addresses: {
    nodes: Array<
      Pick<
        StorefrontAPI.MailingAddress,
        | 'id'
        | 'firstName'
        | 'lastName'
        | 'company'
        | 'address1'
        | 'address2'
        | 'city'
        | 'country'
        | 'countryCodeV2'
        | 'zip'
        | 'phone'
      >
    >;
  };
  orders: {
    nodes: Array<
      Pick<
        StorefrontAPI.Order,
        | 'id'
        | 'processedAt'
        | 'canceledAt'
        | 'cancelReason'
        | 'financialStatus'
        | 'fulfillmentStatus'
      > & {
        totalPrice: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
        totalRefunded: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
        lineItems: {
          nodes: Array<
            Pick<StorefrontAPI.OrderLineItem, 'currentQuantity'> & {
              variant?: StorefrontAPI.Maybe<
                Pick<StorefrontAPI.ProductVariant, 'id'> & {
                  price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
                  image?: StorefrontAPI.Maybe<
                    Pick<
                      StorefrontAPI.Image,
                      'id' | 'altText' | 'height' | 'width' | 'url'
                    >
                  >;
                }
              >;
            }
          >;
        };
      }
    >;
  };
};

export type OrderCardFragment = Pick<
  StorefrontAPI.Order,
  | 'id'
  | 'processedAt'
  | 'canceledAt'
  | 'cancelReason'
  | 'financialStatus'
  | 'fulfillmentStatus'
> & {
  totalPrice: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
  totalRefunded: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
  lineItems: {
    nodes: Array<
      Pick<StorefrontAPI.OrderLineItem, 'currentQuantity'> & {
        variant?: StorefrontAPI.Maybe<
          Pick<StorefrontAPI.ProductVariant, 'id'> & {
            price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
            image?: StorefrontAPI.Maybe<
              Pick<
                StorefrontAPI.Image,
                'id' | 'altText' | 'height' | 'width' | 'url'
              >
            >;
          }
        >;
      }
    >;
  };
};

export type AddressFragment = Pick<
  StorefrontAPI.MailingAddress,
  | 'id'
  | 'firstName'
  | 'lastName'
  | 'company'
  | 'address1'
  | 'address2'
  | 'city'
  | 'country'
  | 'countryCodeV2'
  | 'zip'
  | 'phone'
>;

export type OrderMoneyFragment = Pick<
  StorefrontAPI.MoneyV2,
  'amount' | 'currencyCode'
>;

export type DiscountApplicationFragment = {
  value:
    | ({__typename: 'MoneyV2'} & Pick<
        StorefrontAPI.MoneyV2,
        'amount' | 'currencyCode'
      >)
    | ({__typename: 'PricingPercentageValue'} & Pick<
        StorefrontAPI.PricingPercentageValue,
        'percentage'
      >);
};

export type OrderFragment = Pick<
  StorefrontAPI.Order,
  'id' | 'name' | 'statusUrl' | 'processedAt' | 'fulfillmentStatus'
> & {
  totalTax?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
  >;
  totalPrice: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
  originalTotalPrice: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
  shippingAddress?: StorefrontAPI.Maybe<
    Pick<
      StorefrontAPI.MailingAddress,
      | 'address1'
      | 'address2'
      | 'city'
      | 'company'
      | 'country'
      | 'firstName'
      | 'lastName'
      | 'phone'
      | 'province'
      | 'zip'
    >
  >;
  discountApplications: {
    nodes: Array<{
      value:
        | ({__typename: 'MoneyV2'} & Pick<
            StorefrontAPI.MoneyV2,
            'amount' | 'currencyCode'
          >)
        | ({__typename: 'PricingPercentageValue'} & Pick<
            StorefrontAPI.PricingPercentageValue,
            'percentage'
          >);
    }>;
  };
  lineItems: {
    nodes: Array<
      Pick<StorefrontAPI.OrderLineItem, 'title' | 'quantity'> & {
        variant?: StorefrontAPI.Maybe<
          Pick<StorefrontAPI.ProductVariant, 'id' | 'title'> & {
            image?: StorefrontAPI.Maybe<
              Pick<
                StorefrontAPI.Image,
                'altText' | 'height' | 'url' | 'id' | 'width'
              >
            >;
          }
        >;
        originalTotalPrice: Pick<
          StorefrontAPI.MoneyV2,
          'amount' | 'currencyCode'
        >;
        discountAllocations: Array<{
          allocatedAmount: Pick<
            StorefrontAPI.MoneyV2,
            'amount' | 'currencyCode'
          >;
          discountApplication: {
            value:
              | ({__typename: 'MoneyV2'} & Pick<
                  StorefrontAPI.MoneyV2,
                  'amount' | 'currencyCode'
                >)
              | ({__typename: 'PricingPercentageValue'} & Pick<
                  StorefrontAPI.PricingPercentageValue,
                  'percentage'
                >);
          };
        }>;
      }
    >;
  };
};

export type LookQueryVariables = StorefrontAPI.Exact<{
  handle: StorefrontAPI.Scalars['String']['input'];
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
}>;

export type LookQuery = {
  collection?: StorefrontAPI.Maybe<
    Pick<
      StorefrontAPI.Collection,
      'id' | 'handle' | 'title' | 'description'
    > & {
      image?: StorefrontAPI.Maybe<
        {__typename: 'Image'} & Pick<
          StorefrontAPI.Image,
          'id' | 'url' | 'altText' | 'width' | 'height'
        >
      >;
      products: {
        nodes: Array<
          Pick<
            StorefrontAPI.Product,
            | 'id'
            | 'title'
            | 'publishedAt'
            | 'handle'
            | 'vendor'
            | 'productType'
            | 'tags'
            | 'descriptionHtml'
            | 'description'
            | 'availableForSale'
          > & {
            collections: {
              nodes: Array<Pick<StorefrontAPI.Collection, 'handle'>>;
            };
            options: Array<
              Pick<StorefrontAPI.ProductOption, 'name' | 'values'>
            >;
            priceRange: {
              minVariantPrice: Pick<
                StorefrontAPI.MoneyV2,
                'amount' | 'currencyCode'
              >;
              maxVariantPrice: Pick<
                StorefrontAPI.MoneyV2,
                'amount' | 'currencyCode'
              >;
            };
            compareAtPriceRange: {
              minVariantPrice: Pick<
                StorefrontAPI.MoneyV2,
                'amount' | 'currencyCode'
              >;
              maxVariantPrice: Pick<
                StorefrontAPI.MoneyV2,
                'amount' | 'currencyCode'
              >;
            };
            featuredImage?: StorefrontAPI.Maybe<
              Pick<
                StorefrontAPI.Image,
                'id' | 'altText' | 'url' | 'width' | 'height'
              >
            >;
            images: {
              nodes: Array<
                Pick<
                  StorefrontAPI.Image,
                  'id' | 'url' | 'altText' | 'width' | 'height'
                >
              >;
            };
            variants: {
              nodes: Array<
                Pick<
                  StorefrontAPI.ProductVariant,
                  'id' | 'availableForSale'
                > & {
                  image?: StorefrontAPI.Maybe<
                    Pick<
                      StorefrontAPI.Image,
                      'url' | 'altText' | 'width' | 'height'
                    >
                  >;
                  price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
                  compareAtPrice?: StorefrontAPI.Maybe<
                    Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
                  >;
                  selectedOptions: Array<
                    Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
                  >;
                  product: Pick<StorefrontAPI.Product, 'handle' | 'title'>;
                }
              >;
            };
          }
        >;
      };
    }
  >;
};

export type OtherCollectionQueryVariables = StorefrontAPI.Exact<{
  handle: StorefrontAPI.Scalars['String']['input'];
  first?: StorefrontAPI.InputMaybe<StorefrontAPI.Scalars['Int']['input']>;
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
}>;

export type OtherCollectionQuery = {
  collection?: StorefrontAPI.Maybe<
    Pick<
      StorefrontAPI.Collection,
      'id' | 'handle' | 'title' | 'description'
    > & {
      image?: StorefrontAPI.Maybe<
        {__typename: 'Image'} & Pick<
          StorefrontAPI.Image,
          'id' | 'url' | 'altText' | 'width' | 'height'
        >
      >;
      products: {
        nodes: Array<
          Pick<
            StorefrontAPI.Product,
            | 'id'
            | 'title'
            | 'publishedAt'
            | 'handle'
            | 'vendor'
            | 'productType'
            | 'tags'
            | 'descriptionHtml'
            | 'description'
            | 'availableForSale'
          > & {
            collections: {
              nodes: Array<Pick<StorefrontAPI.Collection, 'handle'>>;
            };
            options: Array<
              Pick<StorefrontAPI.ProductOption, 'name' | 'values'>
            >;
            priceRange: {
              minVariantPrice: Pick<
                StorefrontAPI.MoneyV2,
                'amount' | 'currencyCode'
              >;
              maxVariantPrice: Pick<
                StorefrontAPI.MoneyV2,
                'amount' | 'currencyCode'
              >;
            };
            compareAtPriceRange: {
              minVariantPrice: Pick<
                StorefrontAPI.MoneyV2,
                'amount' | 'currencyCode'
              >;
              maxVariantPrice: Pick<
                StorefrontAPI.MoneyV2,
                'amount' | 'currencyCode'
              >;
            };
            featuredImage?: StorefrontAPI.Maybe<
              Pick<
                StorefrontAPI.Image,
                'id' | 'altText' | 'url' | 'width' | 'height'
              >
            >;
            images: {
              nodes: Array<
                Pick<
                  StorefrontAPI.Image,
                  'id' | 'url' | 'altText' | 'width' | 'height'
                >
              >;
            };
            variants: {
              nodes: Array<
                Pick<
                  StorefrontAPI.ProductVariant,
                  'id' | 'availableForSale'
                > & {
                  image?: StorefrontAPI.Maybe<
                    Pick<
                      StorefrontAPI.Image,
                      'url' | 'altText' | 'width' | 'height'
                    >
                  >;
                  price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
                  compareAtPrice?: StorefrontAPI.Maybe<
                    Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
                  >;
                  selectedOptions: Array<
                    Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
                  >;
                  product: Pick<StorefrontAPI.Product, 'handle' | 'title'>;
                }
              >;
            };
          }
        >;
      };
    }
  >;
};

export type GetProductsByIdsQueryVariables = StorefrontAPI.Exact<{
  ids:
    | Array<StorefrontAPI.Scalars['ID']['input']>
    | StorefrontAPI.Scalars['ID']['input'];
}>;

export type GetProductsByIdsQuery = {
  nodes: Array<
    StorefrontAPI.Maybe<
      Pick<
        StorefrontAPI.Product,
        | 'id'
        | 'title'
        | 'publishedAt'
        | 'handle'
        | 'vendor'
        | 'productType'
        | 'tags'
        | 'descriptionHtml'
        | 'description'
        | 'availableForSale'
      > & {
        collections: {nodes: Array<Pick<StorefrontAPI.Collection, 'handle'>>};
        options: Array<Pick<StorefrontAPI.ProductOption, 'name' | 'values'>>;
        priceRange: {
          minVariantPrice: Pick<
            StorefrontAPI.MoneyV2,
            'amount' | 'currencyCode'
          >;
          maxVariantPrice: Pick<
            StorefrontAPI.MoneyV2,
            'amount' | 'currencyCode'
          >;
        };
        compareAtPriceRange: {
          minVariantPrice: Pick<
            StorefrontAPI.MoneyV2,
            'amount' | 'currencyCode'
          >;
          maxVariantPrice: Pick<
            StorefrontAPI.MoneyV2,
            'amount' | 'currencyCode'
          >;
        };
        featuredImage?: StorefrontAPI.Maybe<
          Pick<
            StorefrontAPI.Image,
            'id' | 'altText' | 'url' | 'width' | 'height'
          >
        >;
        images: {
          nodes: Array<
            Pick<
              StorefrontAPI.Image,
              'id' | 'url' | 'altText' | 'width' | 'height'
            >
          >;
        };
        variants: {
          nodes: Array<
            Pick<StorefrontAPI.ProductVariant, 'id' | 'availableForSale'> & {
              image?: StorefrontAPI.Maybe<
                Pick<
                  StorefrontAPI.Image,
                  'url' | 'altText' | 'width' | 'height'
                >
              >;
              price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
              compareAtPrice?: StorefrontAPI.Maybe<
                Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
              >;
              selectedOptions: Array<
                Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
              >;
              product: Pick<StorefrontAPI.Product, 'handle' | 'title'>;
            }
          >;
        };
      }
    >
  >;
};

export type GetMetaobjectQueryVariables = StorefrontAPI.Exact<{
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
  handle: StorefrontAPI.Scalars['String']['input'];
  type: StorefrontAPI.Scalars['String']['input'];
}>;

export type GetMetaobjectQuery = {
  metaobject?: StorefrontAPI.Maybe<{
    fields: Array<
      Pick<StorefrontAPI.MetaobjectField, 'key' | 'value' | 'type'> & {
        reference?: StorefrontAPI.Maybe<
          Pick<StorefrontAPI.MediaImage, 'id'> & {
            image?: StorefrontAPI.Maybe<
              Pick<StorefrontAPI.Image, 'url' | 'altText' | 'width' | 'height'>
            >;
          }
        >;
        references?: StorefrontAPI.Maybe<{
          nodes: Array<
            Pick<StorefrontAPI.MediaImage, 'id'> & {
              image?: StorefrontAPI.Maybe<
                Pick<
                  StorefrontAPI.Image,
                  'url' | 'altText' | 'width' | 'height'
                >
              >;
            }
          >;
        }>;
      }
    >;
  }>;
};

export type MenuItemFragment = Pick<
  StorefrontAPI.MenuItem,
  'id' | 'resourceId' | 'tags' | 'title' | 'type' | 'url'
>;

export type ChildMenuItemFragment = Pick<
  StorefrontAPI.MenuItem,
  'id' | 'resourceId' | 'tags' | 'title' | 'type' | 'url'
> & {
  items: Array<
    Pick<
      StorefrontAPI.MenuItem,
      'id' | 'resourceId' | 'tags' | 'title' | 'type' | 'url'
    >
  >;
};

export type ParentMenuItemFragment = Pick<
  StorefrontAPI.MenuItem,
  'id' | 'resourceId' | 'tags' | 'title' | 'type' | 'url'
> & {
  items: Array<
    Pick<
      StorefrontAPI.MenuItem,
      'id' | 'resourceId' | 'tags' | 'title' | 'type' | 'url'
    > & {
      items: Array<
        Pick<
          StorefrontAPI.MenuItem,
          'id' | 'resourceId' | 'tags' | 'title' | 'type' | 'url'
        >
      >;
    }
  >;
};

export type MenuFragment = Pick<StorefrontAPI.Menu, 'id'> & {
  items: Array<
    Pick<
      StorefrontAPI.MenuItem,
      'id' | 'resourceId' | 'tags' | 'title' | 'type' | 'url'
    > & {
      items: Array<
        Pick<
          StorefrontAPI.MenuItem,
          'id' | 'resourceId' | 'tags' | 'title' | 'type' | 'url'
        > & {
          items: Array<
            Pick<
              StorefrontAPI.MenuItem,
              'id' | 'resourceId' | 'tags' | 'title' | 'type' | 'url'
            >
          >;
        }
      >;
    }
  >;
};

export type ShopFragment = Pick<
  StorefrontAPI.Shop,
  'id' | 'name' | 'description'
> & {
  primaryDomain: Pick<StorefrontAPI.Domain, 'url'>;
  brand?: StorefrontAPI.Maybe<{
    logo?: StorefrontAPI.Maybe<{
      image?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Image, 'url'>>;
    }>;
  }>;
};

export type HeaderQueryVariables = StorefrontAPI.Exact<{
  headerMenuHandle: StorefrontAPI.Scalars['String']['input'];
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
}>;

export type HeaderQuery = {
  shop: Pick<StorefrontAPI.Shop, 'id' | 'name' | 'description'> & {
    primaryDomain: Pick<StorefrontAPI.Domain, 'url'>;
    brand?: StorefrontAPI.Maybe<{
      logo?: StorefrontAPI.Maybe<{
        image?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Image, 'url'>>;
      }>;
    }>;
  };
  menu?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.Menu, 'id'> & {
      items: Array<
        Pick<
          StorefrontAPI.MenuItem,
          'id' | 'resourceId' | 'tags' | 'title' | 'type' | 'url'
        > & {
          items: Array<
            Pick<
              StorefrontAPI.MenuItem,
              'id' | 'resourceId' | 'tags' | 'title' | 'type' | 'url'
            > & {
              items: Array<
                Pick<
                  StorefrontAPI.MenuItem,
                  'id' | 'resourceId' | 'tags' | 'title' | 'type' | 'url'
                >
              >;
            }
          >;
        }
      >;
    }
  >;
};

export type GetCollectionProductFiltersQueryVariables = StorefrontAPI.Exact<{
  handle: StorefrontAPI.Scalars['String']['input'];
  filters?: StorefrontAPI.InputMaybe<
    Array<StorefrontAPI.ProductFilter> | StorefrontAPI.ProductFilter
  >;
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
}>;

export type GetCollectionProductFiltersQuery = {
  collection?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.Collection, 'id' | 'handle'> & {
      products: {
        filters: Array<
          Pick<StorefrontAPI.Filter, 'id' | 'label'> & {
            values: Array<
              Pick<StorefrontAPI.FilterValue, 'id' | 'label' | 'count'>
            >;
          }
        >;
      };
    }
  >;
};

export type FooterQueryVariables = StorefrontAPI.Exact<{
  footerMenuHandle: StorefrontAPI.Scalars['String']['input'];
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
}>;

export type FooterQuery = {
  menu?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.Menu, 'id'> & {
      items: Array<
        Pick<
          StorefrontAPI.MenuItem,
          'id' | 'resourceId' | 'tags' | 'title' | 'type' | 'url'
        > & {
          items: Array<
            Pick<
              StorefrontAPI.MenuItem,
              'id' | 'resourceId' | 'tags' | 'title' | 'type' | 'url'
            > & {
              items: Array<
                Pick<
                  StorefrontAPI.MenuItem,
                  'id' | 'resourceId' | 'tags' | 'title' | 'type' | 'url'
                >
              >;
            }
          >;
        }
      >;
    }
  >;
};

export type SitemapQueryVariables = StorefrontAPI.Exact<{
  urlLimits?: StorefrontAPI.InputMaybe<StorefrontAPI.Scalars['Int']['input']>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
}>;

export type SitemapQuery = {
  products: {
    nodes: Array<
      Pick<
        StorefrontAPI.Product,
        'updatedAt' | 'handle' | 'onlineStoreUrl' | 'title'
      > & {
        featuredImage?: StorefrontAPI.Maybe<
          Pick<StorefrontAPI.Image, 'url' | 'altText'>
        >;
      }
    >;
  };
  collections: {
    nodes: Array<
      Pick<StorefrontAPI.Collection, 'updatedAt' | 'handle' | 'onlineStoreUrl'>
    >;
  };
  pages: {
    nodes: Array<
      Pick<StorefrontAPI.Page, 'updatedAt' | 'handle' | 'onlineStoreUrl'>
    >;
  };
};

export type RouteCustomerAddressDeleteMutationVariables = StorefrontAPI.Exact<{
  addressId: StorefrontAPI.Scalars['ID']['input'];
  token: StorefrontAPI.Scalars['String']['input'];
}>;

export type RouteCustomerAddressDeleteMutation = {
  customerAddressDelete?: StorefrontAPI.Maybe<
    Pick<
      StorefrontAPI.CustomerAddressDeletePayload,
      'deletedCustomerAddressId'
    > & {
      customerUserErrors: Array<
        Pick<StorefrontAPI.CustomerUserError, 'code' | 'field' | 'message'>
      >;
    }
  >;
};

export type PredictiveArticleFragment = {__typename: 'Article'} & Pick<
  StorefrontAPI.Article,
  'id' | 'title' | 'handle' | 'trackingParameters'
> & {
    image?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.Image, 'url' | 'altText' | 'width' | 'height'>
    >;
  };

export type PredictiveCollectionFragment = {__typename: 'Collection'} & Pick<
  StorefrontAPI.Collection,
  'id' | 'title' | 'handle' | 'trackingParameters'
> & {
    image?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.Image, 'url' | 'altText' | 'width' | 'height'>
    >;
  };

export type PredictivePageFragment = {__typename: 'Page'} & Pick<
  StorefrontAPI.Page,
  'id' | 'title' | 'handle' | 'trackingParameters'
>;

export type PredictiveProductFragment = {__typename: 'Product'} & Pick<
  StorefrontAPI.Product,
  'id' | 'title' | 'handle' | 'trackingParameters'
> & {
    variants: {
      nodes: Array<
        Pick<StorefrontAPI.ProductVariant, 'id'> & {
          image?: StorefrontAPI.Maybe<
            Pick<StorefrontAPI.Image, 'url' | 'altText' | 'width' | 'height'>
          >;
          price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
        }
      >;
    };
  };

export type PredictiveQueryFragment = {
  __typename: 'SearchQuerySuggestion';
} & Pick<
  StorefrontAPI.SearchQuerySuggestion,
  'text' | 'styledText' | 'trackingParameters'
>;

export type PredictiveSearchQueryVariables = StorefrontAPI.Exact<{
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
  limit: StorefrontAPI.Scalars['Int']['input'];
  limitScope: StorefrontAPI.PredictiveSearchLimitScope;
  searchTerm: StorefrontAPI.Scalars['String']['input'];
  types?: StorefrontAPI.InputMaybe<
    | Array<StorefrontAPI.PredictiveSearchType>
    | StorefrontAPI.PredictiveSearchType
  >;
}>;

export type PredictiveSearchQuery = {
  predictiveSearch?: StorefrontAPI.Maybe<{
    articles: Array<
      {__typename: 'Article'} & Pick<
        StorefrontAPI.Article,
        'id' | 'title' | 'handle' | 'trackingParameters'
      > & {
          image?: StorefrontAPI.Maybe<
            Pick<StorefrontAPI.Image, 'url' | 'altText' | 'width' | 'height'>
          >;
        }
    >;
    collections: Array<
      {__typename: 'Collection'} & Pick<
        StorefrontAPI.Collection,
        'id' | 'title' | 'handle' | 'trackingParameters'
      > & {
          image?: StorefrontAPI.Maybe<
            Pick<StorefrontAPI.Image, 'url' | 'altText' | 'width' | 'height'>
          >;
        }
    >;
    pages: Array<
      {__typename: 'Page'} & Pick<
        StorefrontAPI.Page,
        'id' | 'title' | 'handle' | 'trackingParameters'
      >
    >;
    products: Array<
      {__typename: 'Product'} & Pick<
        StorefrontAPI.Product,
        'id' | 'title' | 'handle' | 'trackingParameters'
      > & {
          variants: {
            nodes: Array<
              Pick<StorefrontAPI.ProductVariant, 'id'> & {
                image?: StorefrontAPI.Maybe<
                  Pick<
                    StorefrontAPI.Image,
                    'url' | 'altText' | 'width' | 'height'
                  >
                >;
                price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
              }
            >;
          };
        }
    >;
    queries: Array<
      {__typename: 'SearchQuerySuggestion'} & Pick<
        StorefrontAPI.SearchQuerySuggestion,
        'text' | 'styledText' | 'trackingParameters'
      >
    >;
  }>;
};

export type CollectionQueryVariables = StorefrontAPI.Exact<{
  handle: StorefrontAPI.Scalars['String']['input'];
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
  filters?: StorefrontAPI.InputMaybe<
    Array<StorefrontAPI.ProductFilter> | StorefrontAPI.ProductFilter
  >;
  sortKey: StorefrontAPI.ProductCollectionSortKeys;
  reverse?: StorefrontAPI.InputMaybe<StorefrontAPI.Scalars['Boolean']['input']>;
  first?: StorefrontAPI.InputMaybe<StorefrontAPI.Scalars['Int']['input']>;
  last?: StorefrontAPI.InputMaybe<StorefrontAPI.Scalars['Int']['input']>;
  startCursor?: StorefrontAPI.InputMaybe<
    StorefrontAPI.Scalars['String']['input']
  >;
  endCursor?: StorefrontAPI.InputMaybe<
    StorefrontAPI.Scalars['String']['input']
  >;
}>;

export type CollectionQuery = {
  collection?: StorefrontAPI.Maybe<
    Pick<
      StorefrontAPI.Collection,
      'id' | 'handle' | 'title' | 'description'
    > & {
      seo: Pick<StorefrontAPI.Seo, 'description' | 'title'>;
      image?: StorefrontAPI.Maybe<
        Pick<StorefrontAPI.Image, 'id' | 'url' | 'width' | 'height' | 'altText'>
      >;
      products: {
        filters: Array<
          Pick<StorefrontAPI.Filter, 'id' | 'label' | 'type'> & {
            values: Array<
              Pick<
                StorefrontAPI.FilterValue,
                'id' | 'label' | 'count' | 'input'
              >
            >;
          }
        >;
        nodes: Array<
          Pick<
            StorefrontAPI.Product,
            | 'id'
            | 'title'
            | 'publishedAt'
            | 'handle'
            | 'vendor'
            | 'productType'
            | 'tags'
            | 'descriptionHtml'
            | 'description'
            | 'availableForSale'
          > & {
            collections: {
              nodes: Array<Pick<StorefrontAPI.Collection, 'handle'>>;
            };
            options: Array<
              Pick<StorefrontAPI.ProductOption, 'name' | 'values'>
            >;
            priceRange: {
              minVariantPrice: Pick<
                StorefrontAPI.MoneyV2,
                'amount' | 'currencyCode'
              >;
              maxVariantPrice: Pick<
                StorefrontAPI.MoneyV2,
                'amount' | 'currencyCode'
              >;
            };
            compareAtPriceRange: {
              minVariantPrice: Pick<
                StorefrontAPI.MoneyV2,
                'amount' | 'currencyCode'
              >;
              maxVariantPrice: Pick<
                StorefrontAPI.MoneyV2,
                'amount' | 'currencyCode'
              >;
            };
            featuredImage?: StorefrontAPI.Maybe<
              Pick<
                StorefrontAPI.Image,
                'id' | 'altText' | 'url' | 'width' | 'height'
              >
            >;
            images: {
              nodes: Array<
                Pick<
                  StorefrontAPI.Image,
                  'id' | 'url' | 'altText' | 'width' | 'height'
                >
              >;
            };
            variants: {
              nodes: Array<
                Pick<
                  StorefrontAPI.ProductVariant,
                  'id' | 'availableForSale'
                > & {
                  image?: StorefrontAPI.Maybe<
                    Pick<
                      StorefrontAPI.Image,
                      'url' | 'altText' | 'width' | 'height'
                    >
                  >;
                  price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
                  compareAtPrice?: StorefrontAPI.Maybe<
                    Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
                  >;
                  selectedOptions: Array<
                    Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
                  >;
                  product: Pick<StorefrontAPI.Product, 'handle' | 'title'>;
                }
              >;
            };
          }
        >;
        pageInfo: Pick<
          StorefrontAPI.PageInfo,
          'hasPreviousPage' | 'hasNextPage' | 'endCursor' | 'startCursor'
        >;
      };
      allProducts: {nodes: Array<Pick<StorefrontAPI.Product, 'id'>>};
      filteredProducts: {nodes: Array<Pick<StorefrontAPI.Product, 'id'>>};
    }
  >;
};

export type PolicyFragment = Pick<
  StorefrontAPI.ShopPolicy,
  'body' | 'handle' | 'id' | 'title' | 'url'
>;

export type PolicyQueryVariables = StorefrontAPI.Exact<{
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
  privacyPolicy: StorefrontAPI.Scalars['Boolean']['input'];
  refundPolicy: StorefrontAPI.Scalars['Boolean']['input'];
  shippingPolicy: StorefrontAPI.Scalars['Boolean']['input'];
  termsOfService: StorefrontAPI.Scalars['Boolean']['input'];
}>;

export type PolicyQuery = {
  shop: {
    privacyPolicy?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.ShopPolicy, 'body' | 'handle' | 'id' | 'title' | 'url'>
    >;
    shippingPolicy?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.ShopPolicy, 'body' | 'handle' | 'id' | 'title' | 'url'>
    >;
    termsOfService?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.ShopPolicy, 'body' | 'handle' | 'id' | 'title' | 'url'>
    >;
    refundPolicy?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.ShopPolicy, 'body' | 'handle' | 'id' | 'title' | 'url'>
    >;
  };
};

export type PolicyItemFragment = Pick<
  StorefrontAPI.ShopPolicy,
  'id' | 'title' | 'handle'
>;

export type PoliciesQueryVariables = StorefrontAPI.Exact<{
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
}>;

export type PoliciesQuery = {
  shop: {
    privacyPolicy?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.ShopPolicy, 'id' | 'title' | 'handle'>
    >;
    shippingPolicy?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.ShopPolicy, 'id' | 'title' | 'handle'>
    >;
    termsOfService?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.ShopPolicy, 'id' | 'title' | 'handle'>
    >;
    refundPolicy?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.ShopPolicy, 'id' | 'title' | 'handle'>
    >;
    subscriptionPolicy?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.ShopPolicyWithDefault, 'id' | 'title' | 'handle'>
    >;
  };
};

export type ProductVariantFragment = Pick<
  StorefrontAPI.ProductVariant,
  'availableForSale' | 'id' | 'sku' | 'title'
> & {
  compareAtPrice?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
  >;
  image?: StorefrontAPI.Maybe<
    {__typename: 'Image'} & Pick<
      StorefrontAPI.Image,
      'id' | 'url' | 'altText' | 'width' | 'height'
    >
  >;
  price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
  product: Pick<
    StorefrontAPI.Product,
    'title' | 'tags' | 'productType' | 'handle'
  >;
  selectedOptions: Array<Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>>;
  unitPrice?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
  >;
};

export type ProductFragment = Pick<
  StorefrontAPI.Product,
  | 'id'
  | 'title'
  | 'vendor'
  | 'tags'
  | 'productType'
  | 'handle'
  | 'descriptionHtml'
  | 'description'
> & {
  options: Array<Pick<StorefrontAPI.ProductOption, 'name' | 'values'>>;
  collections: {nodes: Array<Pick<StorefrontAPI.Collection, 'handle'>>};
  priceRange: {
    minVariantPrice: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
    maxVariantPrice: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
  };
  compareAtPriceRange: {
    minVariantPrice: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
    maxVariantPrice: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
  };
  featuredImage?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.Image, 'id' | 'altText' | 'url' | 'width' | 'height'>
  >;
  images: {
    nodes: Array<
      {__typename: 'Image'} & Pick<
        StorefrontAPI.Image,
        'id' | 'url' | 'altText' | 'width' | 'height'
      >
    >;
  };
  media: {
    nodes: Array<
      | ({__typename: 'ExternalVideo' | 'MediaImage' | 'Model3d'} & {
          previewImage?: StorefrontAPI.Maybe<
            Pick<StorefrontAPI.Image, 'id' | 'url' | 'altText'>
          >;
        })
      | ({__typename: 'Video'} & Pick<
          StorefrontAPI.Video,
          'mediaContentType'
        > & {
            sources: Array<Pick<StorefrontAPI.VideoSource, 'format' | 'url'>>;
            previewImage?: StorefrontAPI.Maybe<
              Pick<StorefrontAPI.Image, 'id' | 'url' | 'altText'>
            >;
          })
    >;
  };
  selectedVariant?: StorefrontAPI.Maybe<
    Pick<
      StorefrontAPI.ProductVariant,
      'availableForSale' | 'id' | 'sku' | 'title'
    > & {
      compareAtPrice?: StorefrontAPI.Maybe<
        Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
      >;
      image?: StorefrontAPI.Maybe<
        {__typename: 'Image'} & Pick<
          StorefrontAPI.Image,
          'id' | 'url' | 'altText' | 'width' | 'height'
        >
      >;
      price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
      product: Pick<
        StorefrontAPI.Product,
        'title' | 'tags' | 'productType' | 'handle'
      >;
      selectedOptions: Array<
        Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
      >;
      unitPrice?: StorefrontAPI.Maybe<
        Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
      >;
    }
  >;
  variants: {
    nodes: Array<
      Pick<
        StorefrontAPI.ProductVariant,
        'availableForSale' | 'id' | 'sku' | 'title'
      > & {
        compareAtPrice?: StorefrontAPI.Maybe<
          Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
        >;
        image?: StorefrontAPI.Maybe<
          {__typename: 'Image'} & Pick<
            StorefrontAPI.Image,
            'id' | 'url' | 'altText' | 'width' | 'height'
          >
        >;
        price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
        product: Pick<
          StorefrontAPI.Product,
          'title' | 'tags' | 'productType' | 'handle'
        >;
        selectedOptions: Array<
          Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
        >;
        unitPrice?: StorefrontAPI.Maybe<
          Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
        >;
      }
    >;
  };
  seo: Pick<StorefrontAPI.Seo, 'description' | 'title'>;
};

export type CollectionDynamicProductsQueryVariables = StorefrontAPI.Exact<{
  handle: StorefrontAPI.Scalars['String']['input'];
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
  firstFilter?: StorefrontAPI.InputMaybe<
    Array<StorefrontAPI.ProductFilter> | StorefrontAPI.ProductFilter
  >;
  secondFilter?: StorefrontAPI.InputMaybe<
    Array<StorefrontAPI.ProductFilter> | StorefrontAPI.ProductFilter
  >;
}>;

export type CollectionDynamicProductsQuery = {
  collection?: StorefrontAPI.Maybe<
    Pick<
      StorefrontAPI.Collection,
      'id' | 'handle' | 'title' | 'description'
    > & {
      firstProduct: {
        nodes: Array<
          Pick<
            StorefrontAPI.Product,
            | 'id'
            | 'title'
            | 'publishedAt'
            | 'handle'
            | 'vendor'
            | 'productType'
            | 'tags'
            | 'descriptionHtml'
            | 'description'
            | 'availableForSale'
          > & {
            collections: {
              nodes: Array<Pick<StorefrontAPI.Collection, 'handle'>>;
            };
            options: Array<
              Pick<StorefrontAPI.ProductOption, 'name' | 'values'>
            >;
            priceRange: {
              minVariantPrice: Pick<
                StorefrontAPI.MoneyV2,
                'amount' | 'currencyCode'
              >;
              maxVariantPrice: Pick<
                StorefrontAPI.MoneyV2,
                'amount' | 'currencyCode'
              >;
            };
            compareAtPriceRange: {
              minVariantPrice: Pick<
                StorefrontAPI.MoneyV2,
                'amount' | 'currencyCode'
              >;
              maxVariantPrice: Pick<
                StorefrontAPI.MoneyV2,
                'amount' | 'currencyCode'
              >;
            };
            featuredImage?: StorefrontAPI.Maybe<
              Pick<
                StorefrontAPI.Image,
                'id' | 'altText' | 'url' | 'width' | 'height'
              >
            >;
            images: {
              nodes: Array<
                Pick<
                  StorefrontAPI.Image,
                  'id' | 'url' | 'altText' | 'width' | 'height'
                >
              >;
            };
            variants: {
              nodes: Array<
                Pick<
                  StorefrontAPI.ProductVariant,
                  'id' | 'availableForSale'
                > & {
                  image?: StorefrontAPI.Maybe<
                    Pick<
                      StorefrontAPI.Image,
                      'url' | 'altText' | 'width' | 'height'
                    >
                  >;
                  price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
                  compareAtPrice?: StorefrontAPI.Maybe<
                    Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
                  >;
                  selectedOptions: Array<
                    Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
                  >;
                  product: Pick<StorefrontAPI.Product, 'handle' | 'title'>;
                }
              >;
            };
          }
        >;
      };
      secondProduct: {
        nodes: Array<
          Pick<
            StorefrontAPI.Product,
            | 'id'
            | 'title'
            | 'publishedAt'
            | 'handle'
            | 'vendor'
            | 'productType'
            | 'tags'
            | 'descriptionHtml'
            | 'description'
            | 'availableForSale'
          > & {
            collections: {
              nodes: Array<Pick<StorefrontAPI.Collection, 'handle'>>;
            };
            options: Array<
              Pick<StorefrontAPI.ProductOption, 'name' | 'values'>
            >;
            priceRange: {
              minVariantPrice: Pick<
                StorefrontAPI.MoneyV2,
                'amount' | 'currencyCode'
              >;
              maxVariantPrice: Pick<
                StorefrontAPI.MoneyV2,
                'amount' | 'currencyCode'
              >;
            };
            compareAtPriceRange: {
              minVariantPrice: Pick<
                StorefrontAPI.MoneyV2,
                'amount' | 'currencyCode'
              >;
              maxVariantPrice: Pick<
                StorefrontAPI.MoneyV2,
                'amount' | 'currencyCode'
              >;
            };
            featuredImage?: StorefrontAPI.Maybe<
              Pick<
                StorefrontAPI.Image,
                'id' | 'altText' | 'url' | 'width' | 'height'
              >
            >;
            images: {
              nodes: Array<
                Pick<
                  StorefrontAPI.Image,
                  'id' | 'url' | 'altText' | 'width' | 'height'
                >
              >;
            };
            variants: {
              nodes: Array<
                Pick<
                  StorefrontAPI.ProductVariant,
                  'id' | 'availableForSale'
                > & {
                  image?: StorefrontAPI.Maybe<
                    Pick<
                      StorefrontAPI.Image,
                      'url' | 'altText' | 'width' | 'height'
                    >
                  >;
                  price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
                  compareAtPrice?: StorefrontAPI.Maybe<
                    Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
                  >;
                  selectedOptions: Array<
                    Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
                  >;
                  product: Pick<StorefrontAPI.Product, 'handle' | 'title'>;
                }
              >;
            };
          }
        >;
      };
    }
  >;
};

export type ProductQueryVariables = StorefrontAPI.Exact<{
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  handle: StorefrontAPI.Scalars['String']['input'];
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
  selectedOptions:
    | Array<StorefrontAPI.SelectedOptionInput>
    | StorefrontAPI.SelectedOptionInput;
}>;

export type ProductQuery = {
  product?: StorefrontAPI.Maybe<
    Pick<
      StorefrontAPI.Product,
      | 'id'
      | 'title'
      | 'vendor'
      | 'tags'
      | 'productType'
      | 'handle'
      | 'descriptionHtml'
      | 'description'
    > & {
      options: Array<Pick<StorefrontAPI.ProductOption, 'name' | 'values'>>;
      collections: {nodes: Array<Pick<StorefrontAPI.Collection, 'handle'>>};
      priceRange: {
        minVariantPrice: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
        maxVariantPrice: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
      };
      compareAtPriceRange: {
        minVariantPrice: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
        maxVariantPrice: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
      };
      featuredImage?: StorefrontAPI.Maybe<
        Pick<StorefrontAPI.Image, 'id' | 'altText' | 'url' | 'width' | 'height'>
      >;
      images: {
        nodes: Array<
          {__typename: 'Image'} & Pick<
            StorefrontAPI.Image,
            'id' | 'url' | 'altText' | 'width' | 'height'
          >
        >;
      };
      media: {
        nodes: Array<
          | ({__typename: 'ExternalVideo' | 'MediaImage' | 'Model3d'} & {
              previewImage?: StorefrontAPI.Maybe<
                Pick<StorefrontAPI.Image, 'id' | 'url' | 'altText'>
              >;
            })
          | ({__typename: 'Video'} & Pick<
              StorefrontAPI.Video,
              'mediaContentType'
            > & {
                sources: Array<
                  Pick<StorefrontAPI.VideoSource, 'format' | 'url'>
                >;
                previewImage?: StorefrontAPI.Maybe<
                  Pick<StorefrontAPI.Image, 'id' | 'url' | 'altText'>
                >;
              })
        >;
      };
      selectedVariant?: StorefrontAPI.Maybe<
        Pick<
          StorefrontAPI.ProductVariant,
          'availableForSale' | 'id' | 'sku' | 'title'
        > & {
          compareAtPrice?: StorefrontAPI.Maybe<
            Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
          >;
          image?: StorefrontAPI.Maybe<
            {__typename: 'Image'} & Pick<
              StorefrontAPI.Image,
              'id' | 'url' | 'altText' | 'width' | 'height'
            >
          >;
          price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
          product: Pick<
            StorefrontAPI.Product,
            'title' | 'tags' | 'productType' | 'handle'
          >;
          selectedOptions: Array<
            Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
          >;
          unitPrice?: StorefrontAPI.Maybe<
            Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
          >;
        }
      >;
      variants: {
        nodes: Array<
          Pick<
            StorefrontAPI.ProductVariant,
            'availableForSale' | 'id' | 'sku' | 'title'
          > & {
            compareAtPrice?: StorefrontAPI.Maybe<
              Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
            >;
            image?: StorefrontAPI.Maybe<
              {__typename: 'Image'} & Pick<
                StorefrontAPI.Image,
                'id' | 'url' | 'altText' | 'width' | 'height'
              >
            >;
            price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
            product: Pick<
              StorefrontAPI.Product,
              'title' | 'tags' | 'productType' | 'handle'
            >;
            selectedOptions: Array<
              Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
            >;
            unitPrice?: StorefrontAPI.Maybe<
              Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
            >;
          }
        >;
      };
      seo: Pick<StorefrontAPI.Seo, 'description' | 'title'>;
    }
  >;
};

export type ProductVariantsFragment = {
  variants: {
    nodes: Array<
      Pick<
        StorefrontAPI.ProductVariant,
        'availableForSale' | 'id' | 'sku' | 'title'
      > & {
        compareAtPrice?: StorefrontAPI.Maybe<
          Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
        >;
        image?: StorefrontAPI.Maybe<
          {__typename: 'Image'} & Pick<
            StorefrontAPI.Image,
            'id' | 'url' | 'altText' | 'width' | 'height'
          >
        >;
        price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
        product: Pick<
          StorefrontAPI.Product,
          'title' | 'tags' | 'productType' | 'handle'
        >;
        selectedOptions: Array<
          Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
        >;
        unitPrice?: StorefrontAPI.Maybe<
          Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
        >;
      }
    >;
  };
};

export type ProductVariantsQueryVariables = StorefrontAPI.Exact<{
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
  handle: StorefrontAPI.Scalars['String']['input'];
}>;

export type ProductVariantsQuery = {
  product?: StorefrontAPI.Maybe<{
    variants: {
      nodes: Array<
        Pick<
          StorefrontAPI.ProductVariant,
          'availableForSale' | 'id' | 'sku' | 'title'
        > & {
          compareAtPrice?: StorefrontAPI.Maybe<
            Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
          >;
          image?: StorefrontAPI.Maybe<
            {__typename: 'Image'} & Pick<
              StorefrontAPI.Image,
              'id' | 'url' | 'altText' | 'width' | 'height'
            >
          >;
          price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
          product: Pick<
            StorefrontAPI.Product,
            'title' | 'tags' | 'productType' | 'handle'
          >;
          selectedOptions: Array<
            Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
          >;
          unitPrice?: StorefrontAPI.Maybe<
            Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
          >;
        }
      >;
    };
  }>;
};

export type ProductsQueryVariables = StorefrontAPI.Exact<{
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
  sortKey: StorefrontAPI.ProductSortKeys;
  reverse?: StorefrontAPI.InputMaybe<StorefrontAPI.Scalars['Boolean']['input']>;
  query?: StorefrontAPI.InputMaybe<StorefrontAPI.Scalars['String']['input']>;
  first?: StorefrontAPI.InputMaybe<StorefrontAPI.Scalars['Int']['input']>;
  last?: StorefrontAPI.InputMaybe<StorefrontAPI.Scalars['Int']['input']>;
  startCursor?: StorefrontAPI.InputMaybe<
    StorefrontAPI.Scalars['String']['input']
  >;
  endCursor?: StorefrontAPI.InputMaybe<
    StorefrontAPI.Scalars['String']['input']
  >;
}>;

export type ProductsQuery = {
  products: {
    nodes: Array<
      Pick<
        StorefrontAPI.Product,
        | 'id'
        | 'title'
        | 'publishedAt'
        | 'handle'
        | 'vendor'
        | 'productType'
        | 'tags'
        | 'descriptionHtml'
        | 'description'
        | 'availableForSale'
      > & {
        collections: {nodes: Array<Pick<StorefrontAPI.Collection, 'handle'>>};
        options: Array<Pick<StorefrontAPI.ProductOption, 'name' | 'values'>>;
        priceRange: {
          minVariantPrice: Pick<
            StorefrontAPI.MoneyV2,
            'amount' | 'currencyCode'
          >;
          maxVariantPrice: Pick<
            StorefrontAPI.MoneyV2,
            'amount' | 'currencyCode'
          >;
        };
        compareAtPriceRange: {
          minVariantPrice: Pick<
            StorefrontAPI.MoneyV2,
            'amount' | 'currencyCode'
          >;
          maxVariantPrice: Pick<
            StorefrontAPI.MoneyV2,
            'amount' | 'currencyCode'
          >;
        };
        featuredImage?: StorefrontAPI.Maybe<
          Pick<
            StorefrontAPI.Image,
            'id' | 'altText' | 'url' | 'width' | 'height'
          >
        >;
        images: {
          nodes: Array<
            Pick<
              StorefrontAPI.Image,
              'id' | 'url' | 'altText' | 'width' | 'height'
            >
          >;
        };
        variants: {
          nodes: Array<
            Pick<StorefrontAPI.ProductVariant, 'id' | 'availableForSale'> & {
              image?: StorefrontAPI.Maybe<
                Pick<
                  StorefrontAPI.Image,
                  'url' | 'altText' | 'width' | 'height'
                >
              >;
              price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
              compareAtPrice?: StorefrontAPI.Maybe<
                Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
              >;
              selectedOptions: Array<
                Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
              >;
              product: Pick<StorefrontAPI.Product, 'handle' | 'title'>;
            }
          >;
        };
      }
    >;
    pageInfo: Pick<
      StorefrontAPI.PageInfo,
      'hasPreviousPage' | 'hasNextPage' | 'endCursor' | 'startCursor'
    >;
  };
};

export type SearchProductFragment = {__typename: 'Product'} & Pick<
  StorefrontAPI.Product,
  'handle' | 'id' | 'publishedAt' | 'title' | 'trackingParameters' | 'vendor'
> & {
    variants: {
      nodes: Array<
        Pick<StorefrontAPI.ProductVariant, 'id'> & {
          image?: StorefrontAPI.Maybe<
            Pick<StorefrontAPI.Image, 'url' | 'altText' | 'width' | 'height'>
          >;
          price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
          compareAtPrice?: StorefrontAPI.Maybe<
            Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
          >;
          selectedOptions: Array<
            Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
          >;
          product: Pick<StorefrontAPI.Product, 'handle' | 'title'>;
        }
      >;
    };
  };

export type SearchQueryVariables = StorefrontAPI.Exact<{
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  first?: StorefrontAPI.InputMaybe<StorefrontAPI.Scalars['Int']['input']>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
  query: StorefrontAPI.Scalars['String']['input'];
}>;

export type SearchQuery = {
  products: {
    nodes: Array<
      {__typename: 'Product'} & Pick<
        StorefrontAPI.Product,
        | 'handle'
        | 'id'
        | 'publishedAt'
        | 'title'
        | 'trackingParameters'
        | 'vendor'
      > & {
          collections: {nodes: Array<Pick<StorefrontAPI.Collection, 'handle'>>};
          variants: {
            nodes: Array<
              Pick<StorefrontAPI.ProductVariant, 'id'> & {
                image?: StorefrontAPI.Maybe<
                  Pick<
                    StorefrontAPI.Image,
                    'url' | 'altText' | 'width' | 'height'
                  >
                >;
                price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
                compareAtPrice?: StorefrontAPI.Maybe<
                  Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
                >;
                selectedOptions: Array<
                  Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
                >;
                product: Pick<StorefrontAPI.Product, 'handle' | 'title'>;
              }
            >;
          };
        }
    >;
  };
};

export type StoreRobotsQueryVariables = StorefrontAPI.Exact<{
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
}>;

export type StoreRobotsQuery = {shop: Pick<StorefrontAPI.Shop, 'id'>};

export type VerifyTokenQueryVariables = StorefrontAPI.Exact<{
  token: StorefrontAPI.Scalars['String']['input'];
}>;

export type VerifyTokenQuery = {
  customer?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Customer, 'id'>>;
};

export type AuthCustomerDetailsQueryVariables = StorefrontAPI.Exact<{
  token: StorefrontAPI.Scalars['String']['input'];
}>;

export type AuthCustomerDetailsQuery = {
  customer?: StorefrontAPI.Maybe<
    Pick<
      StorefrontAPI.Customer,
      'id' | 'firstName' | 'lastName' | 'phone' | 'email'
    > & {
      defaultAddress?: StorefrontAPI.Maybe<
        Pick<
          StorefrontAPI.MailingAddress,
          | 'id'
          | 'firstName'
          | 'lastName'
          | 'company'
          | 'address1'
          | 'address2'
          | 'city'
          | 'country'
          | 'countryCodeV2'
          | 'zip'
          | 'phone'
        >
      >;
      addresses: {
        nodes: Array<
          Pick<
            StorefrontAPI.MailingAddress,
            | 'id'
            | 'firstName'
            | 'lastName'
            | 'company'
            | 'address1'
            | 'address2'
            | 'city'
            | 'country'
            | 'countryCodeV2'
            | 'zip'
            | 'phone'
          >
        >;
      };
      orders: {
        nodes: Array<
          Pick<
            StorefrontAPI.Order,
            | 'id'
            | 'processedAt'
            | 'canceledAt'
            | 'cancelReason'
            | 'financialStatus'
            | 'fulfillmentStatus'
          > & {
            totalPrice: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
            totalRefunded: Pick<
              StorefrontAPI.MoneyV2,
              'amount' | 'currencyCode'
            >;
            lineItems: {
              nodes: Array<
                Pick<StorefrontAPI.OrderLineItem, 'currentQuantity'> & {
                  variant?: StorefrontAPI.Maybe<
                    Pick<StorefrontAPI.ProductVariant, 'id'> & {
                      price: Pick<
                        StorefrontAPI.MoneyV2,
                        'amount' | 'currencyCode'
                      >;
                      image?: StorefrontAPI.Maybe<
                        Pick<
                          StorefrontAPI.Image,
                          'id' | 'altText' | 'height' | 'width' | 'url'
                        >
                      >;
                    }
                  >;
                }
              >;
            };
          }
        >;
      };
    }
  >;
};

export type AuthCustomerUpdateMutationVariables = StorefrontAPI.Exact<{
  token: StorefrontAPI.Scalars['String']['input'];
  customer: StorefrontAPI.CustomerUpdateInput;
}>;

export type AuthCustomerUpdateMutation = {
  customerUpdate?: StorefrontAPI.Maybe<{
    customer?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Customer, 'id'>>;
    customerUserErrors: Array<
      Pick<StorefrontAPI.CustomerUserError, 'message' | 'code' | 'field'>
    >;
  }>;
};

export type AuthCustomerAddressCreateMutationVariables = StorefrontAPI.Exact<{
  token: StorefrontAPI.Scalars['String']['input'];
  address: StorefrontAPI.MailingAddressInput;
}>;

export type AuthCustomerAddressCreateMutation = {
  customerAddressCreate?: StorefrontAPI.Maybe<{
    customerAddress?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.MailingAddress, 'id'>
    >;
    customerUserErrors: Array<
      Pick<StorefrontAPI.CustomerUserError, 'message' | 'code' | 'field'>
    >;
  }>;
};

export type UpdateCartMutationVariables = StorefrontAPI.Exact<{
  cartId: StorefrontAPI.Scalars['ID']['input'];
  buyerIdentity: StorefrontAPI.CartBuyerIdentityInput;
}>;

export type UpdateCartMutation = {
  cartBuyerIdentityUpdate?: StorefrontAPI.Maybe<{
    cart?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Cart, 'id' | 'checkoutUrl'>>;
    userErrors: Array<Pick<StorefrontAPI.CartUserError, 'field' | 'message'>>;
  }>;
};

export type CreateCartMutationVariables = StorefrontAPI.Exact<{
  input: StorefrontAPI.CartInput;
}>;

export type CreateCartMutation = {
  cartCreate?: StorefrontAPI.Maybe<{
    cart?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Cart, 'id' | 'checkoutUrl'>>;
    userErrors: Array<Pick<StorefrontAPI.CartUserError, 'field' | 'message'>>;
  }>;
};

export type UpdateCustomerAddressMutationVariables = StorefrontAPI.Exact<{
  token: StorefrontAPI.Scalars['String']['input'];
  addressId: StorefrontAPI.Scalars['ID']['input'];
  address: StorefrontAPI.MailingAddressInput;
}>;

export type UpdateCustomerAddressMutation = {
  customerAddressUpdate?: StorefrontAPI.Maybe<{
    customerAddress?: StorefrontAPI.Maybe<
      Pick<
        StorefrontAPI.MailingAddress,
        | 'id'
        | 'firstName'
        | 'lastName'
        | 'address1'
        | 'address2'
        | 'city'
        | 'country'
        | 'zip'
        | 'phone'
      >
    >;
    customerUserErrors: Array<
      Pick<StorefrontAPI.CustomerUserError, 'field' | 'message'>
    >;
  }>;
};

export type SetDefaultAddressMutationVariables = StorefrontAPI.Exact<{
  token: StorefrontAPI.Scalars['String']['input'];
  addressId: StorefrontAPI.Scalars['ID']['input'];
}>;

export type SetDefaultAddressMutation = {
  customerDefaultAddressUpdate?: StorefrontAPI.Maybe<{
    customer?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.Customer, 'id'> & {
        defaultAddress?: StorefrontAPI.Maybe<
          Pick<StorefrontAPI.MailingAddress, 'id'>
        >;
      }
    >;
    customerUserErrors: Array<
      Pick<StorefrontAPI.CustomerUserError, 'field' | 'message'>
    >;
  }>;
};

export type AuthOrderQueryVariables = StorefrontAPI.Exact<{
  orderId: StorefrontAPI.Scalars['ID']['input'];
}>;

export type AuthOrderQuery = {
  node?: StorefrontAPI.Maybe<
    Pick<
      StorefrontAPI.Order,
      'id' | 'name' | 'statusUrl' | 'processedAt' | 'fulfillmentStatus'
    > & {
      totalTax?: StorefrontAPI.Maybe<
        Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
      >;
      totalPrice: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
      originalTotalPrice: Pick<
        StorefrontAPI.MoneyV2,
        'amount' | 'currencyCode'
      >;
      shippingAddress?: StorefrontAPI.Maybe<
        Pick<
          StorefrontAPI.MailingAddress,
          | 'address1'
          | 'address2'
          | 'city'
          | 'company'
          | 'country'
          | 'firstName'
          | 'lastName'
          | 'phone'
          | 'province'
          | 'zip'
        >
      >;
      discountApplications: {
        nodes: Array<{
          value:
            | ({__typename: 'MoneyV2'} & Pick<
                StorefrontAPI.MoneyV2,
                'amount' | 'currencyCode'
              >)
            | ({__typename: 'PricingPercentageValue'} & Pick<
                StorefrontAPI.PricingPercentageValue,
                'percentage'
              >);
        }>;
      };
      lineItems: {
        nodes: Array<
          Pick<StorefrontAPI.OrderLineItem, 'title' | 'quantity'> & {
            variant?: StorefrontAPI.Maybe<
              Pick<StorefrontAPI.ProductVariant, 'id' | 'title'> & {
                image?: StorefrontAPI.Maybe<
                  Pick<
                    StorefrontAPI.Image,
                    'altText' | 'height' | 'url' | 'id' | 'width'
                  >
                >;
              }
            >;
            originalTotalPrice: Pick<
              StorefrontAPI.MoneyV2,
              'amount' | 'currencyCode'
            >;
            discountAllocations: Array<{
              allocatedAmount: Pick<
                StorefrontAPI.MoneyV2,
                'amount' | 'currencyCode'
              >;
              discountApplication: {
                value:
                  | ({__typename: 'MoneyV2'} & Pick<
                      StorefrontAPI.MoneyV2,
                      'amount' | 'currencyCode'
                    >)
                  | ({__typename: 'PricingPercentageValue'} & Pick<
                      StorefrontAPI.PricingPercentageValue,
                      'percentage'
                    >);
              };
            }>;
          }
        >;
      };
    }
  >;
};

interface GeneratedQueryTypes {
  '#graphql\n  query CustomerDetails($customerAccessToken: String!) {\n    customer(customerAccessToken: $customerAccessToken) {\n      ...CustomerDetailsCustomer\n    }\n  }\n  #graphql\nfragment Customer on Customer {\n  id\n  firstName\n  lastName\n  phone\n  email\n  defaultAddress {\n    ...Address\n  }\n  addresses(first: 6) {\n    nodes {\n      ...Address\n    }\n  }\n  orders(first: 250, sortKey: PROCESSED_AT, reverse: true) {\n    nodes {\n      ...OrderCard\n    }\n  }\n}\n\nfragment OrderCard on Order {\n  id\n  processedAt\n  canceledAt\n  cancelReason\n  financialStatus\n  fulfillmentStatus\n  totalPrice {\n    amount\n    currencyCode\n  }\n  totalRefunded {\n    amount\n    currencyCode\n  }\n  lineItems(first: 3) {\n    nodes {\n      currentQuantity\n      variant {\n        id\n        price {\n          amount\n          currencyCode\n        }\n        image{\n          id\n          altText\n          height\n          width\n          url\n        }\n      }\n    }\n  }\n}\n\nfragment Address on MailingAddress {\n  id\n  firstName\n  lastName\n  company\n  address1\n  address2\n  city\n  country\n  countryCodeV2\n  zip\n  phone\n}\n\n': {
    return: CustomerDetailsQuery;
    variables: CustomerDetailsQueryVariables;
  };
  '#graphql\n  fragment CustomerOrderMoney on MoneyV2 {\n    amount\n    currencyCode\n  }\n  fragment CustomerOrderDiscountApplication on DiscountApplication {\n    value {\n      __typename\n      ... on MoneyV2 {\n        ...CustomerOrderMoney\n      }\n      ... on PricingPercentageValue {\n        percentage\n      }\n    }\n  }\n  fragment CustomerOrderLineItemFull on OrderLineItem {\n    variant {\n      id\n    }\n    title\n    quantity\n    originalTotalPrice {\n      ...CustomerOrderMoney\n    }\n    discountAllocations {\n      allocatedAmount {\n        ...CustomerOrderMoney\n      }\n      discountApplication {\n        ...CustomerOrderDiscountApplication\n      }\n    }\n    variant {\n      image {\n        altText\n        height\n        url\n        id\n        width\n      }\n      title\n    }\n  }\n  fragment CustomerOrderDetails on Order {\n    id\n    name\n    statusUrl\n    processedAt\n    fulfillmentStatus\n    totalTax {\n      ...CustomerOrderMoney\n    }\n    totalPrice {\n      ...CustomerOrderMoney\n    }\n    originalTotalPrice {\n      ...CustomerOrderMoney\n    }\n    shippingAddress {\n      address1\n      address2\n      city\n      company\n      country\n      firstName\n      lastName\n      phone\n      province\n      zip\n    }\n    discountApplications(first: 100) {\n      nodes {\n        ...CustomerOrderDiscountApplication\n      }\n    }\n    lineItems(first: 100) {\n      nodes {\n        ...CustomerOrderLineItemFull\n      }\n    }\n  }\n  query CustomerOrder($orderId: ID!) {\n    node(id: $orderId) {\n      ... on Order {\n        ...CustomerOrderDetails\n      }\n    }\n  }\n': {
    return: CustomerOrderQuery;
    variables: CustomerOrderQueryVariables;
  };
  '#graphql\n  #graphql\n  fragment CustomerOrders on Customer {\n    orders(\n      sortKey: PROCESSED_AT,\n      reverse: true,\n      first: $first,\n      last: $last,\n      before: $startCursor,\n      after: $endCursor\n    ) {\n      nodes {\n        ...OrderItem\n      }\n      pageInfo {\n        hasPreviousPage\n        hasNextPage\n        endCursor\n        startCursor\n      }\n    }\n  }\n  #graphql\n  fragment OrderItem on Order {\n    totalPrice {\n      amount\n      currencyCode\n    }\n    financialStatus\n    fulfillmentStatus\n    id\n    name\n    processedAt\n  }\n\n\n  query CustomerOrders(\n    $customerAccessToken: String!\n    $endCursor: String\n    $first: Int\n    $last: Int\n    $startCursor: String\n  ) {\n    customer(customerAccessToken: $customerAccessToken) {\n      ...CustomerOrders\n    }\n  }\n': {
    return: CustomerOrdersQuery;
    variables: CustomerOrdersQueryVariables;
  };
  '#graphql\n  #graphql\n  fragment ProductCard on Product {\n    id\n    title\n    publishedAt\n    handle\n    vendor\n    productType\n    tags\n    collections(first: 100) {\n      nodes {\n        handle\n      }\n    }\n    descriptionHtml\n    description\n    availableForSale\n    options {\n      name\n      values\n    }\n    priceRange {\n      minVariantPrice {\n        amount\n        currencyCode\n      }\n      maxVariantPrice {\n        amount\n        currencyCode\n      }\n    }\n    compareAtPriceRange{\n      minVariantPrice {\n        amount\n        currencyCode\n      }\n      maxVariantPrice {\n        amount\n        currencyCode\n      }\n    }\n    featuredImage {\n      id\n      altText\n      url\n      width\n      height\n    }\n    images(first: 5) {\n      nodes {\n        id\n        url\n        altText\n        width\n        height\n      }\n    }\n    variants(first: 250) {\n      nodes {\n        id\n        availableForSale\n        image {\n          url\n          altText\n          width\n          height\n        }\n        price {\n          amount\n          currencyCode\n        }\n        compareAtPrice {\n          amount\n          currencyCode\n        }\n        selectedOptions {\n          name\n          value\n        }\n        product {\n          handle\n          title\n        }\n      }\n    }\n  }\n\n  query Look(\n    $handle: String!\n    $country: CountryCode\n    $language: LanguageCode\n  ) @inContext(country: $country, language: $language) {\n    collection(handle: $handle) {\n      id\n      handle\n      title\n      description\n      image {\n        __typename\n        id\n        url\n        altText\n        width\n        height\n      }\n      products(first: 250) {\n        nodes {\n          ...ProductCard\n        }\n      }\n    }\n  }\n': {
    return: LookQuery;
    variables: LookQueryVariables;
  };
  '#graphql\n  #graphql\n  fragment ProductCard on Product {\n    id\n    title\n    publishedAt\n    handle\n    vendor\n    productType\n    tags\n    collections(first: 100) {\n      nodes {\n        handle\n      }\n    }\n    descriptionHtml\n    description\n    availableForSale\n    options {\n      name\n      values\n    }\n    priceRange {\n      minVariantPrice {\n        amount\n        currencyCode\n      }\n      maxVariantPrice {\n        amount\n        currencyCode\n      }\n    }\n    compareAtPriceRange{\n      minVariantPrice {\n        amount\n        currencyCode\n      }\n      maxVariantPrice {\n        amount\n        currencyCode\n      }\n    }\n    featuredImage {\n      id\n      altText\n      url\n      width\n      height\n    }\n    images(first: 5) {\n      nodes {\n        id\n        url\n        altText\n        width\n        height\n      }\n    }\n    variants(first: 250) {\n      nodes {\n        id\n        availableForSale\n        image {\n          url\n          altText\n          width\n          height\n        }\n        price {\n          amount\n          currencyCode\n        }\n        compareAtPrice {\n          amount\n          currencyCode\n        }\n        selectedOptions {\n          name\n          value\n        }\n        product {\n          handle\n          title\n        }\n      }\n    }\n  }\n\n  query OtherCollection(\n    $handle: String!\n    $first: Int\n    $country: CountryCode\n    $language: LanguageCode\n  ) @inContext(country: $country, language: $language) {\n    collection(handle: $handle) {\n      id\n      handle\n      title\n      description\n      image {\n        __typename\n        id\n        url\n        altText\n        width\n        height\n      }\n      products(\n        first: $first,\n      ) {\n        nodes {\n          ...ProductCard\n        }\n      }\n    }\n  }\n': {
    return: OtherCollectionQuery;
    variables: OtherCollectionQueryVariables;
  };
  '#graphql\n  #graphql\n  fragment ProductCard on Product {\n    id\n    title\n    publishedAt\n    handle\n    vendor\n    productType\n    tags\n    collections(first: 100) {\n      nodes {\n        handle\n      }\n    }\n    descriptionHtml\n    description\n    availableForSale\n    options {\n      name\n      values\n    }\n    priceRange {\n      minVariantPrice {\n        amount\n        currencyCode\n      }\n      maxVariantPrice {\n        amount\n        currencyCode\n      }\n    }\n    compareAtPriceRange{\n      minVariantPrice {\n        amount\n        currencyCode\n      }\n      maxVariantPrice {\n        amount\n        currencyCode\n      }\n    }\n    featuredImage {\n      id\n      altText\n      url\n      width\n      height\n    }\n    images(first: 5) {\n      nodes {\n        id\n        url\n        altText\n        width\n        height\n      }\n    }\n    variants(first: 250) {\n      nodes {\n        id\n        availableForSale\n        image {\n          url\n          altText\n          width\n          height\n        }\n        price {\n          amount\n          currencyCode\n        }\n        compareAtPrice {\n          amount\n          currencyCode\n        }\n        selectedOptions {\n          name\n          value\n        }\n        product {\n          handle\n          title\n        }\n      }\n    }\n  }\n\n  query GetProductsByIds($ids: [ID!]!) {\n  nodes(ids: $ids) {\n    ... on Product {\n      ...ProductCard\n    }\n  }\n}\n': {
    return: GetProductsByIdsQuery;
    variables: GetProductsByIdsQueryVariables;
  };
  '#graphql\n  query GetMetaobject(\n    $country: CountryCode\n    $language: LanguageCode\n    $handle: String!\n    $type: String!\n  ) @inContext(country: $country, language: $language) {\n    metaobject(handle: {handle: $handle, type: $type}) {\n      fields {\n        key\n        value\n        type\n        reference {\n          ... on MediaImage {\n            id\n            image {\n              url\n              altText\n              width\n              height\n            }\n          }\n        }\n        references(first: 2) {\n          nodes {\n            ... on MediaImage {\n              id\n              image {\n                url\n                altText\n                width\n                height\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n': {
    return: GetMetaobjectQuery;
    variables: GetMetaobjectQueryVariables;
  };
  '#graphql\n  fragment Shop on Shop {\n    id\n    name\n    description\n    primaryDomain {\n      url\n    }\n    brand {\n      logo {\n        image {\n          url\n        }\n      }\n    }\n  }\n  query Header(\n    $headerMenuHandle: String!\n    $language: LanguageCode\n  ) @inContext(language: $language) {\n    shop {\n      ...Shop\n    }\n    menu(handle: $headerMenuHandle) {\n      ...Menu\n    }\n  }\n  #graphql\n  fragment MenuItem on MenuItem {\n    id\n    resourceId\n    tags\n    title\n    type\n    url\n  }\n  fragment ChildMenuItem on MenuItem {\n    ...MenuItem\n    items {\n      ...MenuItem\n    }\n  }\n  fragment ParentMenuItem on MenuItem {\n    ...MenuItem\n    items {\n      ...ChildMenuItem\n    }\n  }\n  fragment Menu on Menu {\n    id\n    items {\n      ...ParentMenuItem\n    }\n  }\n\n': {
    return: HeaderQuery;
    variables: HeaderQueryVariables;
  };
  '#graphql\n    query GetCollectionProductFilters($handle: String!, $filters: [ProductFilter!], $country: CountryCode, $language: LanguageCode) @inContext(country: $country, language: $language) {\n      collection(handle: $handle) {\n        id\n        handle\n        products(first: 1, filters: $filters) {\n          filters {\n            id\n            label\n            values {\n              id\n              label\n              count\n            }\n          }\n        }\n      }\n    }\n  ': {
    return: GetCollectionProductFiltersQuery;
    variables: GetCollectionProductFiltersQueryVariables;
  };
  '#graphql\n  query Footer(\n    $footerMenuHandle: String!\n    $language: LanguageCode\n  ) @inContext(language: $language) {\n    menu(handle: $footerMenuHandle) {\n      ...Menu\n    }\n  }\n  #graphql\n  fragment MenuItem on MenuItem {\n    id\n    resourceId\n    tags\n    title\n    type\n    url\n  }\n  fragment ChildMenuItem on MenuItem {\n    ...MenuItem\n    items {\n      ...MenuItem\n    }\n  }\n  fragment ParentMenuItem on MenuItem {\n    ...MenuItem\n    items {\n      ...ChildMenuItem\n    }\n  }\n  fragment Menu on Menu {\n    id\n    items {\n      ...ParentMenuItem\n    }\n  }\n\n': {
    return: FooterQuery;
    variables: FooterQueryVariables;
  };
  '#graphql\n  query Sitemap($urlLimits: Int, $language: LanguageCode)\n  @inContext(language: $language) {\n    products(\n      first: $urlLimits\n      query: "published_status:\'online_store:visible\'"\n    ) {\n      nodes {\n        updatedAt\n        handle\n        onlineStoreUrl\n        title\n        featuredImage {\n          url\n          altText\n        }\n      }\n    }\n    collections(\n      first: $urlLimits\n      query: "published_status:\'online_store:visible\'"\n    ) {\n      nodes {\n        updatedAt\n        handle\n        onlineStoreUrl\n      }\n    }\n    pages(first: $urlLimits, query: "published_status:\'published\'") {\n      nodes {\n        updatedAt\n        handle\n        onlineStoreUrl\n      }\n    }\n  }\n': {
    return: SitemapQuery;
    variables: SitemapQueryVariables;
  };
  '#graphql\n  fragment PredictiveArticle on Article {\n    __typename\n    id\n    title\n    handle\n    image {\n      url\n      altText\n      width\n      height\n    }\n    trackingParameters\n  }\n  fragment PredictiveCollection on Collection {\n    __typename\n    id\n    title\n    handle\n    image {\n      url\n      altText\n      width\n      height\n    }\n    trackingParameters\n  }\n  fragment PredictivePage on Page {\n    __typename\n    id\n    title\n    handle\n    trackingParameters\n  }\n  fragment PredictiveProduct on Product {\n    __typename\n    id\n    title\n    handle\n    trackingParameters\n    variants(first: 1) {\n      nodes {\n        id\n        image {\n          url\n          altText\n          width\n          height\n        }\n        price {\n          amount\n          currencyCode\n        }\n      }\n    }\n  }\n  fragment PredictiveQuery on SearchQuerySuggestion {\n    __typename\n    text\n    styledText\n    trackingParameters\n  }\n  query predictiveSearch(\n    $country: CountryCode\n    $language: LanguageCode\n    $limit: Int!\n    $limitScope: PredictiveSearchLimitScope!\n    $searchTerm: String!\n    $types: [PredictiveSearchType!]\n  ) @inContext(country: $country, language: $language) {\n    predictiveSearch(\n      limit: $limit,\n      limitScope: $limitScope,\n      query: $searchTerm,\n      types: $types,\n    ) {\n      articles {\n        ...PredictiveArticle\n      }\n      collections {\n        ...PredictiveCollection\n      }\n      pages {\n        ...PredictivePage\n      }\n      products {\n        ...PredictiveProduct\n      }\n      queries {\n        ...PredictiveQuery\n      }\n    }\n  }\n': {
    return: PredictiveSearchQuery;
    variables: PredictiveSearchQueryVariables;
  };
  '#graphql\n  #graphql\n  fragment ProductCard on Product {\n    id\n    title\n    publishedAt\n    handle\n    vendor\n    productType\n    tags\n    collections(first: 100) {\n      nodes {\n        handle\n      }\n    }\n    descriptionHtml\n    description\n    availableForSale\n    options {\n      name\n      values\n    }\n    priceRange {\n      minVariantPrice {\n        amount\n        currencyCode\n      }\n      maxVariantPrice {\n        amount\n        currencyCode\n      }\n    }\n    compareAtPriceRange{\n      minVariantPrice {\n        amount\n        currencyCode\n      }\n      maxVariantPrice {\n        amount\n        currencyCode\n      }\n    }\n    featuredImage {\n      id\n      altText\n      url\n      width\n      height\n    }\n    images(first: 5) {\n      nodes {\n        id\n        url\n        altText\n        width\n        height\n      }\n    }\n    variants(first: 250) {\n      nodes {\n        id\n        availableForSale\n        image {\n          url\n          altText\n          width\n          height\n        }\n        price {\n          amount\n          currencyCode\n        }\n        compareAtPrice {\n          amount\n          currencyCode\n        }\n        selectedOptions {\n          name\n          value\n        }\n        product {\n          handle\n          title\n        }\n      }\n    }\n  }\n\n  query Collection(\n    $handle: String!\n    $country: CountryCode\n    $language: LanguageCode\n    $filters: [ProductFilter!]\n    $sortKey: ProductCollectionSortKeys!\n    $reverse: Boolean\n    $first: Int\n    $last: Int\n    $startCursor: String\n    $endCursor: String\n  ) @inContext(country: $country, language: $language) {\n    collection(handle: $handle) {\n      id\n      handle\n      title\n      description\n      seo {\n        description\n        title\n      }\n      image {\n        id\n        url\n        width\n        height\n        altText\n      }\n      products(\n        first: $first,\n        last: $last,\n        before: $startCursor,\n        after: $endCursor,\n        filters: $filters,\n        sortKey: $sortKey,\n        reverse: $reverse\n      ) {\n        filters {\n          id\n          label\n          type\n          values {\n            id\n            label\n            count\n            input\n          }\n        }\n        nodes {\n          ...ProductCard\n        }\n        pageInfo {\n          hasPreviousPage\n          hasNextPage\n          endCursor\n          startCursor\n        }\n      }\n      allProducts: products(\n        first: 250,\n      ) {\n        nodes {\n          id\n        }\n      }\n      filteredProducts: products(\n        first: 250,\n        filters: $filters,\n      ) {\n        nodes {\n          id\n        }\n      }\n    }\n  }\n': {
    return: CollectionQuery;
    variables: CollectionQueryVariables;
  };
  '#graphql\n  fragment Policy on ShopPolicy {\n    body\n    handle\n    id\n    title\n    url\n  }\n  query Policy(\n    $language: LanguageCode\n    $privacyPolicy: Boolean!\n    $refundPolicy: Boolean!\n    $shippingPolicy: Boolean!\n    $termsOfService: Boolean!\n  ) @inContext(language: $language) {\n    shop {\n      privacyPolicy @include(if: $privacyPolicy) {\n        ...Policy\n      }\n      shippingPolicy @include(if: $shippingPolicy) {\n        ...Policy\n      }\n      termsOfService @include(if: $termsOfService) {\n        ...Policy\n      }\n      refundPolicy @include(if: $refundPolicy) {\n        ...Policy\n      }\n    }\n  }\n': {
    return: PolicyQuery;
    variables: PolicyQueryVariables;
  };
  '#graphql\n  fragment PolicyItem on ShopPolicy {\n    id\n    title\n    handle\n  }\n  query Policies ($language: LanguageCode)\n    @inContext(language: $language) {\n    shop {\n      privacyPolicy {\n        ...PolicyItem\n      }\n      shippingPolicy {\n        ...PolicyItem\n      }\n      termsOfService {\n        ...PolicyItem\n      }\n      refundPolicy {\n        ...PolicyItem\n      }\n      subscriptionPolicy {\n        id\n        title\n        handle\n      }\n    }\n  }\n': {
    return: PoliciesQuery;
    variables: PoliciesQueryVariables;
  };
  '#graphql\n  #graphql\n  fragment ProductCard on Product {\n    id\n    title\n    publishedAt\n    handle\n    vendor\n    productType\n    tags\n    collections(first: 100) {\n      nodes {\n        handle\n      }\n    }\n    descriptionHtml\n    description\n    availableForSale\n    options {\n      name\n      values\n    }\n    priceRange {\n      minVariantPrice {\n        amount\n        currencyCode\n      }\n      maxVariantPrice {\n        amount\n        currencyCode\n      }\n    }\n    compareAtPriceRange{\n      minVariantPrice {\n        amount\n        currencyCode\n      }\n      maxVariantPrice {\n        amount\n        currencyCode\n      }\n    }\n    featuredImage {\n      id\n      altText\n      url\n      width\n      height\n    }\n    images(first: 5) {\n      nodes {\n        id\n        url\n        altText\n        width\n        height\n      }\n    }\n    variants(first: 250) {\n      nodes {\n        id\n        availableForSale\n        image {\n          url\n          altText\n          width\n          height\n        }\n        price {\n          amount\n          currencyCode\n        }\n        compareAtPrice {\n          amount\n          currencyCode\n        }\n        selectedOptions {\n          name\n          value\n        }\n        product {\n          handle\n          title\n        }\n      }\n    }\n  }\n\n  query CollectionDynamicProducts(\n    $handle: String!\n    $country: CountryCode\n    $language: LanguageCode\n    $firstFilter: [ProductFilter!]\n    $secondFilter: [ProductFilter!]\n  ) @inContext(country: $country, language: $language) {\n    collection(handle: $handle) {\n      id\n      handle\n      title\n      description\n      firstProduct: products(first: 1, filters: $firstFilter) {\n        nodes {\n          ...ProductCard\n        }\n      }\n      secondProduct: products(first: 1, filters: $secondFilter) {\n        nodes {\n          ...ProductCard\n        }\n      }\n    }\n  }\n': {
    return: CollectionDynamicProductsQuery;
    variables: CollectionDynamicProductsQueryVariables;
  };
  '#graphql\n  query Product(\n    $country: CountryCode\n    $handle: String!\n    $language: LanguageCode\n    $selectedOptions: [SelectedOptionInput!]!\n  ) @inContext(country: $country, language: $language) {\n    product(handle: $handle) {\n      ...Product\n    }\n  }\n  #graphql\n  fragment Product on Product {\n    id\n    title\n    vendor\n    tags\n    productType\n    handle\n    descriptionHtml\n    description\n    options {\n      name\n      values\n    }\n    collections(first: 100) {\n      nodes {\n        handle\n      }\n    }\n    priceRange {\n      minVariantPrice {\n        amount\n        currencyCode\n      }\n      maxVariantPrice {\n        amount\n        currencyCode\n      }\n    }\n    compareAtPriceRange {\n      minVariantPrice {\n        amount\n        currencyCode\n      }\n      maxVariantPrice {\n        amount\n        currencyCode\n      }\n    }\n    featuredImage {\n      id\n      altText\n      url\n      width\n      height\n    }\n    images(first: 100) {\n      nodes {\n        __typename\n        id\n        url\n        altText\n        width\n        height\n      }\n    }\n    media(first: 100) {\n      nodes {\n        __typename\n        previewImage {\n          id\n          url\n          altText\n        }\n        ... on Video {\n          mediaContentType\n          sources {\n            format\n            url\n          }\n        }\n      }\n    }\n    selectedVariant: variantBySelectedOptions(selectedOptions: $selectedOptions, ignoreUnknownOptions: true, caseInsensitiveMatch: true) {\n      ...ProductVariant\n    }\n    variants(first: 1) {\n      nodes {\n        ...ProductVariant\n      }\n    }\n    seo {\n      description\n      title\n    }\n  }\n  #graphql\n  fragment ProductVariant on ProductVariant {\n    availableForSale\n    compareAtPrice {\n      amount\n      currencyCode\n    }\n    id\n    image {\n      __typename\n      id\n      url\n      altText\n      width\n      height\n    }\n    price {\n      amount\n      currencyCode\n    }\n    product {\n      title\n      tags\n      productType\n      handle\n    }\n    selectedOptions {\n      name\n      value\n    }\n    sku\n    title\n    unitPrice {\n      amount\n      currencyCode\n    }\n  }\n\n\n': {
    return: ProductQuery;
    variables: ProductQueryVariables;
  };
  '#graphql\n  #graphql\n  fragment ProductVariants on Product {\n    variants(first: 250) {\n      nodes {\n        ...ProductVariant\n      }\n    }\n  }\n  #graphql\n  fragment ProductVariant on ProductVariant {\n    availableForSale\n    compareAtPrice {\n      amount\n      currencyCode\n    }\n    id\n    image {\n      __typename\n      id\n      url\n      altText\n      width\n      height\n    }\n    price {\n      amount\n      currencyCode\n    }\n    product {\n      title\n      tags\n      productType\n      handle\n    }\n    selectedOptions {\n      name\n      value\n    }\n    sku\n    title\n    unitPrice {\n      amount\n      currencyCode\n    }\n  }\n\n\n  query ProductVariants(\n    $country: CountryCode\n    $language: LanguageCode\n    $handle: String!\n  ) @inContext(country: $country, language: $language) {\n    product(handle: $handle) {\n      ...ProductVariants\n    }\n  }\n': {
    return: ProductVariantsQuery;
    variables: ProductVariantsQueryVariables;
  };
  '#graphql\n  #graphql\n  fragment ProductCard on Product {\n    id\n    title\n    publishedAt\n    handle\n    vendor\n    productType\n    tags\n    collections(first: 100) {\n      nodes {\n        handle\n      }\n    }\n    descriptionHtml\n    description\n    availableForSale\n    options {\n      name\n      values\n    }\n    priceRange {\n      minVariantPrice {\n        amount\n        currencyCode\n      }\n      maxVariantPrice {\n        amount\n        currencyCode\n      }\n    }\n    compareAtPriceRange{\n      minVariantPrice {\n        amount\n        currencyCode\n      }\n      maxVariantPrice {\n        amount\n        currencyCode\n      }\n    }\n    featuredImage {\n      id\n      altText\n      url\n      width\n      height\n    }\n    images(first: 5) {\n      nodes {\n        id\n        url\n        altText\n        width\n        height\n      }\n    }\n    variants(first: 250) {\n      nodes {\n        id\n        availableForSale\n        image {\n          url\n          altText\n          width\n          height\n        }\n        price {\n          amount\n          currencyCode\n        }\n        compareAtPrice {\n          amount\n          currencyCode\n        }\n        selectedOptions {\n          name\n          value\n        }\n        product {\n          handle\n          title\n        }\n      }\n    }\n  }\n\n  query Products($country: CountryCode, $language: LanguageCode, $sortKey: ProductSortKeys!, $reverse: Boolean, $query: String,, $first: Int, $last: Int, $startCursor: String, $endCursor: String) @inContext(country: $country, language: $language) {\n    products(\n      first: $first\n      last: $last\n      before: $startCursor\n      after: $endCursor\n      query: $query\n      sortKey: $sortKey\n      reverse: $reverse\n    ) {\n      nodes {\n        ...ProductCard\n      }\n      pageInfo {\n        hasPreviousPage\n        hasNextPage\n        endCursor\n        startCursor\n      }\n    }\n  }\n': {
    return: ProductsQuery;
    variables: ProductsQueryVariables;
  };
  '#graphql\n  fragment SearchProduct on Product {\n    __typename\n    handle\n    id\n    publishedAt\n    title\n    trackingParameters\n    vendor\n    variants(first: 1) {\n      nodes {\n        id\n        image {\n          url\n          altText\n          width\n          height\n        }\n        price {\n          amount\n          currencyCode\n        }\n        compareAtPrice {\n          amount\n          currencyCode\n        }\n        selectedOptions {\n          name\n          value\n        }\n        product {\n          handle\n          title\n        }\n      }\n    }\n  }\n  query search(\n    $country: CountryCode\n    $first: Int\n    $language: LanguageCode\n    $query: String!\n  ) @inContext(country: $country, language: $language) {\n    products: search(\n      query: $query,\n      unavailableProducts: HIDE,\n      types: [PRODUCT],\n      first: $first,\n      sortKey: RELEVANCE,\n    ) {\n      nodes {\n        ...on Product {\n          ...SearchProduct\n          collections(first: 100) {\n            nodes {\n              handle\n            }\n          }\n        }\n      }\n    }\n  }\n': {
    return: SearchQuery;
    variables: SearchQueryVariables;
  };
  '#graphql\n  query StoreRobots($language: LanguageCode)\n   @inContext(language: $language) {\n    shop {\n      id\n    }\n  }\n': {
    return: StoreRobotsQuery;
    variables: StoreRobotsQueryVariables;
  };
  '#graphql\n    query VerifyToken($token: String!) {\n      customer(customerAccessToken: $token) {\n        id\n      }\n    }\n  ': {
    return: VerifyTokenQuery;
    variables: VerifyTokenQueryVariables;
  };
  '#graphql\n  query AuthCustomerDetails($token: String!) {\n    customer(customerAccessToken: $token) {\n      ...Customer\n    }\n  }\n  #graphql\nfragment Customer on Customer {\n  id\n  firstName\n  lastName\n  phone\n  email\n  defaultAddress {\n    ...Address\n  }\n  addresses(first: 6) {\n    nodes {\n      ...Address\n    }\n  }\n  orders(first: 250, sortKey: PROCESSED_AT, reverse: true) {\n    nodes {\n      ...OrderCard\n    }\n  }\n}\n\nfragment OrderCard on Order {\n  id\n  processedAt\n  canceledAt\n  cancelReason\n  financialStatus\n  fulfillmentStatus\n  totalPrice {\n    amount\n    currencyCode\n  }\n  totalRefunded {\n    amount\n    currencyCode\n  }\n  lineItems(first: 3) {\n    nodes {\n      currentQuantity\n      variant {\n        id\n        price {\n          amount\n          currencyCode\n        }\n        image{\n          id\n          altText\n          height\n          width\n          url\n        }\n      }\n    }\n  }\n}\n\nfragment Address on MailingAddress {\n  id\n  firstName\n  lastName\n  company\n  address1\n  address2\n  city\n  country\n  countryCodeV2\n  zip\n  phone\n}\n\n': {
    return: AuthCustomerDetailsQuery;
    variables: AuthCustomerDetailsQueryVariables;
  };
  '#graphql\n  query AuthOrder($orderId: ID!) {\n    node(id: $orderId) {\n      ... on Order {\n        ...Order\n      }\n    }\n  }\n  #graphql\n  fragment OrderMoney on MoneyV2 {\n    amount\n    currencyCode\n  }\n  fragment DiscountApplication on DiscountApplication {\n    value {\n      __typename\n      ... on MoneyV2 {\n        ...OrderMoney\n      }\n      ... on PricingPercentageValue {\n        percentage\n      }\n    }\n  }\n  fragment Order on Order {\n    id\n    name\n    statusUrl\n    processedAt\n    fulfillmentStatus\n    totalTax {\n      ...OrderMoney\n    }\n    totalPrice {\n      ...OrderMoney\n    }\n    originalTotalPrice {\n      ...OrderMoney\n    }\n    shippingAddress {\n      address1\n      address2\n      city\n      company\n      country\n      firstName\n      lastName\n      phone\n      province\n      zip\n    }\n    discountApplications(first: 100) {\n      nodes {\n        ...DiscountApplication\n      }\n    }\n    lineItems(first: 100) {\n      nodes {\n        variant {\n          id\n          image {\n            altText\n            height\n            url\n            id\n            width\n          }\n          title\n        }\n        title\n        quantity\n        originalTotalPrice {\n          ...OrderMoney\n        }\n        discountAllocations {\n          allocatedAmount {\n            ...OrderMoney\n          }\n          discountApplication {\n            ...DiscountApplication\n          }\n        }\n      }\n    }\n  }\n\n  ': {
    return: AuthOrderQuery;
    variables: AuthOrderQueryVariables;
  };
}

interface GeneratedMutationTypes {
  '#graphql\n  mutation customerAddressUpdate(\n    $address: MailingAddressInput!\n    $id: ID!\n    $customerAccessToken: String!\n  ) {\n    customerAddressUpdate(\n      address: $address\n      id: $id\n      customerAccessToken: $customerAccessToken\n    ) {\n      customerAddress {\n        id\n      }\n      customerUserErrors {\n        field\n        message\n      }\n    }\n  }\n': {
    return: CustomerAddressUpdateMutation;
    variables: CustomerAddressUpdateMutationVariables;
  };
  '#graphql\n  mutation customerAddressDelete(\n    $id: ID!,\n    $customerAccessToken: String!\n  ) {\n    customerAddressDelete(\n      id: $id,\n      customerAccessToken: $customerAccessToken\n    ) {\n      deletedCustomerAddressId\n      customerUserErrors {\n        field\n        message\n      }\n    }\n  }\n': {
    return: CustomerAddressDeleteMutation;
    variables: CustomerAddressDeleteMutationVariables;
  };
  '#graphql\n  mutation customerAddressCreate(\n    $address: MailingAddressInput!\n    $customerAccessToken: String!\n  ) {\n    customerAddressCreate(\n      address: $address\n      customerAccessToken: $customerAccessToken\n    ) {\n      customerAddress {\n        id\n      }\n      customerUserErrors {\n        field\n        message\n      }\n    }\n  }\n': {
    return: CustomerAddressCreateMutation;
    variables: CustomerAddressCreateMutationVariables;
  };
  '#graphql\n  # https://shopify.dev/docs/api/customer/latest/mutations/customerUpdate\n  mutation customerUpdate(\n    $customerAccessToken: String!\n    $customer: CustomerUpdateInput!\n  ) {\n    customerUpdate(\n      customerAccessToken: $customerAccessToken\n      customer: $customer\n    ) {\n      customer {\n        id\n        email\n        phone\n        firstName\n        lastName\n      }\n      customerUserErrors {\n        field\n        message\n      }\n    }\n  }\n': {
    return: CustomerUpdateMutation;
    variables: CustomerUpdateMutationVariables;
  };
  '#graphql\n    mutation RouteCustomerAddressDelete($addressId: ID!, $token: String!) {\n      customerAddressDelete(customerAccessToken: $token, id: $addressId) {\n        deletedCustomerAddressId\n        customerUserErrors {\n          code\n          field\n          message\n        }\n      }\n    }\n    ': {
    return: RouteCustomerAddressDeleteMutation;
    variables: RouteCustomerAddressDeleteMutationVariables;
  };
  '#graphql\n    mutation AuthCustomerUpdate(\n      $token: String!,\n      $customer: CustomerUpdateInput!\n    ){\n      customerUpdate(\n        customerAccessToken: $token,\n        customer: $customer\n      ){\n        customer {\n          id\n        }\n        customerUserErrors{\n          message,\n          code,\n          field,\n        }\n      }\n    }\n  ': {
    return: AuthCustomerUpdateMutation;
    variables: AuthCustomerUpdateMutationVariables;
  };
  '#graphql\n  mutation AuthCustomerAddressCreate(\n    $token: String!,\n    $address: MailingAddressInput!\n  ) {\n    customerAddressCreate(\n      customerAccessToken:$token,\n      address: $address\n    ) {\n      customerAddress {\n        id\n      }\n      customerUserErrors{\n        message,\n        code,\n        field,\n      }\n    }\n  }\n  ': {
    return: AuthCustomerAddressCreateMutation;
    variables: AuthCustomerAddressCreateMutationVariables;
  };
  '#graphql\n  mutation UpdateCart($cartId: ID!, $buyerIdentity: CartBuyerIdentityInput!) {\n    cartBuyerIdentityUpdate(cartId: $cartId, buyerIdentity: $buyerIdentity) {\n      cart {\n        id\n        checkoutUrl\n      }\n      userErrors {\n        field\n        message\n      }\n    }\n  }\n  ': {
    return: UpdateCartMutation;
    variables: UpdateCartMutationVariables;
  };
  '#graphql\n  mutation CreateCart($input: CartInput!) {\n    cartCreate(input: $input) {\n      cart {\n        id\n        checkoutUrl\n      }\n      userErrors {\n        field\n        message\n      }\n    }\n  }\n  ': {
    return: CreateCartMutation;
    variables: CreateCartMutationVariables;
  };
  '#graphql\n  mutation UpdateCustomerAddress($token: String!, $addressId: ID!, $address: MailingAddressInput!) {\n    customerAddressUpdate(customerAccessToken: $token, id: $addressId, address: $address) {\n      customerAddress {\n        id\n        firstName\n        lastName\n        address1\n        address2\n        city\n        country\n        zip\n        phone\n      }\n      customerUserErrors {\n        field\n        message\n      }\n    }\n  }\n  ': {
    return: UpdateCustomerAddressMutation;
    variables: UpdateCustomerAddressMutationVariables;
  };
  '#graphql\n  mutation SetDefaultAddress($token: String!, $addressId: ID!) {\n    customerDefaultAddressUpdate(customerAccessToken: $token, addressId: $addressId) {\n      customer {\n        id\n        defaultAddress {\n          id\n        }\n      }\n      customerUserErrors {\n        field\n        message\n      }\n    }\n  }\n  ': {
    return: SetDefaultAddressMutation;
    variables: SetDefaultAddressMutationVariables;
  };
}

declare module '@shopify/hydrogen' {
  interface StorefrontQueries extends GeneratedQueryTypes {}
  interface StorefrontMutations extends GeneratedMutationTypes {}
}
