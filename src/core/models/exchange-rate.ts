import { type ExchangeRateId } from "./branded";

export interface ExchangeRate {
  id: ExchangeRateId;
  baseCurrency: string; // AssetCode
  currency: string; // AssetCode
  rate: number; // PositiveDouble
  manualOverride: boolean;
}
