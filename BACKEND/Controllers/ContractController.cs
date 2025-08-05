using AutoMapper;
using BACKEND.Data;
using BACKEND.DTOs;
using BACKEND.DTOs.ContractDTO;
using BACKEND.Enums;
using BACKEND.Models;
using Bogus.DataSets;
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
                // .Include(t => t.ContractDetails)
                .FirstOrDefaultAsync(t => t.CCCD == request.CCCD);

            if (tenant == null)
                return NotFound(new { message = "tenant not found" });

            // check if tenant is in another room
            // var isInAnotherRoom = tenant.ContractDetails.Any(cd => cd.EndDate == null);

            var isInAnotherRoom = await _context.ContractDetail
                    .FirstOrDefaultAsync(cd => cd.EndDate == null && cd.TenantID == tenant.Id);

            if (isInAnotherRoom != null)
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
                Description = null,
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


        [HttpPost("terminate-by-room")]
        public async Task<IActionResult> TerminateContractByRoom([FromBody] int roomID)
        {
            // Tìm hợp đồng còn hiệu lực của phòng
            var contract = await _context.Contract
                .Include(c => c.ContractDetail)
                .Include(c => c.Room)
                .Where(c => c.RoomID == roomID && c.Status != EContractStatus.Terminated)
                .FirstOrDefaultAsync();

            if (contract == null)
            {
                return NotFound(new { Message = "Không tìm thấy hợp đồng đang hoạt động cho phòng này." });
            }

            // chuyển lại available cho phòng
            contract.Room.Status = ERoomStatus.Available;

            // Cập nhật trạng thái hợp đồng
            contract.Status = EContractStatus.Terminated;
            contract.EndDate = DateOnly.FromDateTime(DateTime.Now);

            // Cập nhật EndDate cho tất cả tenant trong hợp đồng
            foreach (var detail in contract.ContractDetail)
            {
                if (detail.EndDate == null)
                {
                    detail.EndDate = DateOnly.FromDateTime(DateTime.Now);
                }
            }

            await _context.SaveChangesAsync();

            return Ok(new
            {
                Message = "The contract has been successfully terminated.",
                ContractID = contract.ContractID,
                RoomID = roomID
            });
        }

    }
}