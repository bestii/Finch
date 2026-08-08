import {
  type CategoryId,
  type HexColor,
  type IconAsset,
} from "./branded";

export interface Category {
  id: CategoryId;
  name: string; // NotBlankTrimmedString
  color: HexColor;
  icon: IconAsset | null;
  orderNum: number;
}
