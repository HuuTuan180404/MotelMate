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
using System.Text.Json;
using System.Text.Json.Serialization;


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


        [HttpGet]
        public async Task<ActionResult<IEnumerable<ReadRequestDTO>>> GetRequests(
            [FromQuery] string? type, 
            [FromQuery] string? status)
        {
            var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var userRole = User.FindFirstValue(ClaimTypes.Role);

            var query = _context.Request
                .Include(r => r.Tenant)
                    .ThenInclude(t => t.ContractDetails)
                        .ThenInclude(cd => cd.Contract)
                            .ThenInclude(c => c.Room)
                                .ThenInclude(room => room.Building)
                .AsQueryable();

            // Nếu role là Tenant → chỉ lấy request của chính mình
            if (userRole == "Tenant")
            {
                int tenantIdInt = int.Parse(userIdStr);
                query = query.Where(r => r.TenantID == tenantIdInt);
            }
            // Owner/Admin không filter TenantID

            // Filter by Type
            if (!string.IsNullOrEmpty(type))
            {
                if (Enum.TryParse<ERequestType>(type, true, out var parsedType))
                {
                    query = query.Where(r => r.Type == parsedType);
                }
                else
                {
                    return BadRequest(new { message = "Invalid request type." });
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
                    return BadRequest(new { message = "Invalid request status." });
                }
            }

            var requests = await query.OrderByDescending(r => r.CreateAt).ToListAsync();

            var result = requests.Select(r =>
            {
                var contractDetail = r.Tenant.ContractDetails.FirstOrDefault(cd => cd.EndDate == null);
                var room = contractDetail?.Contract?.Room;
                var building = room?.Building;

                var dto = _mapper.Map<ReadRequestDTO>(r);
                dto.RoomName = room?.RoomNumber;
                dto.BuildingName = building?.Name;
                dto.RoomID = room?.RoomID;

                return dto;
            }).ToList();

            return Ok(result);
        }


        public class DateOnlyJsonConverter : JsonConverter<DateOnly>
        {
            private const string Format = "yyyy-MM-dd";

            public override DateOnly Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
            {
                return DateOnly.ParseExact(reader.GetString() ?? throw new InvalidOperationException(), Format);
            }

            public override void Write(Utf8JsonWriter writer, DateOnly value, JsonSerializerOptions options)
            {
                writer.WriteStringValue(value.ToString(Format));
            }
        }

        [HttpPost("{id}/approve")]
        public async Task<IActionResult> ApproveRequest(int id)
        {
            var request = await _context.Request
                .Include(r => r.Tenant)
                .FirstOrDefaultAsync(r => r.RequestID == id);

            if (request == null) return NotFound(new { message = "Request not found." });

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

            else if (request.Type == ERequestType.RoomRegistration)
            {
                // Tách title theo định dạng: "RoomNumber - BuildingName (Room transfer)"
                var titleMainPart = request.Title.Split(" (")[0]; // loại bỏ phần hậu tố
                var parts = titleMainPart.Split(" - ");

                if (parts.Length != 2)
                    return BadRequest(new { message = "Invalid request title format." });

                var roomNumber = parts[0].Trim();
                var buildingName = parts[1].Trim();

                var room = await _context.Room
                    .Include(r => r.Building)
                    .FirstOrDefaultAsync(r => r.RoomNumber == roomNumber && r.Building.Name == buildingName);

                if (room == null)
                    return NotFound(new { message = "Room not found." });

                // Parse Content (StartDate & EndDate)
                DateOnly startDate;
                DateOnly endDate;

                try
                {
                    var options = new JsonSerializerOptions
                    {
                        PropertyNameCaseInsensitive = true,
                        Converters = { new DateOnlyJsonConverter() }
                    };

                    var contentObj = JsonSerializer.Deserialize<RoomRegistrationContentDto>(request.Content, options);

                    if (contentObj == null)
                        return BadRequest(new { message = "Invalid registration content." });

                    startDate = contentObj.StartDate;
                    endDate = contentObj.EndDate;
                }
                catch (Exception ex)
                {
                    return BadRequest(new { message = "Failed to parse registration content.", error = ex.Message });
                }

                // Nếu tenant đã có hợp đồng đang hoạt động => chuyển phòng => set EndDate
                var currentContractDetail = await _context.ContractDetail
                    .Include(cd => cd.Contract)
                    .Where(cd => cd.TenantID == request.TenantID && cd.EndDate == null)
                    .FirstOrDefaultAsync();

                if (currentContractDetail != null)
                {
                    // 1. Set EndDate khi chuyển phòng
                    currentContractDetail.EndDate = startDate;

                    await _context.SaveChangesAsync();

                    // 2. Kiểm tra nếu là người cuối cùng trong hợp đồng → kết thúc hợp đồng
                    var contractId = currentContractDetail.ContractID;

                    var otherActiveMembers = await _context.ContractDetail
                        .Where(cd => cd.ContractID == contractId && cd.EndDate == null)
                        .CountAsync();

                    if (otherActiveMembers == 0)
                    {
                        var contract = await _context.Contract.FindAsync(contractId);
                        if (contract != null)
                        {
                            contract.Status = EContractStatus.Expired;
                        }
                    }
                }

                // BẮT ĐẦU XỬ LÝ THÊM MỚI CONTRACT/CONTRACTDETAIL
                if (room.Status == ERoomStatus.Available)
                {
                    var contract = new Contract
                    {
                        RoomID = room.RoomID,
                        Status = EContractStatus.Unsigned,
                        StartDate = startDate,
                        EndDate = endDate,
                        Price = room.Price,
                        Deposit = 1000000,
                        ContractCode = "C" + room.RoomNumber + DateTime.Now.ToString("yyyyMMddHHmmss")
                    };
                    _context.Contract.Add(contract);
                    await _context.SaveChangesAsync(); // Lưu để có ContractID

                    var contractDetail = new ContractDetail
                    {
                        ContractID = contract.ContractID,
                        TenantID = request.TenantID ?? 0,
                        StartDate = startDate,
                        EndDate = null,
                        IsRoomRepresentative = true
                    };
                    _context.ContractDetail.Add(contractDetail);

                    room.Status = ERoomStatus.Occupied;
                }
                else if (room.Status == ERoomStatus.LookingForRoommate)
                {
                    var activeContract = await _context.Contract
                        .Where(c => c.RoomID == room.RoomID && c.Status == EContractStatus.Active)
                        .FirstOrDefaultAsync();

                    if (activeContract == null)
                        return BadRequest(new { message = "No active contract found for the room." });

                    int currentTenants = await _context.ContractDetail
                        .CountAsync(cd => cd.ContractID == activeContract.ContractID && cd.EndDate == null);

                    if (currentTenants >= room.MaxGuests)
                        return BadRequest(new { message = "Room already has maximum number of tenants." });

                    var contractDetail = new ContractDetail
                    {
                        ContractID = activeContract.ContractID,
                        TenantID = request.TenantID ?? 0,
                        StartDate = startDate,
                        EndDate = null,
                        IsRoomRepresentative = false
                    };
                    _context.ContractDetail.Add(contractDetail);

                    if (currentTenants + 1 == room.MaxGuests)
                        room.Status = ERoomStatus.Occupied;
                }

                await _context.SaveChangesAsync(); 
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
                TenantID = request.TenantID,
                IsRead = false
            });

            await _context.SaveChangesAsync();
            return Ok(new { message = "Request approved successfully." });
        }

        [HttpPost("{id}/reject")]
        public async Task<IActionResult> RejectRequest(int id)
        {
            var request = await _context.Request
                .Include(r => r.Tenant)
                .FirstOrDefaultAsync(r => r.RequestID == id);

            if (request == null) return NotFound(new { message = "Request not found." });

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
                TenantID = request.TenantID,
                IsRead = false
            });

            await _context.SaveChangesAsync();
            return Ok(new { message = "Request rejected successfully." });

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

        [HttpPost("register-room")]
        [Authorize(Policy = "Tenant")]
        public async Task<IActionResult> RegisterRoom([FromBody] RegisterRoomRequestDto dto)
        {
            // 1. Lấy TenantID từ claim
            var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userIdStr)) return Unauthorized();

            var tenantId = int.Parse(userIdStr);

            // 2. Lấy thông tin phòng
            var room = await _context.Room
                .Include(r => r.Building)
                .Include(r => r.Building.Owner)
                .FirstOrDefaultAsync(r => r.RoomID == dto.RoomID);

            if (room == null)
                return NotFound(new { message = "Room not found." });

            // 3. Kiểm tra nếu đã có request pending tương tự
            var existedRequest = await _context.Request
                .FirstOrDefaultAsync(r =>
                    r.Type == ERequestType.RoomRegistration &&
                    r.TenantID == tenantId &&
                    r.Title == $"{room.RoomNumber} - {room.Building.Name}" &&
                    r.Status == ERequestStatus.Pending);

            if (existedRequest != null)
                return BadRequest(new { message = "You already have a pending registration request for this room." });

            // 4. Serialize StartDate & EndDate vào Content
            var contentObj = new
            {
                startDate = dto.StartDate,
                endDate = dto.EndDate
            };
            var contentJson = JsonSerializer.Serialize(contentObj);

            // 👉 5. Kiểm tra tenant có hợp đồng nào chưa kết thúc không (EndDate == null)
            bool hasActiveContract = await _context.ContractDetail
                .AnyAsync(cd => cd.TenantID == tenantId && cd.EndDate == null);

            // 👉 6. Tạo tiêu đề với thông điệp phù hợp
            var actionLabel = hasActiveContract ? "(Room transfer)" : "(New room registration)";
            var title = $"{room.RoomNumber} - {room.Building.Name} {actionLabel}";

            // 👉 7. Tạo request mới
            var request = new Request
            {
                TenantID = tenantId,
                OwnerID = room.Building.OwnerID,
                Type = ERequestType.RoomRegistration,
                Title = title,
                Content = contentJson,
                Image = null,
                Status = ERequestStatus.Pending,
                CreateAt = DateTime.Now
            };

            _context.Request.Add(request);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Room registration request created successfully." });
        }




    }
}