using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using BACKEND.DTOs;
using BACKEND.DTOs.ContractDTO;
using Microsoft.AspNetCore.Mvc;

namespace BACKEND.Interfaces
{
    public interface IContractService
    {
        Task<List<ContractDTOs>> GetAllContractsAsync();
        Task<IActionResult> CreateContractAsync(CreateContractDTO request);
        Task<IActionResult> TerminateContractByRoomAsync(int roomID);

    }
}