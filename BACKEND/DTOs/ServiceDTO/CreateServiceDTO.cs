using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace BACKEND.DTOs.ServiceDTO
{
    public class CreateServiceDTO
    {
        [Required]
        public string Name { get; set; } = string.Empty;

        [Required]
        public string Unit { get; set; } = string.Empty;

        [Range(0.01, double.MaxValue, ErrorMessage = "CustomerPrice must be greater than 0")]
        public decimal CustomerPrice { get; set; }

        [Range(0, double.MaxValue)]
        public decimal InitialPrice { get; set; }  

        public bool IsTiered { get; set; }

        public List<CreateServiceTierDTO>? ServiceTier { get; set; }
    }

    public class CreateServiceTierDTO
    {
        [Range(0, int.MaxValue, ErrorMessage = "FromQuantity must be >= 0")]
        public int FromQuantity { get; set; }

        [Range(1, int.MaxValue, ErrorMessage = "ToQuantity must be > FromQuantity")]
        public int ToQuantity { get; set; }

        [Range(0.01, double.MaxValue, ErrorMessage = "GovUnitPrice must be greater than 0")]
        public decimal GovUnitPrice { get; set; }
    }
}
