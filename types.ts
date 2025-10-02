// Copyright James Burvel O’Callaghan III
// President Citibank Demo Business Inc.


export interface Script {
  id: string;
  name: string;
  description: string;
  code: string;
}

export interface PaymentOption {
  id: string;
  name: string;
  enabled: boolean;
}

export enum MonetizationType {
    PAY_PER_VIEW = 'Pay-per-view',
    PER_PAGE = 'Per-page unlock',
    FULL_DOCUMENT = 'Full document unlock',
}

export interface Monetization {
    type: MonetizationType;
    price: number;
}
