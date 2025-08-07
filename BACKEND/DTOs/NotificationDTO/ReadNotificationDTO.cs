namespace BACKEND.RoomDTO.DTOs
{
    public class ReadNotificationDTO
    {
        public int NotiID { get; set; }
        public required string Title { get; set; }
        public required string Content { get; set; }
        public DateTime CreateAt { get; set; }
        public bool IsRead { get; set; }
    }
}
