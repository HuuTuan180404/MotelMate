export interface ContractDetailModel {
  contractID: number;
  tenantID: number;
  startDate: string;
  endDate?: string;
  isRoomRepresentative: boolean;
}
