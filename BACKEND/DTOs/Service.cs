namespace BACKEND.DTOs
{
    using System;

    public partial class Service
    {
        public int ServiceID { get; set; }
        public string Name { get; set; }
        public string Unit { get; set; }
        public decimal CustomerPrice { get; set; }
        public decimal InitialPrice { get; set; }
        public Nullable<bool> IsTiered { get; set; }
    }
}
