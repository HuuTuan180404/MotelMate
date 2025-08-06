namespace BACKEND.DTOs.InvoiceDTO
{
    public class GetBankDTO
    {
        public long AccountNo { get; set; }
        public string AccountName { get; set; } = null!;
        public int BankCode { get; set; }
    }
}
