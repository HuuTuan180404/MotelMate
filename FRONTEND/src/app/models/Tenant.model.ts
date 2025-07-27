import { ContractDetailModel } from './ContractDetail';

export interface TenantModel {
  id: number;
  fullName: string;
  cccd: string;
  bdate?: string;
  phoneNumber: string;
  status: string;
  urlAvatar: string;
  contractDetails: ContractDetailModel[];
}
