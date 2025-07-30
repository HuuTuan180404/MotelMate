namespace BACKEND.Models
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;

    public partial class Building
    {
        public Building()
        {
            this.Rooms = new HashSet<Room>();
        }

        [Key]
        public int BuildingID { get; set; }

        public required string BuildingCode { get; set; }

        [Required]
        [StringLength(255)]
        public required string Name { get; set; }

        [Required]
        [StringLength(255)]
        public required string Address { get; set; }

        [ForeignKey(nameof(Owner))]
        public int OwnerID { get; set; }
        public required virtual Owner Owner { get; set; }
        public virtual ICollection<Room> Rooms { get; set; }
    }
}
