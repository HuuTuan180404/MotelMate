namespace BACKEND.DTOs.ServiceDTO
{
    public class ReadServiceTierDTO
    {
        public int ServiceTierID { get; set; }
        public int FromQuantity { get; set; }
        public int ToQuantity { get; set; }
        public decimal GovUnitPrice { get; set; }
    }
}
