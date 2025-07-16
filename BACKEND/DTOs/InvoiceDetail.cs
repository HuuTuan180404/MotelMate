namespace BACKEND.DTOs
{
    public partial class InvoiceDetail
    {
        public int InvoiceID { get; set; }

        public int ServiceID { get; set; }

        public int Quantity { get; set; }

        public decimal Price { get; set; }
        public virtual Service Service { get; set; }
    }
}