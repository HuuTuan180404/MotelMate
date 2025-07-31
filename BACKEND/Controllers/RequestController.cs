using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AutoMapper;
using BACKEND.Models;
using BACKEND.DTOs.RequestDTO;
using BACKEND.Data;
using AutoMapper.QueryableExtensions;
using BACKEND.Enums;

namespace BACKEND.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RequestController(MotelMateDbContext context, IMapper mapper) : ControllerBase
    {
        private readonly MotelMateDbContext _context = context;
        private readonly IMapper _mapper = mapper;

        // GET api/Request?type=Payment
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ReadRequestDTO>>> GetRequests([FromQuery] string? type)
        {
            var query = _context.Request.AsQueryable();

            if (!string.IsNullOrEmpty(type))
            {
                if (Enum.TryParse<ERequestType>(type, true, out var parsedType))
                {
                    query = query.Where(r => r.Type == parsedType);
                }
                else
                {
                    return BadRequest("Invalid request type.");
                }
            }

            var requestDTOs = await query
                .ProjectTo<ReadRequestDTO>(_mapper.ConfigurationProvider)
                .ToListAsync();

            return Ok(requestDTOs);
        }

        [HttpPost("{id}/approve")]
        public async Task<IActionResult> ApproveRequest(int id)
        {
            var request = await _context.Request.Include(r => r.Tenant).FirstOrDefaultAsync(r => r.RequestID == id);
            if (request == null) return NotFound("Request not found");

            request.Status = ERequestStatus.Approved;

            // Update liên quan Invoice
            var invoice = await _context.Invoice.FirstOrDefaultAsync(i => i.InvoiceCode == request.Title);
            if (invoice != null)
            {
                invoice.Status = BACKEND.Enums.EInvoiceStatus.Paid;
            }

            // Gửi Notification cho Tenant
            var noti = new Noti
            {
                Title = "Payment Approved",
                Content = $"Your payment request '{request.Title}' has been approved.",
                OwnerID = request.OwnerID
            };
            _context.Noti.Add(noti);
            await _context.SaveChangesAsync(); // Save to get NotiID

            _context.NotiRecipient.Add(new NotiRecipient
            {
                NotiID = noti.NotiID,
                TenantID = request.TenantID
            });

            await _context.SaveChangesAsync();
            return Ok("Request approved successfully.");
        }

        [HttpPost("{id}/reject")]
        public async Task<IActionResult> RejectRequest(int id)
        {
            var request = await _context.Request.Include(r => r.Tenant).FirstOrDefaultAsync(r => r.RequestID == id);
            if (request == null) return NotFound("Request not found");

            request.Status = ERequestStatus.Rejected;

            // Gửi Notification cho Tenant
            var noti = new Noti
            {
                Title = "Payment Rejected",
                Content = $"Your payment request '{request.Title}' has been rejected.",
                OwnerID = request.OwnerID
            };
            _context.Noti.Add(noti);
            await _context.SaveChangesAsync(); // Save to get NotiID

            _context.NotiRecipient.Add(new NotiRecipient
            {
                NotiID = noti.NotiID,
                TenantID = request.TenantID
            });

            await _context.SaveChangesAsync();
            return Ok("Request rejected successfully.");
        }

    }
}