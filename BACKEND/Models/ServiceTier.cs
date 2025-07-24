namespace BACKEND.Models
{
    using System;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;

    public partial class ServiceTier
    {
        [Key]
        public int ServiceTierID { get; set; }

        [Required]
        public int FromQuantity { get; set; }

        [Required]
        public int ToQuantity { get; set; }

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal GovUnitPrice { get; set; }

        [ForeignKey(nameof(Service))]
        public Nullable<int> ServiceID { get; set; }

        public virtual Service ?Service { get; set; }
    }
}
