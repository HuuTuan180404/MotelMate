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
            this.Room = new HashSet<Room>();
        }

        [Key]
        public int BuildingID { get; set; }

        public string BuildingCode { get; set; }

        [Required]
        [StringLength(255)]
        public string Name { get; set; }

        [Required]
        [StringLength(255)]
        public string Address { get; set; }

        [ForeignKey(nameof(Owner))]
        public int OwnerID { get; set; }
        public virtual Owner Owner { get; set; }
        public virtual ICollection<Room> Room { get; set; }
    }
}
