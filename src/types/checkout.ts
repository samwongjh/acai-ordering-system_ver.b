export type CurrencyCode = 'USD' | 'GBP' | 'EUR';

export type DesignVariant = 'improved' | 'original';

export type FulfillmentMode = 'pickup' | 'delivery';

export interface CartItem {
  id: string;
  name: string;
  subtitle: string;
  price: number;
  quantity: number;
  image: string;
}

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
}

export const CURRENCIES: Record<CurrencyCode, CurrencyConfig> = {
  USD: {code: 'USD', symbol: '$'},
  GBP: {code: 'GBP', symbol: '£'},
  EUR: {code: 'EUR', symbol: '€'},
};
