export interface Building {
  buildingID: number;
  name: string;
  address: string;
  imageURL: string;
  totalRooms: number;
  availableRooms: number;
  occupiedRooms: number;
  maintenanceRooms: number;
  totalTenants: number;
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