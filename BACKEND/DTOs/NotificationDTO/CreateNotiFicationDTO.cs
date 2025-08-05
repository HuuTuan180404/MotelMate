namespace BACKEND.RoomDTO.DTOs
{
    public class CreateNotificationDTO
    {
        public required string Title { get; set; }
        public required string Content { get; set; }
        // public DateTime CreateAt { get; set; } = DateTime.Now;
        public List<int>? SelectedBuildings { get; set; } // ID tòa nhận
        public List<int>? SelectedRooms { get; set; } // hoặc ID phòng nhận  | 1 trong 2
    }
}
