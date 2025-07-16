namespace BACKEND.DTOs
{
    using System;

    public partial class ServiceTier
    {
        public int ServiceTierID { get; set; }
        public int FromQuantity { get; set; }
        public int ToQuantity { get; set; }
        public decimal GovUnitPrice { get; set; }
        public Nullable<int> ServiceID { get; set; }
    }
}
