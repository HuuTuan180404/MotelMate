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
        [Authorize()]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ReadAssetDTO>>> GetAssets()
        {
            var assets = await _context.Asset
                    .Include(a => a.RoomAsset)
                    .OrderByDescending(a => a.RoomAsset.Count())
                    .ToListAsync();
            return Ok(_mapper.Map<List<ReadAssetDTO>>(assets));
        }
    }
}
