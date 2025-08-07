using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using BACKEND.Data;
using BACKEND.Service;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BACKEND.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PDFController : ControllerBase
    {
        private readonly ContractPDFGenerator _contractPDFGenerator;
        private readonly MotelMateDbContext _context;
        public PDFController(ContractPDFGenerator contractPDFGenerator, MotelMateDbContext context)
        {
            _contractPDFGenerator = contractPDFGenerator;
            _context = context;
        }
        [HttpGet("download-contract-pdf")]
        public async Task<IActionResult> GenerateContractPDF([FromQuery] int RoomID)
        {
            var contractPDF = await _contractPDFGenerator.GeneratePDF(RoomID);
            var fileName = $"contract_{DateTime.Now:yyyyMMddHHmmss}.pdf";

            if (contractPDF == null) return NotFound(new { message = "Not found contract" });
            return File(contractPDF, "application/pdf", fileName);
        }
        [HttpGet("download-contract-pdf-by-contractid")]
        public async Task<IActionResult> GenerateInvoicePDFByContractID([FromQuery] int ContractID)
        {
            var contract = await _context.Contract
                .Include(c => c.Invoice)
                .FirstOrDefaultAsync(c => c.ContractID == ContractID);
            var contractPDF = await _contractPDFGenerator.GeneratePDF(contract.RoomID ?? -1);
            var fileName = $"invoice_{DateTime.Now:yyyyMMddHHmmss}.pdf";

            if (contractPDF == null) return NotFound(new { message = "Not found contract" });
            return File(contractPDF, "application/pdf", fileName);
        }
    }
}