export interface AssetModel {
  assetID: number;
  name: string;
  price: number;
  type: string;
  description?: string; // dấu ? là optional giống nullable
  quantity: number;
}
