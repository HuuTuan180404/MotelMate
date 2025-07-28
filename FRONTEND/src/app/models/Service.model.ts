export interface ServiceTier {
  serviceTierID?: number;
  fromQuantity: number;
  toQuantity: number;
  govUnitPrice: number;
}

export interface ServiceItem {
  serviceID: number;
  name: string;
  unit: string;
  customerPrice: number;
  initialPrice: number;
  isTiered: boolean;
  serviceTier?: ServiceTier[];
}
