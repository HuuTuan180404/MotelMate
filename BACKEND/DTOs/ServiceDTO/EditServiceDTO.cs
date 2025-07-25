namespace BACKEND.DTOs.ServiceDTO
{
    public class EditServiceDTO
    {
        public int ServiceID { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Unit { get; set; } = string.Empty;
        public decimal InitialPrice { get; set; }
        public decimal CustomerPrice { get; set; }
        public bool IsTiered { get; set; }
        public List<EditServiceTierDTO>? ServiceTier { get; set; }
    }
    public class EditServiceTierDTO
    {
        public int ServiceTierID { get; set; }
        public int FromQuantity { get; set; }
        public int ToQuantity { get; set; }
        public decimal GovUnitPrice { get; set; }
    }
}
