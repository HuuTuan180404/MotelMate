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
        public int MaxGuests { get; set; }
        public string? Description { get; set; }
        public List<int>? AddedMembers { get; set; }
        public List<int>? DeletedMembers { get; set; }
        public List<string>? DeletedImages { get; set; }
        public List<UpdateRoomAssetDTO>? Assets { get; set; }
        public bool TerminateContract { get; set; } = false;

        public override string ToString()
        {
            return $@"
RoomID: {RoomID}
RoomNumber: {RoomNumber}
Area: {Area}
Price: {Price}
Description: {Description}
AddedMembers: [{string.Join(", ", AddedMembers ?? new List<int>())}]
DeletedMembers: [{string.Join(", ", DeletedMembers ?? new List<int>())}]
DeletedImages: [{string.Join(", ", DeletedImages ?? new List<string>())}]
Assets: [{string.Join(", ", Assets?.Select(a => $"(AssetID: {a.AssetID}, Quantity: {a.Quantity})") ?? new List<string>())}]
TerminateContract: {TerminateContract}
";
        }

    }

    public class UpdateRoomAssetDTO
    {
        public int AssetID { get; set; }
        public int Quantity { get; set; }
    }
}