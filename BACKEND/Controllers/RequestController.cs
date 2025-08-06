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

        [HttpGet("MyRequests")]
        public async Task<ActionResult<IEnumerable<ReadRequestDTO>>> GetMyRequests()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId)) return Unauthorized();

            int tenantId = int.Parse(userId);

            var requests = await _context.Request
                .Where(r => r.TenantID == tenantId)
                .Include(r => r.Tenant)
                .Include(r => r.Tenant.ContractDetails)
                    .ThenInclude(cd => cd.Contract)
                        .ThenInclude(c => c.Room)
                            .ThenInclude(rm => rm.Building)
                .OrderByDescending(r => r.CreateAt)
                .ToListAsync();

            var result = requests.Select(r =>
            {
                var dto = _mapper.Map<ReadRequestDTO>(r);

                var contractDetail = r.Tenant.ContractDetails.FirstOrDefault(cd => cd.EndDate == null);
                var room = contractDetail?.Contract?.Room;
                var building = room?.Building;

                dto.RoomName = room?.RoomNumber;
                dto.BuildingName = building?.Name;

                return dto;
            }).ToList();

            return Ok(result);
        }

        // [HttpPost("SendFeedback")]
        // public async Task<IActionResult> SendFeedback([FromBody] CreateRequestDTO requestDto)
        // {
        //     var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
        //     if (userIdClaim == null) return Unauthorized("Invalid Token");

        //     int tenantId = int.Parse(userIdClaim.Value);

        //     var tenant = await _context.Tenant.FindAsync(tenantId);
        //     if (tenant == null) return NotFound("Tenant not found");

        //     // Find Owner (Building Owner) via active ContractDetail
        //     var activeContract = await _context.ContractDetail
        //         .Include(cd => cd.Contract)
        //             .ThenInclude(c => c.Room)
        //                 .ThenInclude(r => r.Building)
        //         .FirstOrDefaultAsync(cd => cd.TenantID == tenantId && cd.EndDate == null);

        //     if (activeContract == null) return BadRequest("No active contract found");

        //     var ownerId = activeContract.Contract.Room.Building.OwnerID;

        //     var request = new Request
        //     {
        //         Title = requestDto.Title,
        //         Content = requestDto.Content,
        //         Image = requestDto.Image,
        //         Type = ERequestType.FeedBackOrIssue,
        //         Status = ERequestStatus.Pending,
        //         TenantID = tenantId,
        //         OwnerID = ownerId,
        //         CreateAt = DateTime.Now
        //     };

        //     _context.Request.Add(request);
        //     await _context.SaveChangesAsync();

        //     return Ok("Feedback request sent successfully.");
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
        // [HttpPost("create-request")]
        // public async Task<IActionResult> CreateRequest([FromForm] CreateRequestDTO request)
        // {
        //     // Validate request
        //     if (!ModelState.IsValid)
        //         return BadRequest(ModelState);

        //     var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);

        //     if (!int.TryParse(userIdStr, out var userId))
        //         return Unauthorized("Invalid User ID");

        //     int ownerID = -1;

        //     if (request.BuildingID == null)
        //     {
        //         ownerID = await _context.ContractDetail
        //                    .Where(cd => cd.EndDate == null && cd.TenantID == userId)
        //                    .Include(cd => cd.Contract)
        //                        .ThenInclude(c => c.Room)
        //                            .ThenInclude(r => r.Building)
        //                    .Select(cd => cd.Contract.Room.Building.Owner.Id)
        //                    .FirstOrDefaultAsync();
        //     }
        //     else
        //     {
        //         ownerID = await _context.Building
        //                    .Where(b => b.BuildingID == request.BuildingID)
        //                    .Select(cd => cd.OwnerID)
        //                    .FirstOrDefaultAsync();
        //     }

        //     var newRequest = new Request
        //     {
        //         Title = request.Title,
        //         Content = request.Content,
        //         Type = Enum.Parse<ERequestType>(request.Type),
        //         CreateAt = DateTime.Now,
        //         Status = ERequestStatus.Pending,
        //         TenantID = userId,
        //     };


        //     // Xử lý dữ liệu & lưu ảnh nếu cần
        //     if (request.images != null && request.images.Length > 0)
        //     {
        //         // Save image logic here
        //         if (request.images.Length > 0)
        //         {
        //             var uploadParams = new ImageUploadParams
        //             {
        //                 File = new FileDescription(request.images.FileName, request.images.OpenReadStream()),
        //                 Folder = "intern_motel_mate" // bạn có thể đổi tên folder trên Cloudinary
        //             };

        //             var uploadResult = await _cloudinary.UploadAsync(uploadParams);

        //             if (uploadResult.StatusCode == System.Net.HttpStatusCode.OK)
        //             {
        //                 string imageUrl = uploadResult.SecureUrl.ToString();
        //                 newRequest.Image = imageUrl;
        //             }
        //             else
        //             {
        //                 return StatusCode(500, new { Message = $"Upload failed for file {request.images.FileName}" });
        //             }
        //         }

        //     }

        //     // Lưu request vào DB...
        //     _context.Request.Add(newRequest);
        //     await _context.SaveChangesAsync();

        //     return Ok(new { message = "Request created successfully" });
        // }


        [HttpPost("create-feedback-issue")]
        public async Task<IActionResult> CreateRequest([FromForm] CreateRequestDTO request)
        {
            // Validate request
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (!int.TryParse(userIdStr, out var userId))
                return Unauthorized("Invalid User ID");

            var isMyTenant = _context.ContractDetail
                                .FirstOrDefault(cd => cd.EndDate == null && cd.TenantID == userId);

            if (isMyTenant == null)
                return BadRequest(new { message = "You are not a tenant" });

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
                Type = ERequestType.FeedBackOrIssue,
                CreateAt = DateTime.Now,
                Status = ERequestStatus.Pending,
                TenantID = userId,
                OwnerID = ownerID,
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