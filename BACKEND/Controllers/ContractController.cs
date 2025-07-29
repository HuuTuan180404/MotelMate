using AutoMapper;
using BACKEND.Data;
using BACKEND.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace MyApp.Namespace
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
        [Authorize]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ContractDTO>>> GetContracts()
        {
            var contracts = await _context.Contract
                .Include(c => c.ContractDetail)
                    .ThenInclude(cd => cd.Tenant)
                .ToListAsync();

            var result = _mapper.Map<List<ContractDTO>>(contracts);
            return Ok(result);
        }
    }
}