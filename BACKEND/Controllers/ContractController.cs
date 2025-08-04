using AutoMapper;
using BACKEND.Data;
using BACKEND.DTOs;
using BACKEND.DTOs.ContractDTO;
using BACKEND.Enums;
using BACKEND.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BACKEND.Namespace
{
    [Route("api/[controller]")]
    [ApiController]
    public class ContractController : ControllerBase
    {
        private readonly MotelMateDbContext _context;
        private readonly IMapper _mapper;

        public ContractController(MotelMateDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        // GET: api/contract
        // [Authorize]
        [HttpGet("all")]
        public async Task<ActionResult<IEnumerable<ContractDTOs>>> GetContracts()
        {
            var contracts = await _context.Contract
                    .Include(c => c.ContractDetail)
                        .ThenInclude(cd => cd.Tenant)
                    .Include(c => c.Room)
                        .ThenInclude(r => r.Building)
                    .ToListAsync();
            var result = _mapper.Map<List<ContractDTOs>>(contracts);
            return Ok(result);
        }


        [HttpPost("create")]
        public async Task<IActionResult> CreateContract([FromBody] CreateContractDTO request)
        {
            // find room
            var room = await _context.Room
                .Include(r => r.Building)
                .FirstOrDefaultAsync(r => r.RoomNumber == request.RoomNumber && r.Building.BuildingID == request.BuildingID);

            if (room == null)
                return NotFound(new { message = "room not found" });

            if (room.Status != ERoomStatus.Available)
                return BadRequest(new { message = "room is not available" });

            // find tenant
            var tenant = await _context.Tenant
                .Include(t => t.ContractDetails)
                .FirstOrDefaultAsync(t => t.CCCD == request.CCCD);

            if (tenant == null)
                return NotFound(new { message = "tenant not found" });

            // check if tenant is in another room
            var isInAnotherRoom = tenant.ContractDetails.Any(cd =>
                cd.EndDate == null);

            if (isInAnotherRoom)
                return BadRequest(new { message = "tenant is in another room" });

            // create contract
            var contract = new Contract
            {
                Deposit = request.Deposit,
                Price = request.Price,
                StartDate = request.StartDate,
                EndDate = request.EndDate,
                Status = EContractStatus.Unsigned,
                RoomID = room.RoomID,
                Description = "lòng tôi tan nát khi nhận ra ...",
                ContractCode = "C" + room.RoomNumber + DateTime.Now.ToString("yyyyMMddHHmmss")
            };

            _context.Contract.Add(contract);
            await _context.SaveChangesAsync();

            // create contract detail
            var contractDetail = new ContractDetail
            {
                ContractID = contract.ContractID,
                TenantID = tenant.Id,
                StartDate = request.StartDate,
                IsRoomRepresentative = true
            };

            _context.ContractDetail.Add(contractDetail);

            // update room status
            room.Status = ERoomStatus.Occupied;

            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Contract created successfully.",
                ContractID = contract.ContractID
            });
        }
    }
}