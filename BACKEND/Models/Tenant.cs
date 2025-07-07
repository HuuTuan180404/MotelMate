namespace BACKEND.Models
{
    public class Tenant : Account
    {
        public Tenant() : base()
        {
            this.ContractDetails = new HashSet<ContractDetail>();
            this.TenantNoties = new HashSet<NotiRecipient>();
            this.TenantRequests = new HashSet<Request>();
        }
        public virtual ICollection<ContractDetail> ContractDetails { get; set; }
        public virtual ICollection<NotiRecipient> TenantNoties { get; set; }
        public virtual ICollection<Request> TenantRequests { get; set; }
    }
}