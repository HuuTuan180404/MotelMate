using System.Security.Claims;
using AutoMapper;
using BACKEND.Data;
using BACKEND.DTOs.RoomDTO;
using BACKEND.Enums;
using BACKEND.Models;
using BACKEND.RoomDTO.DTOs;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BACKEND.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class RoomController : ControllerBase
    {
        private readonly MotelMateDbContext _context;
        private readonly IMapper _mapper;
        private readonly Cloudinary _cloudinary;

        public RoomController(MotelMateDbContext context, IMapper mapper, Cloudinary cloudinary)
        {
            _context = context;
            _mapper = mapper;
            _cloudinary = cloudinary;
        }

        // GET: api/room
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ReadRoomDTO>>> GetRooms()
        {
            var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!long.TryParse(userIdStr, out var userId))
            {
                return Unauthorized("User ID not found or invalid");
            }

            var rooms = await _context.Room
                                    .Include(r => r.Building)
                                    .Include(r => r.RoomImages)
                                    .Include(r => r.Contracts.Where(c => c.Status == EContractStatus.Active)) // hợp đồng active
                                        .ThenInclude(c => c.ContractDetail.Where(cd => cd.EndDate == null))
                                            .ThenInclude(cd => cd.Tenant)
                                    .Where(b => b.Building.Owner.Id == userId)
                                    .ToListAsync();

            return Ok(_mapper.Map<List<ReadRoomDTO>>(rooms));
        }

        // GET: api/Rooms/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ReadRoomDetailDTO>> GetRoomDetail(int id)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var room = await _context.Room
                                    .Include(r => r.Building)
                                        .ThenInclude(b => b.Owner)
                                    .Include(r => r.RoomImages)
                                    .Include(r => r.Contracts.Where(c => c.Status == EContractStatus.Active)) // hợp đồng active
                                        .ThenInclude(c => c.ContractDetail.Where(cd => cd.EndDate == null))
                                            .ThenInclude(cd => cd.Tenant)
                                    .Include(ra => ra.RoomAssets)
                                        .ThenInclude(a => a.Asset)
                                    .FirstOrDefaultAsync(r => r.RoomID == id);

            return Ok(_mapper.Map<ReadRoomDetailDTO>(room));
        }

        [HttpPost("add-room")]
        public async Task<IActionResult> UploadRoom(
            [FromForm] int buildingID,
            [FromForm] string roomNumber,
            [FromForm] double area,
            [FromForm] decimal price,
            [FromForm] string? description,
            [FromForm] List<IFormFile>? images,
            [FromForm] List<int>? selectedAssetIDs)
        {
            if (IsExistsRoomByNumber(buildingID, roomNumber))
            {
                return BadRequest(new { Message = "Room number already exists" });
            }

            try
            {
                CreateRoomDTO createRoomDTO = new CreateRoomDTO
                {
                    RoomNumber = roomNumber,
                    Area = area,
                    Price = price,
                    Description = description,
                    BuildingID = buildingID
                };
                var room = _mapper.Map<Room>(createRoomDTO);
                _context.Room.Add(room);
                await _context.SaveChangesAsync();

                var roomID = GetRoomIDByRoomNumber(buildingID, roomNumber);

                if (roomID != -1)
                {
                    if (images != null && images.Any())
                    {
                        foreach (var file in images)
                        {
                            if (file.Length > 0)
                            {
                                var uploadParams = new ImageUploadParams
                                {
                                    File = new FileDescription(roomID + file.FileName, file.OpenReadStream()),
                                    Folder = "intern_motel_mate" // bạn có thể đổi tên folder trên Cloudinary
                                };

                                var uploadResult = await _cloudinary.UploadAsync(uploadParams);

                                if (uploadResult.StatusCode == System.Net.HttpStatusCode.OK)
                                {
                                    string imageUrl = uploadResult.SecureUrl.ToString();

                                    _context.RoomImage.Add(new RoomImage
                                    {
                                        RoomID = roomID,
                                        ImageURL = imageUrl
                                    });
                                    Console.WriteLine("Image uploaded to Cloudinary: " + imageUrl);
                                }
                                else
                                {
                                    return StatusCode(500, new { Message = $"Upload failed for file {file.FileName}" });
                                }
                            }
                        }
                        await _context.SaveChangesAsync();
                    }

                    if (selectedAssetIDs != null && selectedAssetIDs.Any())
                    {
                        foreach (var i in selectedAssetIDs)
                        {
                            _context.RoomAsset.Add(new RoomAsset
                            {
                                AssetID = i,
                                RoomID = roomID,
                                Quantity = 1,
                                Description = null
                            });
                        }

                        try
                        {
                            await _context.SaveChangesAsync();
                        }
                        catch (Exception ex)
                        {
                            // Log lỗi ở đây hoặc return lỗi về client
                            return StatusCode(500, $"Lỗi khi lưu RoomAssets: {ex.Message}");
                        }
                    }

                    return Ok(new { Message = "Room created successfully" });
                }
                return BadRequest(new { Message = "GetRoomIDByRoomNumber() = -1" });
            }
            catch (DbUpdateException dbEx)
            {
                // Lỗi liên quan đến database (VD: khoá trùng, ràng buộc)
                return BadRequest(new { Message = "Database update failed", Details = dbEx.Message });
            }
            catch (AutoMapperMappingException mapEx)
            {
                // Lỗi khi map dữ liệu
                return BadRequest(new { Message = "Mapping error", Details = mapEx.Message });
            }
            catch (Exception ex)
            {
                // Lỗi không xác định
                return StatusCode(500, new { Message = "Internal server error", Details = ex.Message });
            }



            // foreach (var file in images)
            // {
            //     if (file.Length > 0)
            //     {
            //         var filePath = Path.Combine("Uploads", file.FileName);
            //         using (var stream = new FileStream(filePath, FileMode.Create))
            //         {
            //             await file.CopyToAsync(stream);
            //         }
            //     }
            // }


        }

        private int GetRoomIDByRoomNumber(int buildingID, string roomNumber)
        {
            var room = _context.Room.FirstOrDefault(r => r.RoomNumber == roomNumber && r.Building.BuildingID == buildingID);
            return room?.RoomID ?? -1;
        }

        private bool IsExistsRoomByNumber(int buildingID, string roomNumber)
        {
            return _context.Room.Any(r => r.RoomNumber == roomNumber && r.Building.BuildingID == buildingID);
        }



    }
}
