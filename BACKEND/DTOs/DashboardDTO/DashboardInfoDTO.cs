using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BACKEND.DTOs.DashboardDTO
{
    public class DashboardInfoDTO
    {
        public int TotalBuilding { get; set; }
        public int TotalRooms { get; set; }
        public int TotalTenants { get; set; }
        public decimal TotalRevenue { get; set; }
        public List<int> RevenueByMonth { get; set; }
        public List<string> RoomsByStatus { get; set; } 
    }
}