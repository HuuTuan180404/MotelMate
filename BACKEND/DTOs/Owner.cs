namespace BACKEND.DTOs
{
    public class Owner : Account
    {
        public long AccountNo { get; set; }
        public long AccountName { get; set; }
        public long BankCode { get; set; }
    }
}
