namespace BACKEND.DTOs
{
    public partial class RoomAsset
    {
        public int AssetID { get; set; }

        public int RoomID { get; set; }

        public int Quantity { get; set; }
        public string? Description { get; set; }

    }
}
