using BACKEND.RoomDTO.DTOs;

namespace BACKEND.DTOs.BuildingDTO
{
    public class ReadBuildingDTO
    {
        public int BuildingID { get; set; }
        public required string Name { get; set; }
        public required string Address { get; set; }
        public required string ImageURL { get; set; }
        public int TotalRooms { get; set; }
        public int AvailableRooms { get; set; }
        public int OccupiedRooms { get; set; }
        public int MaintenanceRooms { get; set; }
        public int TotalTenants { get; set; }
    }
}
