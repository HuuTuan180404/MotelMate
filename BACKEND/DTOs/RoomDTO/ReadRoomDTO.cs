namespace BACKEND.RoomDTO.DTOs
{
    using System;
    using BACKEND.Enums;

    public class ReadRoomDTO
    {
        public int RoomID { get; set; }
        public string RoomNumber { get; set; }
        public decimal Price { get; set; }
        public string Status { get; set; }
        public Nullable<int> BuildingID { get; set; }
        public required string BuildingName { get; set; }
        public string RoomImageUrl { get; set; }
        public List<string> UrlAvatars { get; set; }
    }
}
