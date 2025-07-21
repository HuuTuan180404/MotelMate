namespace BACKEND.Models
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;

    public partial class Service
    {
        public Service()
        {
            this.InvoiceDetail = new HashSet<InvoiceDetail>();
            this.ServiceTier = new HashSet<ServiceTier>();
        }

        [Key]
        public int ServiceID { get; set; }

        [Required]
        public required string Name { get; set; }

        [Required]
        public required string Unit { get; set; }

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal CustomerPrice { get; set; }

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal InitialPrice { get; set; }

        public Nullable<bool> IsTiered { get; set; }

        public virtual ICollection<InvoiceDetail> InvoiceDetail { get; set; }
        public virtual ICollection<ServiceTier> ServiceTier { get; set; }
    }
}
