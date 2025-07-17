namespace BACKEND.DTOs
{
    using System;
    using BACKEND.Enums;
 
    public partial class ContractDTO
    {
        public int ContractID { get; set; }
        public string ContractCode { get; set; }
 
        public DateOnly StartDate { get; set; }
 
        public DateOnly EndDate { get; set; }
 
        public decimal Price { get; set; }
        public decimal Deposit { get; set; }
        public EContractStatus Status { get; set; }
        public string? Description { get; set; }
        public Nullable<int> RoomID { get; set; }
 
    }
}
 