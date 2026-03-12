export interface NbpRate {
  currency: string;
  code: string;
  mid: number;
}

export interface NbpTable {
  table: string;
  no: string;
  effectiveDate: string;
  rates: NbpRate[];
}

export type CurrencyCode = 'PLN' | 'EUR' | 'USD';

export interface CurrencyMeta {
  code: CurrencyCode;
  name: string;
  flag: string;
  symbol: string;
  color: string;
}

export interface ExchangeRates {
  PLN: number;
  EUR: number;
  USD: number;
  effectiveDate: string;
  tableNo: string;
}

export interface RateStatus {
  isBusinessDay: boolean;
  isAfterPublication: boolean;
  polandTime: string;
  polandDate: string;
  message: string;
  statusType: 'fresh' | 'pending' | 'weekend';
}
