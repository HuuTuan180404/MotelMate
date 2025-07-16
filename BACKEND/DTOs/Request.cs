namespace BACKEND.DTOs
{
    using System;
    using BACKEND.Enums;

    public partial class Request
    {
        public int RequestID { get; set; }
        public string? Title { get; set; }
        public string? Content { get; set; }
        public string? Image { get; set; }
        public ERequestType Type { get; set; }
        public DateTime CreateAt { get; set; }
        public ERequestStatus Status { get; set; }
        public Nullable<int> TenantID { get; set; }
        public Nullable<int> OwnerID { get; set; }
    }
}
