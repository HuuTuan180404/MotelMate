
namespace BACKEND.Models
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using BACKEND.Enums;

    public partial class Contract
    {

        public Contract()
        {
            this.ContractDetail = new HashSet<ContractDetail>();
            this.Invoice = new HashSet<Invoice>();
        }

        [Key]
        public int ContractID { get; set; }

        public string? ContractCode { get; set; }

        [Required]
        public DateOnly StartDate { get; set; }

        [Required]
        public DateOnly EndDate { get; set; }

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal Price { get; set; }

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal Deposit { get; set; }

        [Required]
        public EContractStatus Status { get; set; }

        public string? Description { get; set; }

        [ForeignKey(nameof(Room))]
        public Nullable<int> RoomID { get; set; }

        public virtual Room? Room { get; set; }
        public virtual ICollection<ContractDetail> ContractDetail { get; set; }
        public virtual ICollection<Invoice> Invoice { get; set; }
    }
}
