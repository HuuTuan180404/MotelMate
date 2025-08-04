using System.Security.Claims;
using AutoMapper;
using BACKEND.Data;
using BACKEND.DTOs;
using BACKEND.DTOs.RoomDTO;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BACKEND.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class TenantController : ControllerBase
    {
        private readonly MotelMateDbContext _context;
        private readonly IMapper _mapper;

        public TenantController(MotelMateDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        // GET: api/tenant
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ReadTenantDTO>>> GetTenants()
        {
            var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!long.TryParse(userIdStr, out var ownerId))
            {
                return Unauthorized("User ID not found or invalid");
            }

            var tenants = await _context.Tenant
                        .Include(t => t.ContractDetails)
                            .ThenInclude(cd => cd.Contract)
                                .ThenInclude(c => c.Room)
                                    .ThenInclude(r => r.Building)
                        .Where(t => t.ContractDetails.Any(cd =>
                            cd.Contract.Room.Building.OwnerID == ownerId))
                        .ToListAsync();

            return Ok(_mapper.Map<List<ReadTenantDTO>>(tenants));
        }

        // GET: api/tenant/1
        [HttpGet("{id}")]
        public async Task<ActionResult<ReadTenantDTO>> GetTenantDetail(int id)
        {
            var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!long.TryParse(userIdStr, out var ownerId))
            {
                return Unauthorized("User ID not found or invalid");
            }

            var tenants = await _context.Tenant
                        .Include(t => t.ContractDetails)
                            .ThenInclude(cd => cd.Contract)
                                .ThenInclude(c => c.Room)
                                    .ThenInclude(r => r.Building)
                        .Where(t => t.Id == id)
                        .Where(t => t.ContractDetails.Any(cd => cd.Contract.Room.Building.OwnerID == ownerId))
                        .FirstOrDefaultAsync();

            return Ok(_mapper.Map<ReadTenantDTO>(tenants));
        }


        [HttpGet("by-cccd/{cccd}")]
        public async Task<ActionResult<ReadTenantDTO>> GetTenantDetailByCCCD(string cccd)
        {
            var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!long.TryParse(userIdStr, out var ownerId))
            {
                return Unauthorized("User ID not found or invalid");
            }

            var tenants = await _context.Tenant
                        .Include(t => t.ContractDetails)
                            .ThenInclude(cd => cd.Contract)
                                .ThenInclude(c => c.Room)
                                    .ThenInclude(r => r.Building)
                        .Where(t => t.CCCD == cccd)
                        .Where(t => t.ContractDetails.Any(cd => cd.Contract.Room.Building.OwnerID == ownerId))
                        .FirstOrDefaultAsync();

            return Ok(_mapper.Map<ReadTenantDTO>(tenants));
        }
    }
}
