namespace BACKEND.Models
{
    using System;
    using BACKEND.Enums;
    using Microsoft.AspNetCore.Identity;

    public class Account : IdentityUser<int>
    {
        public Account() : base()
        {
            this.AuditLog = new HashSet<AuditLog>();
        }

        public required string CCCD { get; set; }
        public required string FullName { get; set; }
        public DateTime Bdate { get; set; }
        public EAccountRole Role { get; set; }
        public EAccountStatus Status { get; set; }
        public string? URLAvatar { get; set; }
        public DateTime CreateAt { get; set; } = DateTime.Now;
        public DateTime UpdateAt { get; set; } = DateTime.Now;
        public virtual ICollection<AuditLog> AuditLog { get; set; }
    }
}
