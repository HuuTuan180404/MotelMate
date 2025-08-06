using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BACKEND.DTOs.RoomDTO
{
    public class CreateRoomDTO
    {
        public string RoomNumber { get; set; }
        public double Area { get; set; }
        public decimal Price { get; set; }
        public string? Description { get; set; }
        public int MaxGuests { get; set; }

        public Nullable<int> BuildingID { get; set; }
    }
}