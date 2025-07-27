import { TenantModel } from './Tenant.model';

export interface RoomDetailModel {
  roomID: number;
  roomNumber: string;
  area: number;
  price: number;
  status: string;
  description: string;

  buildingID: number;
  buildingName: string;
  buildingAddress: string;

  ownerID: number;
  ownerFullName: string;
  ownerPhoneNumber: string;

  urlRoomImages: string[];

  members: TenantModel[];

  assetData: object[];
}
