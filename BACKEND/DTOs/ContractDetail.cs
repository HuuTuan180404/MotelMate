namespace BACKEND.DTOs
{
    using System;

    public partial class ContractDetail
    {
        public int ContractID { get; set; }
        public int TenantID { get; set; }
        public DateOnly StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public bool? IsRoomRepresentative { get; set; }

    }
}
