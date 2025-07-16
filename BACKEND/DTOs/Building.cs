namespace BACKEND.DTOs
{
    using System;
    using System.Collections.Generic;

    public partial class Building
    {
        public Building()
        {
            this.Room = new HashSet<Room>();
        }

        public int BuildingID { get; set; }

        public string BuildingCode { get; set; }

       
        public string Name { get; set; }

     
        public string Address { get; set; }

        public int OwnerID { get; set; }
        public virtual Owner Owner { get; set; }
        public virtual ICollection<Room> Room { get; set; }
    }
}
