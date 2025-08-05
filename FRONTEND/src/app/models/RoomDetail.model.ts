import { TenantModel } from './Tenant.model';

export class RoomDetailModel {
  roomID: number = -1;
  roomNumber: string = '';
  area: number = 0;
  price: number = 0;
  status: string = '';
  maxGuests: number = 4;
  description: string = '';

  buildingID: number = -1;
  buildingName: string = '';
  buildingAddress: string = '';

  ownerID: number = -1;
  ownerFullName: string = '';
  ownerPhoneNumber: string = '';

  urlRoomImages: string[] = [];
  members: TenantModel[] = [];
  assetData: {
    assetID: number;
    assetName: string;
    quantity: number;
  }[] = [];
}
