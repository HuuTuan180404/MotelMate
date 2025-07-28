namespace BACKEND.RoomDTO.DTOs
{
    public class ReadAssetDTO
    {
        public int AssetID { get; set; }
        public required string Name { get; set; }
        public decimal Price { get; set; }
        public string Type { get; set; }
        public string? Description { get; set; }
        public int Quantity { get; set; }
    }
}
