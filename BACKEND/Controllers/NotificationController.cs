using System.Security.Claims;
using AutoMapper;
using BACKEND.Data;
using BACKEND.DTOs.RoomDTO;
using BACKEND.Enums;
using BACKEND.Models;
using BACKEND.RoomDTO.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BACKEND.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class NotificationController : ControllerBase
    {
        private readonly MotelMateDbContext _context;
        private readonly IMapper _mapper;

        public NotificationController(MotelMateDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }


        [HttpPost("send-notification")]
        public async Task<IActionResult> SendNotification(CreateNotificationDTO dto)
        {
            if (string.IsNullOrEmpty(dto.Title) ||
                (dto.SelectedRooms == null && dto.SelectedBuildings == null) ||
                (!dto.SelectedRooms?.Any() == true && !dto.SelectedBuildings?.Any() == true))
            {
                return BadRequest("Dữ liệu không hợp lệ.");
            }

            var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!int.TryParse(userIdStr, out var userId))
            {
                return Unauthorized("User ID không hợp lệ.");
            }

            List<int> tenantIds = new();

            if (dto.SelectedBuildings?.Any() == true)
            {
                tenantIds = await _context.ContractDetail
                    .Where(cd => cd.EndDate == null &&
                                 cd.Contract.Status != EContractStatus.Terminated &&
                                 dto.SelectedBuildings.Contains(cd.Contract.Room.Building.BuildingID))
                    .Select(cd => cd.TenantID)
                    .Distinct()
                    .ToListAsync();
            }
            else if (dto.SelectedRooms?.Any() == true)
            {
                tenantIds = await _context.ContractDetail
                    .Where(cd => cd.EndDate == null &&
                                 cd.Contract.Status != EContractStatus.Terminated &&
                                 dto.SelectedRooms.Contains(cd.Contract.RoomID.Value))
                    .Select(cd => cd.TenantID)
                    .Distinct()
                    .ToListAsync();
            }

            if (!tenantIds.Any())
            {
                return BadRequest("Không tìm thấy tenant phù hợp để gửi.");
            }

            var newNoti = new Noti
            {
                Title = dto.Title,
                Content = dto.Content,
                OwnerID = userId
            };

            _context.Noti.Add(newNoti);
            await _context.SaveChangesAsync(); // Lấy ID

            var notiRecipients = tenantIds.Select(tenantId => new NotiRecipient
            {
                NotiID = newNoti.NotiID,
                TenantID = tenantId
            });

            _context.NotiRecipient.AddRange(notiRecipients);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Thông báo đã được gửi thành công!" });
        }


        [HttpGet("tenant-get-notification")]
        public async Task<ActionResult<IEnumerable<ReadNotificationDTO>>> GetNotifications()
        {
            var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!int.TryParse(userIdStr, out var tenantID))
                return Unauthorized("User ID không hợp lệ.");

            var notis = await _context.NotiRecipient
                                    .Where(nr => nr.TenantID == tenantID)
                                    .Include(nr => nr.Noti)
                                        .ThenInclude(n => n.Owner)
                                    .Select(s => new ReadNotificationDTO
                                    {
                                        NotiID = s.NotiID,
                                        Title = s.Noti.Title,
                                        Content = s.Noti.Content,
                                        CreateAt = s.Noti.CreateAt,
                                        IsRead = s.IsRead,
                                    })
                                    .ToListAsync();

            if (notis == null)
                return NotFound(new { message = "Not found any notification" });

            return Ok(notis);
        }


        [HttpPatch("is-read-notification")]
        public async Task<IActionResult> IsReadNotification([FromBody] List<int> notiIDs)
        {
            var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!int.TryParse(userIdStr, out var tenantId))
                return Unauthorized("User ID không hợp lệ.");

            if (notiIDs == null || notiIDs.Count == 0)
                return BadRequest(new { message = "Danh sách thông báo trống." });

            var notiRecipients = await _context.NotiRecipient
                .Where(nr => notiIDs.Contains(nr.NotiID) && nr.TenantID == tenantId)
                .ToListAsync();

            // Kiểm tra xem có thông báo nào không tìm thấy
            var foundIds = notiRecipients.Select(nr => nr.NotiID).ToList();
            var notFoundIds = notiIDs.Except(foundIds).ToList();

            if (notFoundIds.Any())
                return NotFound(new { message = "Không tìm thấy các thông báo sau:", notFoundIds });

            // Đánh dấu tất cả là đã đọc
            foreach (var recipient in notiRecipients)
            {
                recipient.IsRead = true;
            }

            await _context.SaveChangesAsync();

            return Ok(new { message = "Cập nhật trạng thái đọc thành công." });
        }
    }
}
