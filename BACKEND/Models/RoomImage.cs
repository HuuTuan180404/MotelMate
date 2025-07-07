namespace BACKEND.Models
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;

    public partial class RoomImage
    {
        [ForeignKey(nameof(Room))]
        public Nullable<int> RoomID { get; set; }
        public required string ImageURL { get; set; }
        public virtual Room Room { get; set; }
    }
}
