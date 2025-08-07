using BACKEND.Data;
using BACKEND.Enums;
using BACKEND.Models;
using BACKEND.Interfaces;
using BACKEND.DTOs.ContractDTO;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using BACKEND.DTOs.AuthDTO;

namespace BACKEND.Data
{
    public class MotelDbSeeder
    {
        private readonly MotelMateDbContext _context;
        private readonly IContractService _contractService;
        private readonly IAuthService _accountService;


        public MotelDbSeeder(MotelMateDbContext context, IContractService contractService, IAuthService accountService)
        {
            _accountService = accountService;
            _context = context;
            _contractService = contractService;
        }

        public async Task SeedAllAsync()
        {
            await SeedBuildingsAsync();
            await SeedRoomsAsync();
            await SeedAssetsAsync();
            await SeedRoomAssetsAsync();
            await SeedTenantsAsync();
            await SeedContractsForFirst22TenantsAsync();
        }

        public async Task SeedBuildingsAsync()
        {
            if (await _context.Building.AnyAsync()) return;
            var random = new Random();
            var buildings = new List<Building>();

            for (int i = 1; i <= 15; i++)
            {
                var ownerID = random.Next(2, 5);
                buildings.Add(new Building
                {
                    Name = $"Building {i}",
                    Address = "Quy Nhơn - Bình Định - Việt Nam",
                    ImageURL = "https://tse1.mm.bing.net/th/id/OIP.Gal8T40MNWTINM15QEuLAwHaLH?r=0&cb=thfvnext&rs=1&pid=ImgDetMain&o=7&rm=3",
                    OwnerID = ownerID,
                    Owner = await _context.Owner.FirstOrDefaultAsync(o => o.Id == ownerID)
                });
            }

            await _context.Building.AddRangeAsync(buildings);
            await _context.SaveChangesAsync();
        }

        public async Task SeedRoomsAsync()
        {
            if (await _context.Room.AnyAsync()) return;

            var buildings = await _context.Building.ToListAsync();
            var rooms = new List<Room>();
            int roomCounter = 1;
            int buildingIndex = 0;

            for (int i = 0; i < 76; i++)
            {
                if (i > 0 && i % 6 == 0) buildingIndex++;
                rooms.Add(new Room
                {
                    RoomNumber = $"P{roomCounter++}",
                    Area = 26,
                    Price = 3000000,
                    Status = ERoomStatus.Available,
                    Description = "none",
                    BuildingID = buildings[buildingIndex].BuildingID,
                    Building = buildings[buildingIndex]
                });
            }

            for (int i = 76; i < 90; i++)
            {
                if (i > 0 && i % 6 == 0) buildingIndex++;
                rooms.Add(new Room
                {
                    RoomNumber = $"P{roomCounter++}",
                    Area = 26,
                    Price = 3000000,
                    Status = ERoomStatus.Maintenance,
                    Description = "none",
                    BuildingID = buildings[buildingIndex].BuildingID,
                    Building = buildings[buildingIndex]
                });
            }

            await _context.Room.AddRangeAsync(rooms);
            await _context.SaveChangesAsync();
        }

        public async Task SeedAssetsAsync()
        {
            if (await _context.Asset.AnyAsync()) return;

            var assets = new List<Asset>();
            var types = Enum.GetValues<EAssetType>();
            int typeIndex = 0;

            for (int i = 1; i <= 16; i++)
            {
                if ((i - 1) % 4 == 0 && i != 1) typeIndex++;

                assets.Add(new Asset
                {
                    Name = $"Asset {i}",
                    Price = 1_000_000,
                    Description = "none",
                    Type = types[typeIndex]
                });
            }

            await _context.Asset.AddRangeAsync(assets);
            await _context.SaveChangesAsync();
        }

        public async Task SeedRoomAssetsAsync()
        {
            if (await _context.RoomAsset.AnyAsync()) return;

            var rooms = await _context.Room.ToListAsync();
            var assets = await _context.Asset.ToListAsync();
            var random = new Random();
            var roomAssets = new List<RoomAsset>();

            foreach (var room in rooms)
            {
                var selectedAssets = assets.OrderBy(x => random.Next()).Take(4).ToList();
                foreach (var asset in selectedAssets)
                {
                    roomAssets.Add(new RoomAsset
                    {
                        RoomID = room.RoomID,
                        AssetID = asset.AssetID,
                        Quantity = random.Next(1, 6),
                        Description = "none"
                    });
                }
            }

            await _context.RoomAsset.AddRangeAsync(roomAssets);
            await _context.SaveChangesAsync();
        }

        public async Task SeedTenantsAsync()
        {
            if (_context.Tenant.Any()) return;

            for (int i = 1; i <= 66; i++)
            {
                var registerDto = new RegisterDTO
                {
                    UserName = $"tenant{i}",
                    Email = $"tenant{i}@mail.com",
                    PhoneNumber = $"01234567{i:D2}",
                    CCCD = $"{i:D12}",
                    FullName = $"Tenant {i}",
                    Password = "123456aA@"
                };

            }
        }

        public async Task SeedContractsForFirst22TenantsAsync()
        {
            var tenants = await _context.Tenant.OrderBy(t => t.Id).Take(22).ToListAsync();
            var rooms = await _context.Room
                .Include(r => r.Building)
                .Where(r => r.Status == ERoomStatus.Available)
                .Take(22)
                .ToListAsync();

            if (tenants.Count < 22 || rooms.Count < 22)
                throw new Exception("Not enough tenants or rooms to create 22 contracts");

            for (int i = 0; i < 22; i++)
            {
                var tenant = tenants[i];
                var room = rooms[i];

                var request = new CreateContractDTO
                {
                    CCCD = tenant.CCCD,
                    BuildingID = room.Building.BuildingID,
                    RoomNumber = room.RoomNumber,
                    Deposit = 1000000,
                    Price = room.Price,
                    StartDate = DateOnly.FromDateTime(DateTime.UtcNow),
                    EndDate = DateOnly.FromDateTime(DateTime.UtcNow.AddMonths(6))
                };

                var result = await _contractService.CreateContractAsync(request);
                if (result is BadRequestObjectResult bad)
                {
                    Console.WriteLine($"Failed to create contract for {tenant.FullName}: {bad.Value}");
                }
            }
        }
    }
}
