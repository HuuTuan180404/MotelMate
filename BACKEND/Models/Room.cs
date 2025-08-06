namespace BACKEND.Models
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using BACKEND.Enums;

    public partial class Room
    {
        public Room()
        {
            this.RoomAssets = new HashSet<RoomAsset>();
            this.Contracts = new HashSet<Contract>();
            this.RoomImages = new HashSet<RoomImage>();
        }

        [Key]
        public int RoomID { get; set; }

        [Required]
        public required string RoomNumber { get; set; }

        [Required]
        public double Area { get; set; }

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal Price { get; set; }

        [Required]
        public ERoomStatus Status { get; set; }
        public string? Description { get; set; }

        [Required]
        public int MaxGuests { get; set; }

        [ForeignKey(nameof(Building))]
        public Nullable<int> BuildingID { get; set; }
        public virtual ICollection<RoomAsset> RoomAssets { get; set; }
        public required virtual Building Building { get; set; }
        public virtual ICollection<Contract> Contracts { get; set; }
        public virtual ICollection<RoomImage> RoomImages { get; set; }
    }
}
