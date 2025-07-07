namespace BACKEND.Models
{
    using System;
    using BACKEND.Enums;
    using Microsoft.AspNetCore.Identity;

    public class Account : IdentityUser<int>
    {
        public string CCCD { get; set; }
        public string FullName { get; set; }
        public DateTime Bdate { get; set; }
        public EAccountRole Role { get; set; }
        public EAccountStatus Status { get; set; }
        public string URLAvatar { get; set; }
    }
}
