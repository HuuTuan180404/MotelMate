using BACKEND.DTOs.ContractDTO;
using BACKEND.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BACKEND.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ContractController : ControllerBase
    {
        private readonly IContractService _contractService;

        public ContractController(IContractService contractService)
        {
            _contractService = contractService;
        }

        [HttpGet("all")]
        public async Task<IActionResult> GetContracts()
        {
            var result = await _contractService.GetAllContractsAsync();
            return Ok(result);
        }

        [HttpPost("create")]
        public async Task<IActionResult> CreateContract([FromBody] CreateContractDTO request)
        {
            return await _contractService.CreateContractAsync(request);
        }

        [HttpPost("terminate-by-room")]
        public async Task<IActionResult> TerminateContractByRoom([FromBody] int roomID)
        {

            return await _contractService.TerminateContractByRoomAsync(roomID);
        }
    }
}
