namespace BACKEND.DTOs
{
    using BACKEND.Enums;

    public partial class Asset
    {
        public int AssetID { get; set; }
        public string Name { get; set; }
        public decimal Price { get; set; }
        public string? Description { get; set; }
        public EAssetType Type { get; set; }
    }
}
