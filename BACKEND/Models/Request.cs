namespace BACKEND.Models
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using BACKEND.Enums;

    public partial class Request
    {
        [Key]
        public int RequestID { get; set; }

        [Required]
        public string? Title { get; set; }

        [Required]
        public string? Content { get; set; }

        public string? Image { get; set; }

        [Required]
        public ERequestType Type { get; set; }

        public DateTime CreateAt { get; set; } = DateTime.Now;

        [Required]
        public ERequestStatus Status { get; set; }

        [ForeignKey(nameof(Tenant))]
        public Nullable<int> TenantID { get; set; }

        [ForeignKey(nameof(Owner))]
        public Nullable<int> OwnerID { get; set; }

        public virtual Tenant Tenant { get; set; }
        public virtual Owner Owner { get; set; }
    }
}
