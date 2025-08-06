namespace BACKEND.RoomDTO.DTOs
{
    using System;
    using BACKEND.DTOs.RoomDTO;

    using BACKEND.Enums;

    public class ReadRoomDTO
    {
        public int RoomID { get; set; }
        public string RoomNumber { get; set; }
        public decimal Price { get; set; }
        public string Status { get; set; }
        public double Area { get; set; }
        public int MaxGuests { get; set; }
        public Nullable<int> BuildingID { get; set; }
        public required string BuildingName { get; set; }
        public string RoomImageUrl { get; set; }
        public List<string> UrlAvatars { get; set; }
    }

    public class ReadRoomDetailDTO
    {
        public int RoomID { get; set; }
        public string? RoomNumber { get; set; }
        public decimal Area { get; set; }
        public decimal Price { get; set; }
        public string? Status { get; set; }
        public int MaxGuests { get; set; }
        public string? Description { get; set; }

        public Nullable<int> BuildingID { get; set; }
        public required string BuildingName { get; set; }
        public required string BuildingAddress { get; set; }

        public required int Id { get; set; }
        public required string OwnerFullName { get; set; }
        public required string OwnerPhoneNumber { get; set; }

        public List<string>? UrlRoomImages { get; set; }
        public List<ReadTenantDTO>? Members { get; set; }
        public List<object> AssetData { get; set; }
    }
}
