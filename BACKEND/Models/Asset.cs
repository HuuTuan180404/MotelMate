namespace BACKEND.Models
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using BACKEND.Enums;

    public partial class Asset
    {
        public Asset()
        {
            this.RoomAsset = new HashSet<RoomAsset>();
        }

        [Key]
        public int AssetID { get; set; }

        [Required]
        [StringLength(255)]
        public required string Name { get; set; }

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal Price { get; set; }
        public string? Description { get; set; }

        [Required]
        public EAssetType Type { get; set; }

        // thêm cột của building id
        [ForeignKey(nameof(Building))]
        public Nullable<int> BuildingID { get; set; }

        public virtual Building? Building { get; set; }
        public virtual ICollection<RoomAsset> RoomAsset { get; set; }
    }
}
