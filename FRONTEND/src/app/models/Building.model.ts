export interface Building {
  buildingID: number;
  buildingCode: string;
  name: string;
  address: string;
  ownerID: number;
}

export interface BuildingWithRoomsModel {
  buildingID: number;
  buildingName: string;
  buildingAddress: string;
  rooms: {
    roomID: number;
    roomNumber: string;
  }[];
}
