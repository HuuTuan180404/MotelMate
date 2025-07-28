using System.Security.Claims;
using AutoMapper;
using BACKEND.Data;
using BACKEND.DTOs.RoomDTO;
using BACKEND.Enums;
using BACKEND.RoomDTO.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BACKEND.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RoomController : ControllerBase
    {
        private readonly MotelMateDbContext _context;
        private readonly IMapper _mapper;

        public RoomController(MotelMateDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        // GET: api/room
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ReadRoomDTO>>> GetRooms()
        {
            var rooms = await _context.Room
                                    .Include(r => r.Building)
                                    .Include(r => r.RoomImages)
                                    .Include(r => r.Contracts.Where(c => c.Status == EContractStatus.Active)) // hợp đồng active
                                        .ThenInclude(c => c.ContractDetail)
                                            .ThenInclude(cd => cd.Tenant)
                                    .ToListAsync();

            return Ok(_mapper.Map<List<ReadRoomDTO>>(rooms));
        }

        // GET: api/Rooms/5
        // [Authorize]
        [HttpGet("{id}")]        
        public async Task<ActionResult<ReadRoomDetailDTO>> GetRoomDetail(int id)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var room = await _context.Room
                                    .Include(r => r.Building)
                                        .ThenInclude(b => b.Owner)
                                    .Include(r => r.RoomImages)
                                    .Include(r => r.Contracts.Where(c => c.Status == EContractStatus.Active)) // hợp đồng active
                                        .ThenInclude(c => c.ContractDetail)
                                            .ThenInclude(cd => cd.Tenant)
                                    .Include(ra => ra.RoomAssets)
                                        .ThenInclude(a => a.Asset)
                                    .FirstOrDefaultAsync(r => r.RoomID == id);

            return Ok(_mapper.Map<ReadRoomDetailDTO>(room));
        }

        private bool RoomIsExists(int id)
        {
            return _context.Room.Any(e => e.RoomID == id);
        }
    }

}
