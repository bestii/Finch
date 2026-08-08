import { type AccountId, type HexColor, type IconAsset } from "./branded";

export interface Account {
  id: AccountId;
  name: string; // NotBlankTrimmedString
  asset: string; // AssetCode (e.g., "USD", "EUR", "BTC")
  color: HexColor;
  icon: IconAsset | null;
  includeInBalance: boolean;
  orderNum: number;
}
