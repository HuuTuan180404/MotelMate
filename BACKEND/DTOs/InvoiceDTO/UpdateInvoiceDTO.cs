namespace BACKEND.DTOs.InvoiceDTO
{
    public class UpdateInvoiceDTO
    {
        public UpdateInvoiceDTO()
        {
            ExtraCosts = new List<UpdateExtraCostDTO>();
            InvoiceDetails = new List<UpdateInvoiceDetailDTO>();
        }
        public DateOnly DueDate { get; set; }

        public required string Status { get; set; } // Sẽ validate Enum trong Controller/Service layer

        public List<UpdateExtraCostDTO> ExtraCosts { get; set; }

        public List<UpdateInvoiceDetailDTO> InvoiceDetails { get; set; }
    }

    public class UpdateExtraCostDTO
    {
        public int ExtraCostID { get; set; } 
        public required string Description { get; set; }
        public decimal Amount { get; set; }
    }

    public class UpdateInvoiceDetailDTO
    {
        public int ServiceID { get; set; } 
        public int Quantity { get; set; } 
    }
}