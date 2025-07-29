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
  buildingID: number; // Changed to array for multiple selection
  roomNumber: string;
  area: number;
  price: number;
  description: string;
  images: RoomImageModel[];
  selectedAssets: number[];
}

export interface RoomImageModel {
  id: string;
  file: File;
  url: string;
  isThumb: boolean;
  name: string;
  size: number;
}
