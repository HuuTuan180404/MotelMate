export interface RequestModel {
  requestID: number;
  title: string;
  content: string;
  image?: string;
  type: string;
  createAt: string;
  status: string;
  tenantID?: number;
  tenantName?: string;
  ownerID?: number;
  roomName: string;
  buildingName: string;
  roomID: number; 
}
export interface RegisterRoomRequest {
  roomID: number;
  startDate: string;  // yyyy-MM-dd
  endDate: string;    // yyyy-MM-dd
}


