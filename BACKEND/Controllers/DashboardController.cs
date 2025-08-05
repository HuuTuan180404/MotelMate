using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using BACKEND.Data;
using BACKEND.DTOs.DashboardDTO;
using BACKEND.Enums;
using CloudinaryDotNet.Core;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BACKEND.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class DashboardController : ControllerBase
    {
        private readonly MotelMateDbContext _context;
        public DashboardController(MotelMateDbContext context)
        {
            _context = context;
        }
        [HttpGet]
        public async Task<ActionResult<IEnumerable<DashboardInfoDTO>>> GetDashboardInfo()
        {
            var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var buildings = _context.Building
                .Include(b => b.Owner)
                .Include(b => b.Rooms)
                    .ThenInclude(r => r.Contracts)
                        .ThenInclude(c => c.ContractDetail)
                .Include(b => b.Rooms)
                    .ThenInclude(r => r.Contracts)
                        .ThenInclude(c => c.Invoice)
                .Where(b => b.Owner.Id == int.Parse(userIdStr));
            var buildingList = await buildings.ToListAsync();
            if (buildingList.Count == 0)
            {
                return NotFound(new { message = "No buildings found" });
            }
            // Lấy 4 tháng gần nhất từ tháng hiện tại (VD: tháng 8 -> 5,6,7,8)
            var now = DateTime.UtcNow;
            var startMonth = DateOnly.FromDateTime(DateTime.UtcNow.AddMonths(-3));

            // Lấy tất cả invoice trong khoảng 4 tháng gần đây
            var recentInvoices = buildingList
                .SelectMany(b => b.Rooms)
                .SelectMany(r => r.Contracts)
                .SelectMany(c => c.Invoice)
                .Where(i =>
                    i.Status == EInvoiceStatus.Paid &&
                    i.PeriodEnd >= startMonth)
                .ToList();

            // Nhóm theo tháng/năm và tính tổng
            var revenueByMonth = recentInvoices
                .GroupBy(i => new { i.PeriodEnd.Year, i.PeriodEnd.Month })
                .OrderBy(g => g.Key.Year).ThenBy(g => g.Key.Month)
                .Select(g => (int)g.Sum(i => i.TotalAmount))
                .ToList();

            // Bảo đảm luôn có 4 phần tử, thêm 0 nếu thiếu tháng
            while (revenueByMonth.Count < 4)
            {
                revenueByMonth.Insert(0, 0);
            }

            return Ok(new DashboardInfoDTO
            {
                TotalBuilding = buildings.Count(),
                TotalRooms = buildings.Sum(b => b.Rooms.Count()),
                TotalTenants = buildings.Sum(b => b.Rooms.Sum(r => r.Contracts.Count(c => c.ContractDetail.Any(cd => cd.EndDate == null)))),
                TotalRevenue = (int)buildings.Sum(b => b.Rooms.Sum(r => r.Contracts.Sum(c => c.Invoice.Where(i => i.Status == EInvoiceStatus.Paid).Sum(i => i.TotalAmount)))),
                RevenueByMonth = revenueByMonth,
                RoomsByStatus = new List<int> {
                    buildings.Sum(b => b.Rooms.Count(r => r.Status == ERoomStatus.Available)),
                    buildings.Sum(b => b.Rooms.Count(r => r.Status == ERoomStatus.Maintenance)),
                    buildings.Sum(b => b.Rooms.Count(r => r.Status == ERoomStatus.Occupied))
                }
            });
        }
    }
}