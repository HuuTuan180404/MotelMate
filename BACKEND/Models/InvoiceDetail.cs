namespace BACKEND.Models
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;

    public partial class InvoiceDetail
    {
        [ForeignKey(nameof(Invoice))]
        public int InvoiceID { get; set; }

        [ForeignKey(nameof(Service))]
        public int ServiceID { get; set; }

        [Required]
        public int Quantity { get; set; }

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal Price { get; set; }

        public virtual Invoice Invoice { get; set; }
        public virtual Service Service { get; set; }
    }
}