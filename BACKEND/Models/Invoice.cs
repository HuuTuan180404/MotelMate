namespace BACKEND.Models
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using BACKEND.Enums;

    public partial class Invoice
    {
        public Invoice()
        {
            this.InvoiceDetail = new HashSet<InvoiceDetail>();
        }
        [Key]
        public int InvoiceID { get; set; }

        public string InvoiceCode { get; set; }

        public DateTime CreateAt { get; set; } = DateTime.Now;

        [Required]
        public DateOnly PeriodStart { get; set; }

        [Required]
        public DateOnly PeriodEnd { get; set; }

        [Required]
        public EInvoiceStatus Status { get; set; }

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal ExtraCosts { get; set; } = 0;

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal TotalAmount { get; set; }

        [ForeignKey(nameof(Contract))]
        public Nullable<int> ContractID { get; set; }

        public string? Description { get; set; }

        public virtual Contract Contract { get; set; }
        public virtual ICollection<InvoiceDetail> InvoiceDetail { get; set; }
    }
}
