namespace BACKEND.Models
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;

    public partial class ContractDetail
    {
        [ForeignKey(nameof(Contract))]
        public int ContractID { get; set; }

        [ForeignKey(nameof(Tenant))]
        public int TenantID { get; set; }

        [Required]
        public DateOnly StartDate { get; set; }

        [Required]
        public DateOnly EndDate { get; set; }

        public bool? IsRoomRepresentative { get; set; }

        public virtual Tenant Tenant { get; set; }
        public virtual Contract Contract { get; set; }
    }
}
