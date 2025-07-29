using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AutoMapper;
using BACKEND.Models;
using BACKEND.DTOs.InvoiceDTO;
using BACKEND.Data;
using AutoMapper.QueryableExtensions;
using BACKEND.Enums;
using System.Security.Claims;


namespace BACKEND.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class InvoiceController(MotelMateDbContext context, IMapper mapper) : ControllerBase
    {
        private readonly MotelMateDbContext _context = context;
        private readonly IMapper _mapper = mapper;

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ReadInvoiceDTO>>> GetInvoices()
        {
            int currentAccountId = GetCurrentAccountId();
            Console.WriteLine($"[DEBUG] Current Account ID: {currentAccountId}");
            var invoices = await _context.Invoice
                .Include(i => i.Contract)
                    .ThenInclude(c => c.Room)
                        .ThenInclude(r => r.Building)
                            .ThenInclude(b => b.Owner)
                .Where(i => i.Contract.Room.Building.OwnerID == currentAccountId)
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

        // DELETE: api/Invoice/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteInvoice(int id)
        {
            var invoice = await _context.Invoice.FindAsync(id);

            if (invoice == null)
            {
                return NotFound();
            }

            _context.InvoiceDetails.RemoveRange(invoice.InvoiceDetail);

            _context.Invoice.Remove(invoice);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // PUT: api/Invoice/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateInvoice(int id, UpdateInvoiceDTO dto)
        {
            var invoice = await _context.Invoice
                .Include(i => i.ExtraCosts)
                .Include(i => i.InvoiceDetail)
                    .ThenInclude(d => d.Service)
                .FirstOrDefaultAsync(i => i.InvoiceID == id);

            if (invoice == null)
            {
                return NotFound();
            }

            // Update DueDate
            invoice.DueDate = dto.DueDate;

            // Update Status (Validate Enum)
            if (!Enum.TryParse<EInvoiceStatus>(dto.Status, out var statusEnum))
            {
                return BadRequest("Invalid status value.");
            }
            invoice.Status = statusEnum;

            // Update ExtraCosts
            foreach (var ecDto in dto.ExtraCosts)
            {
                var extraCost = invoice.ExtraCosts.FirstOrDefault(e => e.ExtraCostID == ecDto.ExtraCostID);
                if (extraCost != null)
                {
                    extraCost.Description = ecDto.Description;
                    extraCost.Amount = ecDto.Amount;
                }
            }

            foreach (var detailDto in dto.InvoiceDetails)
            {
                var detail = invoice.InvoiceDetail.FirstOrDefault(d => d.ServiceID == detailDto.ServiceID);
                if (detail != null)
                {
                    detail.Quantity = detailDto.Quantity;

                    var service = await _context.Services
                        .Include(s => s.ServiceTier)
                        .FirstOrDefaultAsync(s => s.ServiceID == detailDto.ServiceID);

                    if (service != null)
                    {
                        if (service.IsTiered == true && service.ServiceTier != null && service.ServiceTier.Any())
                        {
                            decimal initialPrice = 0;
                            decimal customerPrice = 0;
                            decimal remainingQuantity = detail.Quantity;

                            var tiers = service.ServiceTier.OrderBy(t => t.FromQuantity).ToList();

                            foreach (var tier in tiers)
                            {
                                if (remainingQuantity <= 0) break;

                                var tierRange = tier.ToQuantity - tier.FromQuantity + 1;
                                var applicableQty = Math.Min(remainingQuantity, tierRange);

                                initialPrice += applicableQty * tier.GovUnitPrice;
                                customerPrice += applicableQty * service.CustomerPrice; 

                                remainingQuantity -= applicableQty;
                            }

                            detail.InitialPrice = initialPrice;
                            detail.Price = customerPrice;
                        }
                        else
                        {
                            // Non-tiered Service
                            detail.InitialPrice = detail.Quantity * service.InitialPrice;
                            detail.Price = detail.Quantity * service.CustomerPrice;
                        }
                    }
                }
            }
            // Recalculate TotalInitialAmount & TotalAmount
            invoice.TotalInitialAmount = invoice.InvoiceDetail.Sum(d => d.InitialPrice) + invoice.ExtraCosts.Sum(e => e.Amount);
            invoice.TotalAmount = invoice.InvoiceDetail.Sum(d => d.Price) + invoice.ExtraCosts.Sum(e => e.Amount);

            await _context.SaveChangesAsync();

            return NoContent();
        }
        private int GetCurrentAccountId()
        {
            var accountIdClaim = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier);
            if (accountIdClaim != null && int.TryParse(accountIdClaim.Value, out int accountId))
            {
                return accountId;
            }
            return 0;
        }

    }
}