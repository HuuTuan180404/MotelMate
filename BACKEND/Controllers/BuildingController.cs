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

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateBuilding(int id, UpdateBuildingDTO updateDTO)
        {
            var building = await _context.Building.FindAsync(id);

            if (building == null)
            {
                return NotFound();
            }

            _mapper.Map(updateDTO, building);

            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/Building/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBuilding(int id)
        {
            var building = await _context.Building
                .Include(b => b.Rooms)
                .FirstOrDefaultAsync(b => b.BuildingID == id);

            if (building == null)
            {
                return NotFound();
            }

            if (building.Rooms.Any())
            {
                return BadRequest("Cannot delete building with existing rooms.");
            }

            _context.Building.Remove(building);
            await _context.SaveChangesAsync();

            return NoContent();
        }


    }
}