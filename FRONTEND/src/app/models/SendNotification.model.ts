export interface CreateNotificationDTO {
  title: string;
  content: string;
  selectedBuildings: number[];
  selectedRooms: number[];
}
