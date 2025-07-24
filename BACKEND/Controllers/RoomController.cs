using AutoMapper;
using BACKEND.Data;
using BACKEND.DTOs.RoomDTO;
using BACKEND.RoomDTO.DTOs;
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
                                    .ToListAsync();

            return Ok(_mapper.Map<List<ReadRoomDTO>>(rooms));
        }

        private bool RoomIsExists(int id)
        {
            return _context.Room.Any(e => e.RoomID == id);
        }
    }
}
