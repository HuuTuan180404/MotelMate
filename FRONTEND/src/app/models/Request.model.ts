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
}
