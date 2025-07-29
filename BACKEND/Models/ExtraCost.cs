namespace BACKEND.Models
{
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;

    public partial class ExtraCost
    {
        [Key]
        public int ExtraCostID { get; set; }

        [Required]
        [ForeignKey(nameof(Invoice))]
        public int InvoiceID { get; set; }

        [Required]
        public string Description { get; set; } = string.Empty;

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal Amount { get; set; }

        public virtual Invoice? Invoice { get; set; }
    }
}
