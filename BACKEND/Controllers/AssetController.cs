using System.Security.Claims;
using AutoMapper;
using BACKEND.Data;
using BACKEND.DTOs.RoomDTO;
using BACKEND.RoomDTO.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BACKEND.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class AssetController : ControllerBase
    {
        private readonly MotelMateDbContext _context;
        private readonly IMapper _mapper;

        public AssetController(MotelMateDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        // GET: api/tenant
        [Authorize]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ReadAssetDTO>>> GetAssets()
        {
            var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!long.TryParse(userIdStr, out var ownerId))
            {
                return Unauthorized("User ID not found or invalid");
            }
            var assets = await _context.Asset
                    .Include(b => b.Building)
                    .Include(a => a.RoomAsset)
                    .Where(o => o.Building.Owner.Id == ownerId)
                    .OrderByDescending(a => a.RoomAsset.Count())
                    .ToListAsync();
            return Ok(_mapper.Map<List<ReadAssetDTO>>(assets));
        }
    }
}
