export interface CreateNotificationDTO {
  title: string;
  content: string;
  selectedBuildings: number[];
  selectedRooms: number[];
}

export interface ReadNotificationDTO {
  notiID: number;
  title: string;
  content: string;
  createAt: Date;
  isRead: boolean;
}
