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
  description: string;
  images: RoomImageModel[];
  selectedAssetIDs: number[];
}

export interface RoomImageModel {
  id: string;
  file: File;
  url: string;
  isThumb: boolean;
  name: string;
  size: number;
}
