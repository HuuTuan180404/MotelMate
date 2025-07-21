namespace BACKEND.DTOs
{
    public partial class Building
    {

        public int BuildingID { get; set; }

        public string BuildingCode { get; set; }

       
        public string Name { get; set; }

     
        public string Address { get; set; }

        public int OwnerID { get; set; }
        public virtual Owner Owner { get; set; }
    }
}
