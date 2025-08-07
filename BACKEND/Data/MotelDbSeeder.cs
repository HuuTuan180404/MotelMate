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
            // await SeedBuildingsAsync();
            // await SeedRoomsAsync();
            // await SeedAssetsAsync();
            // await SeedRoomAssetsAsync();
            // await SeedTenantsAsync();
            // await SeedContractsForFirst22TenantsAsync();

            await SeedAvatarUsersAsync();
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

        public async Task SeedAvatarUsersAsync()
        {
            // if (_context.Tenant.Any()) return;

            List<string> avatarImages = new List<string>{
    // Professional Men Avatars
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face&q=80",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face&q=80",
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face&q=80",
    "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop&crop=face&q=80",
    "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop&crop=face&q=80",
    "https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=400&h=400&fit=crop&crop=face&q=80",
    "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=400&h=400&fit=crop&crop=face&q=80",
    "https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?w=400&h=400&fit=crop&crop=face&q=80",
    "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop&crop=face&q=80",
    "https://images.unsplash.com/photo-1566492031773-4f4e44671d66?w=400&h=400&fit=crop&crop=face&q=80",
    
    // Professional Women Avatars
    "https://images.unsplash.com/photo-1494790108755-2616c27b1e4d?w=400&h=400&fit=crop&crop=face&q=80",
    "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face&q=80",
    "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&h=400&fit=crop&crop=face&q=80",
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&crop=face&q=80",
    "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=face&q=80",
    "https://images.unsplash.com/photo-1484863137639-abc5b97c5dee?w=400&h=400&fit=crop&crop=face&q=80",
    "https://images.unsplash.com/photo-1562788869-4ed32648eb72?w=400&h=400&fit=crop&crop=face&q=80",
    "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=400&h=400&fit=crop&crop=face&q=80",
    "https://images.unsplash.com/photo-1548142813-c348350df52b?w=400&h=400&fit=crop&crop=face&q=80",
    "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop&crop=face&q=80",
    
    // Young Men Avatars
    "https://images.unsplash.com/photo-1522075469751-3847faf86d40?w=400&h=400&fit=crop&crop=face&q=80",
    "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=400&h=400&fit=crop&crop=face&q=80",
    "https://images.unsplash.com/photo-1524250502761-1ac6f2e30d43?w=400&h=400&fit=crop&crop=face&q=80",
    "https://images.unsplash.com/photo-1558203728-00f45181dd84?w=400&h=400&fit=crop&crop=face&q=80",
    "https://images.unsplash.com/photo-1595152772835-219674b2a8a6?w=400&h=400&fit=crop&crop=face&q=80",
    "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=400&h=400&fit=crop&crop=face&q=80",
    "https://images.unsplash.com/photo-1517070208541-6ddc4d3b8d21?w=400&h=400&fit=crop&crop=face&q=80",
    "https://images.unsplash.com/photo-1516914943479-89db7d9ae7f2?w=400&h=400&fit=crop&crop=face&q=80",
    "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=400&h=400&fit=crop&crop=face&q=80",
    "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=400&h=400&fit=crop&crop=face&q=80",
    
    // Young Women Avatars
    "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=400&fit=crop&crop=face&q=80",
    "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=400&fit=crop&crop=face&q=80",
    "https://images.unsplash.com/photo-1541747157478-57d65d3283f8?w=400&h=400&fit=crop&crop=face&q=80",
    "https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?w=400&h=400&fit=crop&crop=face&q=80",
    "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=400&h=400&fit=crop&crop=face&q=80",
    "https://images.unsplash.com/photo-1500048993953-d23a436266cf?w=400&h=400&fit=crop&crop=face&q=80",
    "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&h=400&fit=crop&crop=face&q=80",
    "https://images.unsplash.com/photo-1527203561188-dae1bc1a417f?w=400&h=400&fit=crop&crop=face&q=80",
    "https://images.unsplash.com/photo-1560087637-bf797bc7796a?w=400&h=400&fit=crop&crop=face&q=80",
    "https://images.unsplash.com/photo-1512310604669-443f26c35f52?w=400&h=400&fit=crop&crop=face&q=80",
    
    // Casual Men Avatars
    "https://images.unsplash.com/photo-1546456073-92b9f0a8d413?w=400&h=400&fit=crop&crop=face&q=80",
    "https://images.unsplash.com/photo-1463453091185-61582044d556?w=400&h=400&fit=crop&crop=face&q=80",
    "https://images.unsplash.com/photo-1521119989659-a83eee488004?w=400&h=400&fit=crop&crop=face&q=80",
    "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=400&h=400&fit=crop&crop=face&q=80",
    "https://images.unsplash.com/photo-1474176857210-7287d38d27c6?w=400&h=400&fit=crop&crop=face&q=80",
    "https://images.unsplash.com/photo-1557862921-37829c790f19?w=400&h=400&fit=crop&crop=face&q=80",
    "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=400&h=400&fit=crop&crop=face&q=80",
    "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop&crop=face&q=80",
    "https://images.unsplash.com/photo-1558222218-b7b54eede3f3?w=400&h=400&fit=crop&crop=face&q=80",
    "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop&crop=face&q=80",
    
    // Casual Women Avatars
    "https://images.unsplash.com/photo-1509967419530-da38b4704bc6?w=400&h=400&fit=crop&crop=face&q=80",
    "https://images.unsplash.com/photo-1619895862022-09114b41f16f?w=400&h=400&fit=crop&crop=face&q=80",
    "https://images.unsplash.com/photo-1592621385612-4d7129426394?w=400&h=400&fit=crop&crop=face&q=80",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face&q=80",
    "https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=400&h=400&fit=crop&crop=face&q=80",
    "https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?w=400&h=400&fit=crop&crop=face&q=80",
    "https://images.unsplash.com/photo-1581824204773-bdb6e73e4ddb?w=400&h=400&fit=crop&crop=face&q=80",
    "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=400&fit=crop&crop=face&q=80",
    "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=400&h=400&fit=crop&crop=face&q=80",
    "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=400&h=400&fit=crop&crop=face&q=80",
    
    // International Men Avatars
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face&q=80",
    "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=400&h=400&fit=crop&crop=face&q=80",
    "https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?w=400&h=400&fit=crop&crop=face&q=80",
    "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=400&fit=crop&crop=face&q=80",
    "https://images.unsplash.com/photo-1570158268183-d296b2892211?w=400&h=400&fit=crop&crop=face&q=80",
    "https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=400&h=400&fit=crop&crop=face&q=80",
    "https://images.unsplash.com/photo-1589571894960-20bbe2828d0a?w=400&h=400&fit=crop&crop=face&q=80",
    "https://images.unsplash.com/photo-1601455763557-db1bea8a9a5a?w=400&h=400&fit=crop&crop=face&q=80",
    "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop&crop=face&q=80",
    
    // International Women Avatars  
    "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=400&h=400&fit=crop&crop=face&q=80",
    "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop&crop=face&q=80",
    "https://images.unsplash.com/photo-1602233158242-3ba0ac4d2167?w=400&h=400&fit=crop&crop=face&q=80",
    "https://images.unsplash.com/photo-1616784045256-2adbb1b8af8e?w=400&h=400&fit=crop&crop=face&q=80",
    "https://images.unsplash.com/photo-1614204424926-196a80bf0be8?w=400&h=400&fit=crop&crop=face&q=80",
    "https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?w=400&h=400&fit=crop&crop=face&q=80",
    "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=400&h=400&fit=crop&crop=face&q=80",
    "https://images.unsplash.com/photo-1485893086445-ed75865251e0?w=400&h=400&fit=crop&crop=face&q=80",
    "https://images.unsplash.com/photo-1619895862022-09114b41f16f?w=400&h=400&fit=crop&crop=face&q=80"
              };

            int temp = 0;

            foreach (var user in _context.Account.ToList())
            {
                user.URLAvatar = avatarImages[temp++];
            }

            await _context.SaveChangesAsync();
        }
    }
}
