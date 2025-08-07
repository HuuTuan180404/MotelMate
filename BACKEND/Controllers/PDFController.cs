using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using BACKEND.Service;
using Microsoft.AspNetCore.Mvc;

namespace BACKEND.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PDFController : ControllerBase
    {
        private readonly ContractPDFGenerator _contractPDFGenerator;
        public PDFController(ContractPDFGenerator contractPDFGenerator)
        {
            _contractPDFGenerator = contractPDFGenerator;
        }
        [HttpGet("download-contract-pdf")]
        public async Task<IActionResult> GenerateContractPDF([FromQuery] int RoomID)
        {
            var contractPDF =  await _contractPDFGenerator.GeneratePDF(RoomID);
            var fileName = $"contract_{DateTime.Now:yyyyMMddHHmmss}.pdf";

            if (contractPDF == null) return NotFound(new { message = "Not found contract" });
            return File(contractPDF, "application/pdf", fileName);
        }
    }
}