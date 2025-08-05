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
            
            return Ok(new DashboardInfoDTO
            {
                TotalBuilding = buildings.Count(),
                TotalRooms = buildings.Sum(b => b.Rooms.Count()),
                TotalTenants = buildings.Sum(b => b.Rooms.Sum(r => r.Contracts.Count(c => c.ContractDetail.Any(cd => cd.EndDate == null)))),
                TotalRevenue = buildings.Sum(b => b.Rooms.Sum(r => r.Contracts.Sum(c => c.Invoice.Where(i => i.Status == EInvoiceStatus.Paid).Sum(i => i.TotalAmount)))),
                RevenueByMonth = new List<int> { 120000, 95000, 130000, 110000 }, 
                RoomsByStatus = new List<string> { "Available", "Maintainance", "Occupied" } 
            });
        }
    }
}