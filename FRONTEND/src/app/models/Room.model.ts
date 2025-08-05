export interface RoomModel {
  roomID: number;
  roomNumber: string;
  price: number;
  status: string;
  buildingID: number;
  buildingName: string;
  urlImage: string;
  urlAvatars: string[];
}

export interface CreateRoomModel {
  buildingID: number;
  roomNumber: string;
  area: number;
  price: number;
  maxGuests: number;
  description: string;
  images: RoomImageModel[];
  selectedAssetIDs: number[];
}

export interface RoomImageModel {
  id: string;
  file: File;
  url: string | ArrayBuffer | null;
  isThumb: boolean;
  name: string;
  size: number;
}

export interface UpdateRoomAssetDTO {
  assetID: number;
  quantity: number;
}

export interface UpdateRoomDTO {
  roomID: number;
  roomNumber: string;
  area: number;
  price: number;
  maxGuests: number;
  description?: string;
  addedMembers?: number[];
  deletedMembers?: number[];
  deletedImages?: string[];
  assets?: UpdateRoomAssetDTO[];
  terminateContract: boolean;
}
