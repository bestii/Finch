import {
  type TagId,
  type HexColor,
  type IconAsset,
} from "./branded";

export interface Tag {
  id: TagId;
  name: string; // NotBlankTrimmedString
  description: string | null;
  color: HexColor;
  icon: IconAsset | null;
  orderNum: number;
  creationTimestamp: string; // ISO 8601 Instant
}

export interface TagAssociation {
  tagId: TagId;
  associatedId: string; // AssociationId (polymorphic FK)
}
