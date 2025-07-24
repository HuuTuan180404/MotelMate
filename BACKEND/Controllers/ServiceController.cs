using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AutoMapper;
using BACKEND.Models;
using BACKEND.DTOs;
using BACKEND.Data;

namespace BACKEND.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ServiceController(MotelMateDbContext context, IMapper mapper) : ControllerBase
    {
        private readonly MotelMateDbContext _context = context;
        private readonly IMapper _mapper = mapper;

        // GET: api/Service
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ReadServiceDTO>>> GetServices()
        {
            var services = await _context.Services
                .Include(s => s.ServiceTier)
                .ToListAsync();

            var serviceDTOs = _mapper.Map<List<ReadServiceDTO>>(services);

            return Ok(serviceDTOs);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> EditService(int id, [FromBody] EditServiceDTO dto)
        {
            var service = await _context.Services
                .Include(s => s.ServiceTier)
                .FirstOrDefaultAsync(s => s.ServiceID == id);

            if (service == null)
                return NotFound("Service not found");

            if (service.IsTiered != dto.IsTiered)
                return BadRequest("Cannot change isTiered value");

            service.Name = dto.Name;
            service.Unit = dto.Unit;
            service.InitialPrice = dto.InitialPrice;
            service.CustomerPrice = dto.CustomerPrice;

            var incomingTiers = dto.ServiceTier ?? new List<EditServiceTierDTO>();

            var tiersToRemove = service.ServiceTier
                .Where(t => !incomingTiers.Any(it => it.ServiceTierID == t.ServiceTierID))
                .ToList();

            foreach (var tier in tiersToRemove)
            {
                service.ServiceTier.Remove(tier);
            }

            foreach (var tierDto in incomingTiers)
            {
                var existingTier = service.ServiceTier.FirstOrDefault(t => t.ServiceTierID == tierDto.ServiceTierID);

                if (existingTier != null)
                {
                    existingTier.FromQuantity = tierDto.FromQuantity;
                    existingTier.ToQuantity = tierDto.ToQuantity;
                    existingTier.GovUnitPrice = tierDto.GovUnitPrice;
                }
                else
                {
                    service.ServiceTier.Add(new ServiceTier
                    {
                        FromQuantity = tierDto.FromQuantity,
                        ToQuantity = tierDto.ToQuantity,
                        GovUnitPrice = tierDto.GovUnitPrice
                    });
                }
            }

            await _context.SaveChangesAsync();

            return NoContent();
        }


        // DELETE: api/Service/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteService(int id)
        {
            var service = await _context.Services
                .Include(s => s.ServiceTier)
                .FirstOrDefaultAsync(s => s.ServiceID == id);

            if (service == null)
                return NotFound("Service not found");

            _context.ServiceTiers.RemoveRange(service.ServiceTier);
            _context.Services.Remove(service);

            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
