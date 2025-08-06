using System.Net;
using System.Runtime.InteropServices;
using System.Security.Claims;
using AutoMapper;
using BACKEND.Data;
using BACKEND.DTOs.RoomDTO;
using BACKEND.Enums;
using BACKEND.Models;
using BACKEND.RoomDTO.DTOs;
using Bogus.DataSets;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;

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
                                    .Include(r => r.Contracts.Where(c => c.Status != EContractStatus.Terminated)) // hợp đồng active
                                        .ThenInclude(c => c.ContractDetail.Where(cd => cd.EndDate == null))
                                            .ThenInclude(cd => cd.Tenant)
                                    .Where(b => b.Building.Owner.Id == userId)
                                    .ToListAsync();

            return Ok(_mapper.Map<List<ReadRoomDTO>>(rooms));
        }

        // GET: api/room
        [HttpGet("room-management/{id}")]
        public async Task<ActionResult<ReadRoomDTO>> GetRoom(int id)
        {
            var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!long.TryParse(userIdStr, out var userId))
            {
                return Unauthorized("User ID not found or invalid");
            }

            var rooms = await _context.Room
                                    .Include(r => r.Building)
                                    .Include(r => r.RoomImages)
                                    .Include(r => r.Contracts.Where(c => c.Status != EContractStatus.Terminated))
                                        .ThenInclude(c => c.ContractDetail.Where(cd => cd.EndDate == null))
                                            .ThenInclude(cd => cd.Tenant)
                                    .Where(b => b.Building.Owner.Id == userId)
                                    .FirstOrDefaultAsync(r => r.RoomID == id);

            if (rooms == null) return NotFound(new { Message = "Room not found" });

            return Ok(_mapper.Map<ReadRoomDTO>(rooms));
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
                                    .Include(r => r.Contracts) // hợp đồng active
                                        .ThenInclude(c => c.ContractDetail.Where(cd => cd.EndDate == null))
                                            .ThenInclude(cd => cd.Tenant)
                                    .Include(ra => ra.RoomAssets)
                                        .ThenInclude(a => a.Asset)
                                    .FirstOrDefaultAsync(r => r.RoomID == id);
            return Ok(_mapper.Map<ReadRoomDetailDTO>(room));
        }

        [HttpGet("by-tenant-id")]
        public async Task<ActionResult<ReadRoomDetailDTO>> GetRoomDetailByTenantID()
        {
            var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!int.TryParse(userIdStr, out var userId))
                return Unauthorized("User ID not found or invalid");

            var roomId = await _context.ContractDetail
                                        .Where(cd => cd.EndDate == null && cd.TenantID == userId)
                                        .Include(cd => cd.Contract)
                                            .ThenInclude(c => c.Room)
                                        .Select(cd => cd.Contract.Room.RoomID)
                                        .FirstOrDefaultAsync();

            if (roomId == 0) return NotFound(new { messase = "Not found room id" });

            var result = await GetRoomDetail(roomId);
            return result.Result!;
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
                return BadRequest(new { Message = "Room number already exists" });

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
                room.Status = ERoomStatus.Available;
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
                                    // Console.WriteLine("Image uploaded to Cloudinary: " + imageUrl);
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
        }


        [HttpPut("update-room")]
        public async Task<IActionResult> UpdateRoom(
            [FromForm] string body,
            [FromForm] List<IFormFile> addedImages)
        {

            if (!ModelState.IsValid)
                return BadRequest(new { Message = "Invalid input" });
            try
            {

                var request = JsonConvert.DeserializeObject<UpdateRoomDTO>(body);

                Contract? contract = null;

                if (request.TerminateContract == true)
                {
                    var roomID = request.RoomID;

                    contract = await _context.Contract
                                                .Include(c => c.ContractDetail)
                                                .Include(c => c.Room)
                                                .Where(c => c.RoomID == roomID && c.Status != EContractStatus.Terminated)
                                                .FirstOrDefaultAsync();

                    if (contract == null)
                    {
                        return NotFound(new { Message = "Không tìm thấy hợp đồng đang hoạt động cho phòng này." });
                    }

                    // chuyển lại available cho phòng
                    contract.Room.Status = ERoomStatus.Available;

                    // Cập nhật trạng thái hợp đồng
                    contract.Status = EContractStatus.Terminated;
                    contract.EndDate = DateOnly.FromDateTime(DateTime.Now);

                    // Cập nhật EndDate cho tất cả tenant trong hợp đồng
                    foreach (var detail in contract.ContractDetail)
                    {
                        if (detail.EndDate == null)
                        {
                            detail.EndDate = DateOnly.FromDateTime(DateTime.Now);
                        }
                    }

                    await _context.SaveChangesAsync();

                    return Ok(new
                    {
                        Message = "The contract has been successfully terminated.",
                        ContractID = contract.ContractID,
                        RoomID = roomID
                    });
                }


                var room = await _context.Room.FirstOrDefaultAsync(r => r.RoomID == request.RoomID);

                if (room == null)
                    return NotFound(new { Message = "Room not found" });

                if (request.RoomNumber != room.RoomNumber && IsExistsRoomByNumber(room.BuildingID ?? -1, request.RoomNumber))
                {
                    return BadRequest(new { Message = "Room number already exists" });
                }

                // Cập nhật thông tin phòng
                room.RoomNumber = request.RoomNumber;
                room.Area = request.Area;
                room.Price = request.Price;
                room.MaxGuests = request.MaxGuests;
                room.Description = request.Description;

                // Xóa ảnh
                if (request.DeletedImages?.Any() == true)
                {
                    var imagesToDelete = await _context.RoomImage
                        .Where(i => request.DeletedImages.Contains(i.ImageURL))
                        .ToListAsync();

                    _context.RoomImage.RemoveRange(imagesToDelete);
                }

                // Upload ảnh mới
                if (addedImages?.Any() == true)
                {
                    foreach (var file in addedImages)
                    {
                        if (file.Length > 0)
                        {
                            var uploadParams = new ImageUploadParams
                            {
                                File = new FileDescription(room.RoomID + file.FileName, file.OpenReadStream()),
                                Folder = "intern_motel_mate"
                            };

                            var uploadResult = await _cloudinary.UploadAsync(uploadParams);

                            if (uploadResult.StatusCode == HttpStatusCode.OK)
                            {
                                _context.RoomImage.Add(new RoomImage
                                {
                                    RoomID = room.RoomID,
                                    ImageURL = uploadResult.SecureUrl.ToString()
                                });
                            }
                            else
                            {
                                return StatusCode(500, new { Message = $"Upload failed for file {file.FileName}" });
                            }
                        }
                    }
                }

                // Cập nhật tài sản
                if (request.Assets?.Any() == true)
                {
                    foreach (var asset in request.Assets)
                    {
                        var roomAsset = await _context.RoomAsset
                            .FirstOrDefaultAsync(ra => ra.AssetID == asset.AssetID && ra.RoomID == room.RoomID);

                        if (roomAsset != null)
                        {
                            if (asset.Quantity == 0)
                                _context.RoomAsset.Remove(roomAsset);
                            else
                                roomAsset.Quantity = asset.Quantity;
                        }
                        else if (asset.Quantity > 0)
                        {
                            _context.RoomAsset.Add(new RoomAsset
                            {
                                RoomID = room.RoomID,
                                AssetID = asset.AssetID,
                                Quantity = asset.Quantity
                            });
                        }

                    }
                }

                // Lưu thay đổi trước khi xử lý thành viên
                await _context.SaveChangesAsync();

                contract = await _context.Contract
                                      .Where(c => c.RoomID == room.RoomID && c.Status != EContractStatus.Terminated)
                                      .FirstOrDefaultAsync();

                // Thêm thành viên mới
                if (request.AddedMembers?.Any() == true)
                {
                    // Tìm hợp đồng đang hoạt động
                    if (contract == null)
                        return BadRequest(new { Message = "Active contract not found for room" });

                    foreach (var memberId in request.AddedMembers)
                    {
                        _context.ContractDetail.Add(new ContractDetail
                        {
                            ContractID = contract.ContractID,
                            TenantID = memberId,
                            StartDate = DateOnly.FromDateTime(DateTime.Now),
                            EndDate = null
                        });
                    }
                }

                // Cập nhật kết thúc hợp đồng cho thành viên xóa
                if (request.DeletedMembers?.Any() == true)
                {
                    if (contract == null)
                        return BadRequest(new { Message = "Active contract not found for room" });

                    var contractDetails = await _context.ContractDetail
                        .Where(cd => cd.ContractID == contract.ContractID && request.DeletedMembers.Contains(cd.TenantID))
                        .ToListAsync();

                    foreach (var cd in contractDetails)
                    {
                        cd.EndDate = DateOnly.FromDateTime(DateTime.Now);
                    }
                }

                await _context.SaveChangesAsync();

                return Ok(new
                {
                    Message = "Room updated successfully",
                    RoomID = room.RoomID
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "Server error", Details = ex.Message });
            }

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
