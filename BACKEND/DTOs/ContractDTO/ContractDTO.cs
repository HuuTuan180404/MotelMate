namespace BACKEND.DTOs
{
    using System;
    using BACKEND.Enums;

    public partial class ContractDTO
    {
        public string? ContractCode { get; set; }
        public string ContractHolder { get; set; }
        public string BuildingName { get; set; }

        public string RoomNumber { get; set; }
        public int ContractID { get; set; }

        public DateOnly StartDate { get; set; }

        public DateOnly EndDate { get; set; }
        public string Status { get; set; }
    }

    // created by Tuan
    public partial class ContractDetailDTO
    {
        public int ContractID { get; set; }
        public int TenantID { get; set; }
        public DateOnly StartDate { get; set; }
        public DateOnly EndDate { get; set; }
        public bool? IsRoomRepresentative { get; set; }
    }
}
