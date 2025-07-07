namespace BACKEND.Models
{
    public class Owner : Account
    {
        public long AccountNo { get; set; }
        public long AccountName { get; set; }
        public long BankCode { get; set; }
        public Owner() : base()
        {
            this.Buildings = new HashSet<Building>();
            this.OwnerNoties = new HashSet<Noti>();
            this.OwnerRequests = new HashSet<Request>();
        }
        public virtual ICollection<Building> Buildings { get; set; }
        public virtual ICollection<Noti> OwnerNoties { get; set; }
        public virtual ICollection<Request> OwnerRequests { get; set; }
    }
}
