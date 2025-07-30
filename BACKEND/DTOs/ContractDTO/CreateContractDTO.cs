using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BACKEND.DTOs.ContractDTO
{
    public class CreateContractDTO
    {
        public string BuildingName { get; set; }
        public string RoomNumber { get; set; }
        public DateOnly StartDate { get; set; }
        public DateOnly EndDate { get; set; }
        public decimal Deposit { get; set; }
        public decimal Price { get; set; }
        public string CCCD { get; set; }
    }
}