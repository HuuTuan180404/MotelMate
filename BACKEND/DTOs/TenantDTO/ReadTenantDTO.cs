using BACKEND.Enums;

namespace BACKEND.DTOs.RoomDTO
{
    public class ReadTenantDTO
    {
        public int Id { get; set; }
        public string? FullName { get; set; }
        public required string CCCD { get; set; }
        public DateOnly Bdate { get; set; }
        public string? PhoneNumber { get; set; }
        public string? Status { get; set; }
        public string? URLAvatar { get; set; }
        public List<ContractDetailDTO>? ContractDetails { get; set; }
    }

    public class ReadTenantDetailDTO
    {
        public ReadTenantDTO? ReadTenantDTO { get; set; }
        public List<ContractDetailDTO>? ContractDetails { get; set; }
    }
}