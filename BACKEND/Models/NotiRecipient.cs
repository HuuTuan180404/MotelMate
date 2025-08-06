namespace BACKEND.Models
{
    using System;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;

    public partial class NotiRecipient
    {
        [ForeignKey(nameof(Noti))]
        public int NotiID { get; set; }
        public bool IsRead { get; set; } = false;

        [ForeignKey(nameof(Tenant))]
        public Nullable<int> TenantID { get; set; }
        public virtual Tenant? Tenant { get; set; }
        public virtual Noti? Noti { get; set; }
    }
}
