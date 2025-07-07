namespace BACKEND.Models
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;

    public partial class Noti
    {
        [Key]
        public int NotiID { get; set; }

        [Required]
        public string? Title { get; set; }

        [Required]
        public string? Content { get; set; }
        public DateTime CreateAt { get; set; } = DateTime.Now;

        [ForeignKey(nameof(Owner))]
        public Nullable<int> OwnerID { get; set; }
        public virtual Owner Owner { get; set; }

        public virtual ICollection<NotiRecipient> NotiRecipients { get; set; }
    }
}
