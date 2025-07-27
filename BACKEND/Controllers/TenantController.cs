using AutoMapper;
using BACKEND.Data;
using BACKEND.DTOs;
using BACKEND.DTOs.RoomDTO;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BACKEND.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
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
            var tenants = await _context.Tenant.Include(t => t.ContractDetails).ToListAsync();
            return Ok(_mapper.Map<List<ReadTenantDTO>>(tenants));
        }

        // GET: api/tenant/1
        [HttpGet("{id}")]
        public async Task<ActionResult<ReadTenantDetailDTO>> GetTenantDetail(int id)
        {
            var tenant = await _context.Tenant.Include(t => t.ContractDetails).FirstOrDefaultAsync(t => t.Id == id);

            if (tenant == null)
                return NotFound();
            return Ok(_mapper.Map<ReadTenantDTO>(tenant));
        }
    }
}
