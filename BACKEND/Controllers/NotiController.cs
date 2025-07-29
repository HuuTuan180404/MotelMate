using System.Security.Claims;
using AutoMapper;
using BACKEND.Data;
using BACKEND.DTOs.RoomDTO;
using BACKEND.Enums;
using BACKEND.Models;
using BACKEND.RoomDTO.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BACKEND.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NotiController : ControllerBase
    {
        private readonly MotelMateDbContext _context;
        private readonly IMapper _mapper;

        public NotiController(MotelMateDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        [HttpGet("with-rooms")]
        public async Task<ActionResult<IEnumerable<object>>> GetBuildingsWithRooms()
        {
            var buildingRooms = await _context.Building
                                                .Include(r => r.Room)
                                                .Select(b => new
                                                {
                                                    BuildingID = b.BuildingID,
                                                    BuildingName = b.Name,
                                                    BuildingAddress = b.Address,
                                                    Rooms = b.Room.Select(r => new
                                                    {
                                                        RoomID = r.RoomID,
                                                        RoomNumber = r.RoomNumber
                                                    }).ToList()
                                                })
                                                .ToListAsync();

            return Ok(buildingRooms);
        }

        // GET: api/Rooms/5
        // [Authorize]
        // [HttpGet("{id}")]
        // public async Task<ActionResult<ReadRoomDetailDTO>> GetRoomDetail(int id)
        // {
        //     var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        //     var room = await _context.Room
        //                             .Include(r => r.Building)
        //                                 .ThenInclude(b => b.Owner)
        //                             .Include(r => r.RoomImages)
        //                             .Include(r => r.Contracts.Where(c => c.Status == EContractStatus.Active)) // hợp đồng active
        //                                 .ThenInclude(c => c.ContractDetail)
        //                                     .ThenInclude(cd => cd.Tenant)
        //                             .Include(ra => ra.RoomAssets)
        //                                 .ThenInclude(a => a.Asset)
        //                             .FirstOrDefaultAsync(r => r.RoomID == id);

        //     return Ok(_mapper.Map<ReadRoomDetailDTO>(room));
        // }

        // private bool RoomIsExists(int id)
        // {
        //     return _context.Room.Any(e => e.RoomID == id);
        // }
    }

    // Building-roomDTO
    // public class BuildingRoomDTO
    // {
    //     public int BuildingID { get; set; }
    //     public string BuildingName { get; set; }
    //     public List<Room> Room { get; set; }
    // }
}
