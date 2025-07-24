namespace BACKEND.RoomDTO.DTOs
{
    using System;
    using BACKEND.Enums;

    public class ReadRoomDTO
    {
        public int RoomID { get; set; }
        public string ?RoomNumber { get; set; }
        public double Area { get; set; }
        public decimal Price { get; set; }
        public ERoomStatus Status { get; set; }
        public string? Description { get; set; }
        public Nullable<int> BuildingID { get; set; }
        public required string BuildingName { get; set; }
    }
}
