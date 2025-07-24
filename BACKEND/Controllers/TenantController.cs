using AutoMapper;
using BACKEND.Data;
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
            var tenants = await _context.Tenant.ToListAsync();
            return Ok(_mapper.Map<List<ReadTenantDTO>>(tenants));
        }

        // GET: api/Tenant/5
        // [HttpGet("{id}")]
        // public async Task<ActionResult<Tenant>> GetTenant(int id)
        // {
        //     var tenant = await _context.Tenants.FindAsync(id);

        //     if (tenant == null)
        //     {
        //         return NotFound();
        //     }

        //     return tenant;
        // }

        private bool TenantIsExists(int id)
        {
            return _context.Tenant.Any(e => e.Id == id);
        }
    }
}
