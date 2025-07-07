namespace BACKEND.Models
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;

    public partial class RoomAsset
    {
        [Key]
        public int AssetID { get; set; }

        [ForeignKey(nameof(Room))]
        public int RoomID { get; set; }

        [Required]
        public int Quantity { get; set; }
        public string? Description { get; set; }

        public virtual Asset Asset { get; set; }
        public virtual Room Room { get; set; }
    }
}
