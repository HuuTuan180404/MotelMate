using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AutoMapper;
using BACKEND.Models;
using BACKEND.DTOs.InvoiceDTO;
using BACKEND.Data;
using AutoMapper.QueryableExtensions;

namespace BACKEND.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class InvoiceController(MotelMateDbContext context, IMapper mapper) : ControllerBase
    {
        private readonly MotelMateDbContext _context = context;
        private readonly IMapper _mapper = mapper;

        // GET: api/Invoice
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ReadInvoiceDTO>>> GetInvoices()
        {
            var invoices = await _context.Invoice
                .Include(i => i.Contract)
                    .ThenInclude(c => c.Room)
                        .ThenInclude(r => r.Building)
                .ProjectTo<ReadInvoiceDTO>(_mapper.ConfigurationProvider)
                .ToListAsync();

            return Ok(invoices);
        }

        // GET: api/Invoice/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<ReadInvoiceDetailDTO>> GetInvoiceDetail(int id)
        {
            var invoice = await _context.Invoice
                .Include(i => i.Contract)
                    .ThenInclude(c => c.Room)
                        .ThenInclude(r => r.Building)
                .Include(i => i.ExtraCosts)
                .Include(i => i.InvoiceDetail)
                    .ThenInclude(d => d.Service)
                .FirstOrDefaultAsync(i => i.InvoiceID == id);

            if (invoice == null)
            {
                return NotFound();
            }

            var invoiceDetailDTO = _mapper.Map<ReadInvoiceDetailDTO>(invoice);

            return Ok(invoiceDetailDTO);
        }

    }
}