namespace BACKEND.DTOs.RequestDTO
{
    public class ReadRequestDTO
    {
        public int RequestID { get; set; }
        public string? Title { get; set; }
        public string? Content { get; set; }
        public string? Image { get; set; }
        public required string Type { get; set; }  // TRẢ STRING
        public DateTime CreateAt { get; set; }
        public required string Status { get; set; }  // TRẢ STRING
        public int? TenantID { get; set; }
        public int? OwnerID { get; set; }
    }
}
