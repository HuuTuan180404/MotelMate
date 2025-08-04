using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BACKEND.DTOs.RoomDTO
{
    public class UpdateRoomDTO
    {
        public int RoomID { get; set; }
        public string RoomNumber { get; set; }
        public double Area { get; set; }
        public decimal Price { get; set; }
        public string Description { get; set; }
        public List<int> AddedMembers { get; set; }
        public List<int> DeletedMembers { get; set; }
        public List<string> DeletedImages { get; set; }
        public List<UpdateRoomAssetDTO> Assets { get; set; }
    }

    public class UpdateRoomAssetDTO
    {
        public int AssetID { get; set; }
        public int Quantity { get; set; }
    }
}