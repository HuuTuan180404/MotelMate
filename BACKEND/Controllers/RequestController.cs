using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AutoMapper;
using BACKEND.Models;
using BACKEND.DTOs.RequestDTO;
using BACKEND.Data;
using AutoMapper.QueryableExtensions;
using BACKEND.Enums;
using CloudinaryDotNet.Actions;
using CloudinaryDotNet;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;

namespace BACKEND.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class RequestController(MotelMateDbContext context, IMapper mapper, Cloudinary cloudinary) : ControllerBase
    {
        private readonly MotelMateDbContext _context = context;
        private readonly IMapper _mapper = mapper;
        private readonly Cloudinary _cloudinary = cloudinary;


        // GET api/Request?type=Payment&status=Pending
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ReadRequestDTO>>> GetRequests([FromQuery] string? type, [FromQuery] string? status)
        {
            var query = _context.Request
                .Include(r => r.Tenant)
                    .ThenInclude(t => t.ContractDetails)
                        .ThenInclude(cd => cd.Contract)
                            .ThenInclude(c => c.Room)
                                .ThenInclude(room => room.Building)
                .AsQueryable();

            // Filter by Type
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

            // Filter by Status
            if (!string.IsNullOrEmpty(status))
            {
                if (Enum.TryParse<ERequestStatus>(status, true, out var parsedStatus))
                {
                    query = query.Where(r => r.Status == parsedStatus);
                }
                else
                {
                    return BadRequest("Invalid request status.");
                }
            }

            var requests = await query.ToListAsync();

            var result = requests.Select(r =>
            {
                var contractDetail = _context.ContractDetail
                    .Include(cd => cd.Contract)
                        .ThenInclude(c => c.Room)
                            .ThenInclude(room => room.Building)
                    .FirstOrDefault(cd => cd.TenantID == r.TenantID);

                var room = contractDetail?.Contract?.Room;
                var building = room?.Building;

                var dto = _mapper.Map<ReadRequestDTO>(r);
                dto.RoomName = room?.RoomNumber;
                dto.BuildingName = building?.Name;

                return dto;
            }).ToList();

            return Ok(result);
        }

        // [HttpPost("{id}/approve")]
        // public async Task<IActionResult> ApproveRequest(int id)
        // {
        //     var request = await _context.Request.Include(r => r.Tenant).FirstOrDefaultAsync(r => r.RequestID == id);
        //     if (request == null) return NotFound("Request not found");

        //     request.Status = ERequestStatus.Approved;

        //     // Update liên quan Invoice
        //     var invoice = await _context.Invoice.FirstOrDefaultAsync(i => i.InvoiceCode == request.Title);
        //     if (invoice != null)
        //     {
        //         invoice.Status = BACKEND.Enums.EInvoiceStatus.Paid;
        //     }

        //     // Gửi Notification cho Tenant
        //     var noti = new Noti
        //     {
        //         Title = "Payment Approved",
        //         Content = $"Your payment request '{request.Title}' has been approved.",
        //         OwnerID = request.OwnerID
        //     };
        //     _context.Noti.Add(noti);
        //     await _context.SaveChangesAsync(); // Save to get NotiID

        //     _context.NotiRecipient.Add(new NotiRecipient
        //     {
        //         NotiID = noti.NotiID,
        //         TenantID = request.TenantID
        //     });

        //     await _context.SaveChangesAsync();
        //     return Ok("Request approved successfully.");
        // }

        // [HttpPost("{id}/reject")]
        // public async Task<IActionResult> RejectRequest(int id)
        // {
        //     var request = await _context.Request.Include(r => r.Tenant).FirstOrDefaultAsync(r => r.RequestID == id);
        //     if (request == null) return NotFound("Request not found");

        //     request.Status = ERequestStatus.Rejected;

        //     // Gửi Notification cho Tenant
        //     var noti = new Noti
        //     {
        //         Title = "Payment Rejected",
        //         Content = $"Your payment request '{request.Title}' has been rejected.",
        //         OwnerID = request.OwnerID
        //     };
        //     _context.Noti.Add(noti);
        //     await _context.SaveChangesAsync(); // Save to get NotiID

        //     _context.NotiRecipient.Add(new NotiRecipient
        //     {
        //         NotiID = noti.NotiID,
        //         TenantID = request.TenantID
        //     });

        //     await _context.SaveChangesAsync();
        //     return Ok("Request rejected successfully.");
        // }
        [HttpPost("{id}/approve")]
        public async Task<IActionResult> ApproveRequest(int id)
        {
            var request = await _context.Request
                .Include(r => r.Tenant)
                .FirstOrDefaultAsync(r => r.RequestID == id);

            if (request == null) return NotFound("Request not found");

            request.Status = ERequestStatus.Approved;

            // Nếu Type là Payment => Update Invoice Status
            if (request.Type == ERequestType.Payment)
            {
                var invoice = await _context.Invoice.FirstOrDefaultAsync(i => i.InvoiceCode == request.Title);
                if (invoice != null)
                {
                    invoice.Status = EInvoiceStatus.Paid;
                }
            }

            // Gửi Notification theo Type
            var noti = new Noti
            {
                Title = GetApprovalNotificationTitle(request.Type),
                Content = GetApprovalNotificationContent(request.Type, request.Title),
                OwnerID = request.OwnerID
            };
            _context.Noti.Add(noti);
            await _context.SaveChangesAsync(); // Save để có NotiID

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
            var request = await _context.Request
                .Include(r => r.Tenant)
                .FirstOrDefaultAsync(r => r.RequestID == id);

            if (request == null) return NotFound("Request not found");

            request.Status = ERequestStatus.Rejected;

            // Gửi Notification theo Type
            var noti = new Noti
            {
                Title = GetRejectionNotificationTitle(request.Type),
                Content = GetRejectionNotificationContent(request.Type, request.Title),
                OwnerID = request.OwnerID
            };
            _context.Noti.Add(noti);
            await _context.SaveChangesAsync(); // Save để có NotiID

            _context.NotiRecipient.Add(new NotiRecipient
            {
                NotiID = noti.NotiID,
                TenantID = request.TenantID
            });

            await _context.SaveChangesAsync();
            return Ok("Request rejected successfully.");
        }

        // Helper Methods
        private string GetApprovalNotificationTitle(ERequestType type)
        {
            return type switch
            {
                ERequestType.Payment => "Payment Approved",
                ERequestType.FeedBackOrIssue => "Feedback Resolved",
                ERequestType.ExtendContract => "Contract Extension Approved",
                ERequestType.RoomRegistration => "Room Registration Approved",
                _ => "Request Approved"
            };
        }

        private string GetApprovalNotificationContent(ERequestType type, string title)
        {
            return type switch
            {
                ERequestType.Payment => $"Your payment request '{title}' has been approved.",
                ERequestType.FeedBackOrIssue => $"Your feedback '{title}' has been addressed.",
                ERequestType.ExtendContract => $"Your contract extension request '{title}' has been approved.",
                ERequestType.RoomRegistration => $"Your room registration request '{title}' has been approved.",
                _ => $"Your request '{title}' has been approved."
            };
        }

        private string GetRejectionNotificationTitle(ERequestType type)
        {
            return type switch
            {
                ERequestType.Payment => "Payment Rejected",
                ERequestType.FeedBackOrIssue => "Feedback Rejected",
                ERequestType.ExtendContract => "Contract Extension Rejected",
                ERequestType.RoomRegistration => "Room Registration Rejected",
                _ => "Request Rejected"
            };
        }

        private string GetRejectionNotificationContent(ERequestType type, string title)
        {
            return type switch
            {
                ERequestType.Payment => $"Your payment request '{title}' has been rejected.",
                ERequestType.FeedBackOrIssue => $"Your feedback '{title}' has been rejected.",
                ERequestType.ExtendContract => $"Your contract extension request '{title}' has been rejected.",
                ERequestType.RoomRegistration => $"Your room registration request '{title}' has been rejected.",
                _ => $"Your request '{title}' has been rejected."
            };
        }


        // ===============TENANT=================
        [HttpPost("create-request")]
        public async Task<IActionResult> CreateRequest([FromForm] CreateRequestDTO request)
        {
            // Validate request
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (!int.TryParse(userIdStr, out var userId))
                return Unauthorized("Invalid User ID");

            int ownerID = -1;

            if (request.BuildingID == null)
            {
                ownerID = await _context.ContractDetail
                           .Where(cd => cd.EndDate == null && cd.TenantID == userId)
                           .Include(cd => cd.Contract)
                               .ThenInclude(c => c.Room)
                                   .ThenInclude(r => r.Building)
                           .Select(cd => cd.Contract.Room.Building.Owner.Id)
                           .FirstOrDefaultAsync();
            }
            else
            {
                ownerID = await _context.Building
                           .Where(b => b.BuildingID == request.BuildingID)
                           .Select(cd => cd.OwnerID)
                           .FirstOrDefaultAsync();
            }

            var newRequest = new Request
            {
                Title = request.Title,
                Content = request.Content,
                Type = Enum.Parse<ERequestType>(request.Type),
                CreateAt = DateTime.Now,
                Status = ERequestStatus.Pending,
                TenantID = userId,
            };


            // Xử lý dữ liệu & lưu ảnh nếu cần
            if (request.images != null && request.images.Length > 0)
            {
                // Save image logic here
                if (request.images.Length > 0)
                {
                    var uploadParams = new ImageUploadParams
                    {
                        File = new FileDescription(request.images.FileName, request.images.OpenReadStream()),
                        Folder = "intern_motel_mate" // bạn có thể đổi tên folder trên Cloudinary
                    };

                    var uploadResult = await _cloudinary.UploadAsync(uploadParams);

                    if (uploadResult.StatusCode == System.Net.HttpStatusCode.OK)
                    {
                        string imageUrl = uploadResult.SecureUrl.ToString();
                        newRequest.Image = imageUrl;
                    }
                    else
                    {
                        return StatusCode(500, new { Message = $"Upload failed for file {request.images.FileName}" });
                    }
                }

            }

            // Lưu request vào DB...
            _context.Request.Add(newRequest);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Request created successfully" });
        }
    }
}