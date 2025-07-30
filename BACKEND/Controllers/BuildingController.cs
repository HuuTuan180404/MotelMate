using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AutoMapper;
using BACKEND.Models;
using BACKEND.DTOs.BuildingDTO;
using BACKEND.Data;
using AutoMapper.QueryableExtensions;
using BACKEND.Enums;

namespace BACKEND.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BuildingController(MotelMateDbContext context, IMapper mapper) : ControllerBase
    {
        private readonly MotelMateDbContext _context = context;
        private readonly IMapper _mapper = mapper;

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ReadBuildingDTO>>> GetBuildingSummary()
        {
            var buildings = await _context.Building
                .ProjectTo<ReadBuildingDTO>(_mapper.ConfigurationProvider)
                .ToListAsync();

            return Ok(buildings);
        }
    }
}