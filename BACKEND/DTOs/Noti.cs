namespace BACKEND.DTOs
{
    using System;

    public partial class Noti
    {
        public int NotiID { get; set; }

        public string? Title { get; set; }

        public string? Content { get; set; }
        public DateTime CreateAt { get; set; }

        public Nullable<int> OwnerID { get; set; }

    }
}
