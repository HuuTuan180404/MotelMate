using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AutoMapper;
using BACKEND.Models;
using BACKEND.DTOs.InvoiceDTO;
using BACKEND.Data;
using AutoMapper.QueryableExtensions;
using BACKEND.Enums;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;

namespace BACKEND.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class InvoiceController(MotelMateDbContext context, IMapper mapper) : ControllerBase
    {
        private readonly MotelMateDbContext _context = context;
        private readonly IMapper _mapper = mapper;

        // GET: api/Invoice
        [Authorize(Policy = "Owner")]
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

        //
        [Authorize(Policy = "Tenant")]
        [HttpGet("fortenant")]
        public async Task<ActionResult<IEnumerable<ReadInvoiceDTO>>> GetInvoicesForTenant()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (string.IsNullOrEmpty(userId)) return Unauthorized(new { message = "User not authenticated." });

            var tenantId = int.Parse(userId);

            var invoices = await _context.Invoice
                .Include(i => i.Contract)
                    .ThenInclude(c => c.Room)
                        .ThenInclude(r => r.Building)
                .Include(i => i.Contract)
                    .ThenInclude(c => c.ContractDetail)
                .Where(i => i.Contract.ContractDetail.Any(cd => cd.TenantID == tenantId && cd.EndDate == null))
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
                return NotFound(new { message = "Invoice not found." });
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
                return NotFound(new { message = "Invoice not found." });
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
                return BadRequest(new { message = "Invalid status value." });
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
            var contract = await _context.Contract
                .Include(c => c.Room)
                .FirstOrDefaultAsync(c => c.ContractID == invoice.ContractID);

            if (contract != null)
            {
                invoice.TotalInitialAmount = invoice.InvoiceDetail.Sum(d => d.InitialPrice) + invoice.ExtraCosts.Sum(e => e.Amount) + contract.Price;
                invoice.TotalAmount = invoice.InvoiceDetail.Sum(d => d.Price) + invoice.ExtraCosts.Sum(e => e.Amount) + contract.Price;
            }
            else
            {
                invoice.TotalInitialAmount = invoice.InvoiceDetail.Sum(d => d.InitialPrice) + invoice.ExtraCosts.Sum(e => e.Amount);
                invoice.TotalAmount = invoice.InvoiceDetail.Sum(d => d.Price) + invoice.ExtraCosts.Sum(e => e.Amount);
            }

            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpGet("Draft")]
        public async Task<IActionResult> GetInvoiceDrafts([FromQuery] int buildingId, [FromQuery] DateOnly periodStart, [FromQuery] DateOnly periodEnd, [FromQuery] DateOnly dueDate)
        {
            var activeContracts = await _context.Contract
                .Include(c => c.Room).ThenInclude(r => r.Building)
                .Where(c => c.Status == EContractStatus.Active && c.Room.BuildingID == buildingId)
                .ToListAsync();

            var services = await _context.Services.ToListAsync();

            var drafts = activeContracts.Select(c => new InvoiceDraftDto
            {
                ContractID = c.ContractID,
                RoomNumber = c.Room.RoomNumber,
                PeriodStart = periodStart,
                PeriodEnd = periodEnd,
                DueDate = dueDate,
                Services = services.Select(s => new ServiceDraftDto
                {
                    ServiceID = s.ServiceID,
                    Name = s.Name,
                    Unit = s.Unit
                }).ToList()
            }).ToList();

            return Ok(drafts);
        }

        [HttpPost("BatchCreateWithNotification")]
        public async Task<IActionResult> BatchCreateWithNotification([FromBody] List<BatchInvoiceDto> invoiceDtos)
        {
            foreach (var dto in invoiceDtos)
            {
                var contract = await _context.Contract
                    .Include(c => c.Room).ThenInclude(r => r.Building)
                    .FirstOrDefaultAsync(c => c.ContractID == dto.ContractId);

                if (contract == null) continue;
                var randomSuffix = new Random().Next(1000, 9999);
                var invoice = new Invoice
                {
                    ContractID = dto.ContractId,
                    InvoiceCode = $"INV-{DateTime.Now:yyyyMMdd}-{randomSuffix}",
                    PeriodStart = dto.PeriodStart,
                    PeriodEnd = dto.PeriodEnd,
                    DueDate = dto.DueDate,
                    Status = EInvoiceStatus.Unpaid,
                    Description = string.IsNullOrWhiteSpace(dto.Description)
                        ? $"Invoice for Room {contract.Room.RoomNumber} - Period {dto.PeriodStart:yyyy-MM-dd} to {dto.PeriodEnd:yyyy-MM-dd}"
                        : dto.Description,
                    TotalInitialAmount = contract.Price, // đã cộng giá phòng
                    TotalAmount = contract.Price,
                    // InvoiceDetail = new List<InvoiceDetail>() 
                };

                _context.Invoice.Add(invoice);
                await _context.SaveChangesAsync();

                foreach (var serviceItem in dto.Services)
                {
                    var service = await _context.Services
                        .Include(s => s.ServiceTier)
                        .FirstOrDefaultAsync(s => s.ServiceID == serviceItem.ServiceId);

                    if (service == null) continue;

                    decimal initialPrice = 0;
                    decimal customerPrice = 0;
                    decimal remainingQuantity = serviceItem.Quantity;

                    if (service.IsTiered == true && service.ServiceTier != null && service.ServiceTier.Any())
                    {
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
                    }
                    else
                    {
                        initialPrice = serviceItem.Quantity * service.InitialPrice;
                        customerPrice = serviceItem.Quantity * service.CustomerPrice;
                    }

                    // FIX: Gán InvoiceID + ServiceID (Composite Key)
                    var detail = new InvoiceDetail
                    {
                        InvoiceID = invoice.InvoiceID,  // FIX: Gán InvoiceID thủ công
                        ServiceID = service.ServiceID,
                        Quantity = serviceItem.Quantity,
                        InitialPrice = initialPrice,
                        Price = customerPrice
                    };

                    invoice.TotalInitialAmount += detail.InitialPrice;
                    invoice.TotalAmount += detail.Price;

                    _context.InvoiceDetails.Add(detail);  // FIX: Add vào DbSet, KHÔNG add vào navigation
                }

                foreach (var extra in dto.ExtraCosts)
                {
                    var extraCost = new ExtraCost
                    {
                        Invoice = invoice,
                        Description = extra.Description,
                        Amount = extra.Amount
                    };

                    invoice.TotalAmount += extra.Amount;
                    _context.ExtraCosts.Add(extraCost);
                }

                _context.Invoice.Update(invoice);

                // Tìm tất cả tenants đang ở phòng (EndDate == null)
                var activeTenants = await _context.ContractDetail
                    .Where(cd => cd.ContractID == dto.ContractId && cd.EndDate == null)
                    .Select(cd => cd.TenantID)
                    .ToListAsync();

                // Nếu có tenants thì tạo 1 Noti duy nhất
                if (activeTenants.Any())
                {
                    var noti = new Noti
                    {
                        Title = "New Invoice Available",
                        Content = $"Invoice {invoice.InvoiceCode} for room {contract.Room.RoomNumber} is ready. Total: {invoice.TotalAmount} VND.",
                        OwnerID = contract.Room.Building.OwnerID,
                        NotiRecipients = activeTenants.Select(tenantId => new NotiRecipient
                        {
                            TenantID = tenantId
                        }).ToList()
                    };

                    _context.Noti.Add(noti);
                }

            }

            await _context.SaveChangesAsync();

            return Ok(new { message = "Invoices created and notifications sent." });
        }
        
        [HttpPost("{invoiceId}/create-payment-request")]
        [Authorize(Policy = "Tenant")]
        public async Task<IActionResult> CreatePaymentRequest(int invoiceId, [FromBody] CreatePaymentRequestDTO dto)
        {
            var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userIdStr)) return Unauthorized();

            var tenantId = int.Parse(userIdStr);

            var invoice = await _context.Invoice
                .Include(i => i.Contract)
                    .ThenInclude(c => c.Room)
                        .ThenInclude(r => r.Building)
                            .ThenInclude(b => b.Owner)
                .FirstOrDefaultAsync(i => i.InvoiceID == invoiceId);

            if (invoice == null)
                return NotFound(new { message = "Invoice not found." });

            // Kiểm tra xem Tenant hiện tại có quyền với Invoice này (ContractDetail đang active)
            var activeContractDetail = await _context.ContractDetail
                .FirstOrDefaultAsync(cd => cd.ContractID == invoice.ContractID && cd.TenantID == tenantId && cd.EndDate == null);

            if (activeContractDetail == null)
                return StatusCode(StatusCodes.Status403Forbidden, new { message = "You are not allowed to create payment request for this invoice." });

            // Kiểm tra đã có Request Payment chưa (tránh spam)
            var existedRequest = await _context.Request
                .FirstOrDefaultAsync(r => r.Type == ERequestType.Payment && r.Title == invoice.InvoiceCode && r.TenantID == tenantId && r.Status == ERequestStatus.Pending);

            if (existedRequest != null)
                return BadRequest(new { message = "A payment request for this invoice is already pending approval." });

            var request = new Request
            {
                TenantID = tenantId,
                OwnerID = invoice.Contract.Room.Building.OwnerID,
                Type = ERequestType.Payment,
                Title = invoice.InvoiceCode,
                Content = $"Tenant requests payment approval for invoice {invoice.InvoiceCode}.",
                Status = ERequestStatus.Pending,
                CreateAt = DateTime.Now,
                Image = dto.ImageUrl
            };

            _context.Request.Add(request);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Payment request created successfully." });
        }

        [HttpGet("{invoiceId}/owner-bank-info")]
        public async Task<ActionResult<GetBankDTO>> GetOwnerBankInfo(int invoiceId)
        {
            var invoice = await _context.Invoice
                .Include(i => i.Contract)
                    .ThenInclude(c => c.Room)
                        .ThenInclude(r => r.Building)
                            .ThenInclude(b => b.Owner)
                .FirstOrDefaultAsync(i => i.InvoiceID == invoiceId);

            if (invoice == null) return NotFound(new { message = "Invoice not found." });

            var owner = invoice.Contract?.Room?.Building?.Owner;

            if (owner == null) return NotFound(new { message = "Owner not found." });

            var result = new GetBankDTO
            {
                AccountNo = owner.AccountNo,
                AccountName = owner.AccountName,
                BankCode = owner.BankCode
            };

            return Ok(result);
        }

    }
}