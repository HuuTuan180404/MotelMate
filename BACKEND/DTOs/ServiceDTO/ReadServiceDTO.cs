namespace BACKEND.DTOs
{
    using System.Collections.Generic;

    public class ReadServiceDTO
    {
        public int ServiceID { get; set; }
        public required string Name { get; set; }
        public required string Unit { get; set; }
        public decimal InitialPrice { get; set; }
        public decimal CustomerPrice { get; set; }
        public bool? IsTiered { get; set; }

        // List of Tiers if IsTiered = true
        public List<ReadServiceTierDTO> ServiceTier { get; set; } = new List<ReadServiceTierDTO>();
    }
}
