using BACKEND.Models;
using BACKEND.Enums;
using Bogus;
using BACKEND.Data;

namespace Backend.Data
{
    public static class MotelDbSeeder
    {
        public static void Seed(MotelMateDbContext context)
        {
            context.Database.EnsureCreated();

            List<string> avatarUrls = new List<string>
                {
                    "https://images.unsplash.com/photo-1502685104226-ee32379fefbe",
                    "https://images.pexels.com/photos/415071/pexels-photo-415071.jpeg",
                    "https://api.dicebear.com/9.x/pixel-art/svg?seed=David",
                    "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7",
                    "https://images.pexels.com/photos/834863/pexels-photo-834863.jpeg",
                    "https://api.dicebear.com/9.x/avataaars/svg?seed=Emma",
                    "https://images.unsplash.com/photo-1522552557455-0f9b42a4c1d3",
                    "https://images.pexels.com/photos/1542085/pexels-photo-1542085.jpeg",
                    "https://api.dicebear.com/9.x/bottts/svg?seed=Lucas",
                    "https://images.unsplash.com/photo-1532074205217-d0e1f4b87368",
                    "https://images.pexels.com/photos/1065084/pexels-photo-1065084.jpeg",
                    "https://api.dicebear.com/9.x/identicon/svg?seed=Olivia",
                    "https://images.unsplash.com/photo-1488161628813-04466f872be2",
                    "https://images.pexels.com/photos/1851164/pexels-photo-1851164.jpeg",
                    "https://api.dicebear.com/9.x/micah/svg?seed=James",
                    "https://images.unsplash.com/photo-1492106040403-4d27b8bd8a69",
                    "https://images.pexels.com/photos/1674752/pexels-photo-1674752.jpeg",
                    "https://api.dicebear.com/9.x/adventurer/svg?seed=Sophia",
                    "https://images.unsplash.com/photo-1519345182560-3f2917c472ef",
                    "https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg"
                };
            List<string> roomImageUrls = new List<string>
            {
    "https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg",
    "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg",
    "https://images.pexels.com/photos/279746/pexels-photo-279746.jpeg",
    "https://images.pexels.com/photos/262048/pexels-photo-262048.jpeg",
    "https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg",
    "https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg",
    "https://images.pexels.com/photos/271619/pexels-photo-271619.jpeg",
    "https://images.pexels.com/photos/269141/pexels-photo-269141.jpeg",
    "https://images.pexels.com/photos/275484/pexels-photo-275484.jpeg",
    "https://images.pexels.com/photos/2631746/pexels-photo-2631746.jpeg",
    "https://images.pexels.com/photos/2079246/pexels-photo-2079246.jpeg",
    "https://images.pexels.com/photos/2062426/pexels-photo-2062426.jpeg",
    "https://images.pexels.com/photos/2467285/pexels-photo-2467285.jpeg",
    "https://images.pexels.com/photos/2526965/pexels-photo-2526965.jpeg",
    "https://images.pexels.com/photos/259962/pexels-photo-259962.jpeg",
    "https://images.pexels.com/photos/206172/pexels-photo-206172.jpeg",
    "https://images.pexels.com/photos/2082087/pexels-photo-2082087.jpeg",
    "https://images.pexels.com/photos/2062427/pexels-photo-2062427.jpeg",
    "https://images.pexels.com/photos/2082247/pexels-photo-2082247.jpeg",
    "https://images.pexels.com/photos/439227/pexels-photo-439227.jpeg",
    "https://images.pexels.com/photos/1571459/pexels-photo-1571459.jpeg",
    "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg",
    "https://images.pexels.com/photos/1571463/pexels-photo-1571463.jpeg",
    "https://images.pexels.com/photos/1571468/pexels-photo-1571468.jpeg",
    "https://images.pexels.com/photos/1571470/pexels-photo-1571470.jpeg",
    "https://images.pexels.com/photos/1571471/pexels-photo-1571471.jpeg",
    "https://images.pexels.com/photos/1571472/pexels-photo-1571472.jpeg",
    "https://images.pexels.com/photos/1571473/pexels-photo-1571473.jpeg",
    "https://images.pexels.com/photos/1571474/pexels-photo-1571474.jpeg",
    "https://images.pexels.com/photos/1571475/pexels-photo-1571475.jpeg",
    "https://images.pexels.com/photos/1571476/pexels-photo-1571476.jpeg",
    "https://images.pexels.com/photos/1571477/pexels-photo-1571477.jpeg",
    "https://images.pexels.com/photos/1571478/pexels-photo-1571478.jpeg",
    "https://images.pexels.com/photos/1571479/pexels-photo-1571479.jpeg",
    "https://images.pexels.com/photos/1571480/pexels-photo-1571480.jpeg",
    "https://images.pexels.com/photos/1571481/pexels-photo-1571481.jpeg",
    "https://images.pexels.com/photos/1571482/pexels-photo-1571482.jpeg",
    "https://images.pexels.com/photos/1571483/pexels-photo-1571483.jpeg",
    "https://images.pexels.com/photos/1571484/pexels-photo-1571484.jpeg",
    "https://images.pexels.com/photos/1571485/pexels-photo-1571485.jpeg",
    "https://images.pexels.com/photos/1571486/pexels-photo-1571486.jpeg",
    "https://images.pexels.com/photos/1571487/pexels-photo-1571487.jpeg",
    "https://images.pexels.com/photos/1571488/pexels-photo-1571488.jpeg",
    "https://images.pexels.com/photos/1571489/pexels-photo-1571489.jpeg",
    "https://images.pexels.com/photos/1571490/pexels-photo-1571490.jpeg",
    "https://images.pexels.com/photos/1571491/pexels-photo-1571491.jpeg",
    "https://images.pexels.com/photos/1571492/pexels-photo-1571492.jpeg",
    "https://images.pexels.com/photos/1571493/pexels-photo-1571493.jpeg",
    "https://images.pexels.com/photos/1571494/pexels-photo-1571494.jpeg",
    "https://images.pexels.com/photos/1571495/pexels-photo-1571495.jpeg",
    "https://images.pexels.com/photos/1571496/pexels-photo-1571496.jpeg",
    "https://images.pexels.com/photos/1571497/pexels-photo-1571497.jpeg",
    "https://images.pexels.com/photos/1571498/pexels-photo-1571498.jpeg",
    "https://images.pexels.com/photos/1571499/pexels-photo-1571499.jpeg",
    "https://images.pexels.com/photos/1571500/pexels-photo-1571500.jpeg",
    "https://images.pexels.com/photos/1571501/pexels-photo-1571501.jpeg",
    "https://images.pexels.com/photos/1571502/pexels-photo-1571502.jpeg",
    "https://images.pexels.com/photos/1571503/pexels-photo-1571503.jpeg",
    "https://images.pexels.com/photos/1571504/pexels-photo-1571504.jpeg",
    "https://images.pexels.com/photos/1571505/pexels-photo-1571505.jpeg",
    "https://images.pexels.com/photos/1571506/pexels-photo-1571506.jpeg",
    "https://images.pexels.com/photos/1571507/pexels-photo-1571507.jpeg",
    "https://images.pexels.com/photos/1571508/pexels-photo-1571508.jpeg",
    "https://images.pexels.com/photos/1571509/pexels-photo-1571509.jpeg",
    "https://images.pexels.com/photos/1571510/pexels-photo-1571510.jpeg",
    "https://images.pexels.com/photos/1571511/pexels-photo-1571511.jpeg",
    "https://images.pexels.com/photos/1571512/pexels-photo-1571512.jpeg",
    "https://images.pexels.com/photos/1571513/pexels-photo-1571513.jpeg",
    "https://images.pexels.com/photos/1571514/pexels-photo-1571514.jpeg",
    "https://images.pexels.com/photos/1571515/pexels-photo-1571515.jpeg",
    "https://images.pexels.com/photos/1571516/pexels-photo-1571516.jpeg",
    "https://images.pexels.com/photos/1571517/pexels-photo-1571517.jpeg",
    "https://images.pexels.com/photos/1571518/pexels-photo-1571518.jpeg",
    "https://images.pexels.com/photos/1571519/pexels-photo-1571519.jpeg",
    "https://images.pexels.com/photos/1571520/pexels-photo-1571520.jpeg",
    "https://images.pexels.com/photos/1571521/pexels-photo-1571521.jpeg",
    "https://images.pexels.com/photos/1571522/pexels-photo-1571522.jpeg",
    "https://images.pexels.com/photos/1571523/pexels-photo-1571523.jpeg",
    "https://images.pexels.com/photos/1571524/pexels-photo-1571524.jpeg",
    "https://images.pexels.com/photos/1571525/pexels-photo-1571525.jpeg",
    "https://images.pexels.com/photos/1571526/pexels-photo-1571526.jpeg",
    "https://images.pexels.com/photos/1571527/pexels-photo-1571527.jpeg",
    "https://images.pexels.com/photos/1571528/pexels-photo-1571528.jpeg",
    "https://images.pexels.com/photos/1571529/pexels-photo-1571529.jpeg",
    "https://images.pexels.com/photos/1571530/pexels-photo-1571530.jpeg",
    "https://images.pexels.com/photos/1571531/pexels-photo-1571531.jpeg",
    "https://images.pexels.com/photos/1571532/pexels-photo-1571532.jpeg",
    "https://images.pexels.com/photos/1571533/pexels-photo-1571533.jpeg",
    "https://images.pexels.com/photos/1571534/pexels-photo-1571534.jpeg",
    "https://images.pexels.com/photos/1571535/pexels-photo-1571535.jpeg",
    "https://images.pexels.com/photos/1571536/pexels-photo-1571536.jpeg",
    "https://images.pexels.com/photos/1571537/pexels-photo-1571537.jpeg",
    "https://images.pexels.com/photos/1571538/pexels-photo-1571538.jpeg",
    "https://images.pexels.com/photos/1571539/pexels-photo-1571539.jpeg",
    "https://images.pexels.com/photos/1571540/pexels-photo-1571540.jpeg",
    "https://images.pexels.com/photos/1571541/pexels-photo-1571541.jpeg",
    "https://images.pexels.com/photos/1571542/pexels-photo-1571542.jpeg",
    "https://images.pexels.com/photos/1571543/pexels-photo-1571543.jpeg",
    "https://images.pexels.com/photos/1571544/pexels-photo-1571544.jpeg"
            };

            // Seed Owner
            if (!context.Owner.Any())
            {
                var ownerFaker = new Faker<Owner>("vi")
                    .RuleFor(a => a.PhoneNumber, f => f.Phone.PhoneNumber("09########"))
                    .RuleFor(a => a.Email, f => f.Internet.Email())
                    .RuleFor(a => a.PasswordHash, f => BCrypt.Net.BCrypt.HashPassword("Password@123"))

                    .RuleFor(a => a.CCCD, f => f.Random.Replace("############"))
                    .RuleFor(a => a.FullName, f => f.Name.FullName())
                    .RuleFor(a => a.Bdate, f => DateOnly.FromDateTime(f.Date.Past(30, DateTime.Now.AddYears(-18))))
                    .RuleFor(a => a.Status, f => EAccountStatus.Active)
                    .RuleFor(a => a.URLAvatar, f => f.PickRandom(avatarUrls))
                    .RuleFor(a => a.CreateAt, f => f.Date.Past(2))
                    .RuleFor(a => a.UpdateAt, f => f.Date.Recent())

                    .RuleFor(a => a.AccountNo, f => 123456789)
                    .RuleFor(a => a.AccountName, f => "ACCOUNT BANK NAME")
                    .RuleFor(a => a.AccountNo, f => 1234);


                var owners = ownerFaker.Generate(30);
                context.Owner.AddRange(owners);
                context.SaveChanges();
            }
            var ownerIds = context.Owner.Select(t => t.Id).ToList();


            // Seed Buildings
            if (!context.Building.Any())
            {
                var buildingFaker = new Faker<Building>("vi")
                    .RuleFor(b => b.Name, f => $"Tòa nhà {f.Random.AlphaNumeric(1)}")
                    .RuleFor(b => b.Address, f => f.Address.FullAddress())
                    .RuleFor(b => b.BuildingCode, f => f.Random.Replace("B##"))
                    .RuleFor(b => b.OwnerID, f => f.PickRandom(ownerIds));

                var buildings = buildingFaker.Generate(10);
                context.Building.AddRange(buildings);
                context.SaveChanges();
            }
            var buildingIds = context.Building.Select(b => b.BuildingID).ToList();

            // Seed Rooms
            if (!context.Room.Any())
            {
                var roomFaker = new Faker<Room>("vi")
                    .RuleFor(r => r.RoomNumber, f => f.Random.Replace("A-###"))
                    .RuleFor(r => r.Area, f => f.Random.Double(20, 50))
                    .RuleFor(r => r.Price, f => f.Random.Decimal(2000000, 8000000))
                    .RuleFor(r => r.Status, f => f.PickRandom<ERoomStatus>())
                    .RuleFor(r => r.Description, f => f.Lorem.Sentence())
                    .RuleFor(r => r.BuildingID, f => f.PickRandom(buildingIds));

                var rooms = roomFaker.Generate(100);
                context.Room.AddRange(rooms);
                context.SaveChanges();
            }
            var roomIds = context.Room.Select(r => r.RoomID).ToList();

            // Seed Tenants
            if (!context.Tenant.Any())
            {
                var tenantFaker = new Faker<Tenant>("vi")
                    .RuleFor(a => a.CCCD, f => f.Random.Replace("############"))
                    .RuleFor(a => a.FullName, f => f.Name.FullName())
                    .RuleFor(a => a.Bdate, f => DateOnly.FromDateTime(f.Date.Past(30, DateTime.Now.AddYears(-18))))
                    .RuleFor(a => a.Status, f => EAccountStatus.Active)
                    .RuleFor(a => a.URLAvatar, f => f.PickRandom(avatarUrls))
                    .RuleFor(a => a.CreateAt, f => f.Date.Past(2))
                    .RuleFor(a => a.UpdateAt, f => f.Date.Recent())
                    .RuleFor(a => a.PhoneNumber, f => f.Phone.PhoneNumber("09########"))
                    .RuleFor(a => a.Email, f => f.Internet.Email())
                    .RuleFor(a => a.PasswordHash, f => BCrypt.Net.BCrypt.HashPassword("Password@123"));

                var tenants = tenantFaker.Generate(100);
                context.Tenant.AddRange(tenants);
                context.SaveChanges();
            }
            var tenantIds = context.Tenant.Select(t => t.Id).ToList();

            // Seed Services
            if (!context.Services.Any())
            {
                var serviceFaker = new Faker<Service>("vi")
                    .RuleFor(s => s.Name, f => f.Random.ArrayElement(new[] { "Điện", "Nước", "Internet", "Vệ sinh", "Bảo vệ", "Giữ xe" }))
                    .RuleFor(s => s.Unit, f => f.Random.ArrayElement(new[] { "kWh", "m³", "tháng", "người" }))
                    .RuleFor(s => s.CustomerPrice, f => f.Random.Decimal(50000, 500000))
                    .RuleFor(s => s.InitialPrice, f => f.Random.Decimal(40000, 450000))
                    .RuleFor(s => s.IsTiered, f => f.Random.Bool());

                var services = serviceFaker.Generate(6);
                context.Services.AddRange(services);
                context.SaveChanges();
            }
            var serviceIds = context.Services.Select(s => s.ServiceID).ToList();

            // Seed ServiceTiers
            if (!context.ServiceTiers.Any())
            {
                var electricityServiceId = context.Services.FirstOrDefault(s => s.Name == "Điện")?.ServiceID;
                var waterServiceId = context.Services.FirstOrDefault(s => s.Name == "Nước")?.ServiceID;

                var serviceTiers = new List<ServiceTier>();

                if (electricityServiceId != null)
                {
                    serviceTiers.AddRange(new[]
                    {
                        new ServiceTier { ServiceID = electricityServiceId.Value, FromQuantity = 0, ToQuantity = 50, GovUnitPrice = 1500 },
                        new ServiceTier { ServiceID = electricityServiceId.Value, FromQuantity = 51, ToQuantity = 100, GovUnitPrice = 2000 },
                        new ServiceTier { ServiceID = electricityServiceId.Value, FromQuantity = 101, ToQuantity = 99999, GovUnitPrice = 3000 },
                    });
                }

                if (waterServiceId != null)
                {
                    serviceTiers.AddRange(new[]
                    {
                        new ServiceTier { ServiceID = waterServiceId.Value, FromQuantity = 0, ToQuantity = 10, GovUnitPrice = 5000 },
                        new ServiceTier { ServiceID = waterServiceId.Value, FromQuantity = 11, ToQuantity = 30, GovUnitPrice = 7000 },
                        new ServiceTier { ServiceID = waterServiceId.Value, FromQuantity = 31, ToQuantity = 99999, GovUnitPrice = 10000 },
                    });
                }

                context.ServiceTiers.AddRange(serviceTiers);
                context.SaveChanges();
            }

            // Seed Contracts
            if (!context.Contract.Any())
            {
                var contractFaker = new Faker<Contract>("vi")
                    .RuleFor(c => c.RoomID, f => f.PickRandom(roomIds))
                    .RuleFor(c => c.StartDate, f => DateOnly.FromDateTime(f.Date.Past(1)))
                    .RuleFor(c => c.EndDate, f => DateOnly.FromDateTime(f.Date.Future(1)))
                    .RuleFor(c => c.Price, f => f.Random.Decimal(3000000, 10000000))
                    .RuleFor(c => c.Deposit, f => f.Random.Decimal(5000000, 20000000))
                    .RuleFor(c => c.Status, f => f.PickRandom<EContractStatus>())
                    .RuleFor(c => c.Description, f => f.Lorem.Sentence());

                var contracts = contractFaker.Generate(100);
                context.Contract.AddRange(contracts);
                context.SaveChanges();
            }
            var contractIds = context.Contract.Select(c => c.ContractID).ToList();

            // Seed Assets
            if (!context.Asset.Any())
            {
                var assetFaker = new Faker<Asset>("vi")
                    .RuleFor(a => a.Name, f => f.Commerce.ProductName())
                    .RuleFor(a => a.Price, f => f.Random.Decimal(500000, 10000000))
                    .RuleFor(a => a.Type, f => f.PickRandom<EAssetType>())
                    .RuleFor(a => a.Description, f => f.Lorem.Sentence());

                var assets = assetFaker.Generate(100);
                context.Asset.AddRange(assets);
                context.SaveChanges();
            }

            // Seed Invoices and InvoiceDetails
            if (!context.Invoice.Any())
            {
                var invoiceFaker = new Faker<Invoice>("vi")
                    .RuleFor(i => i.ContractID, f => f.PickRandom(contractIds))
                    .RuleFor(i => i.InvoiceCode, f => f.Random.Replace("INV-###"))
                    .RuleFor(i => i.ExtraCosts, f => f.PickRandom(contractIds))
                    .RuleFor(i => i.CreateAt, f => f.Date.Recent())
                    .RuleFor(i => i.PeriodStart, f => DateOnly.FromDateTime(f.Date.Past(1)))
                    .RuleFor(i => i.PeriodEnd, f => DateOnly.FromDateTime(f.Date.Recent()))
                    .RuleFor(i => i.TotalAmount, f => f.Random.Decimal(1000000, 5000000))
                    .RuleFor(i => i.Status, f => f.PickRandom<EInvoiceStatus>());

                var invoices = invoiceFaker.Generate(100);
                context.Invoice.AddRange(invoices);
                context.SaveChanges();
            }

            var invoiceIds = context.Invoice.Select(inv => inv.InvoiceID).ToList();
            //Seed InvoiceDetails
            if (!context.InvoiceDetails.Any())
            {
                var invoiceDetails = new List<InvoiceDetail>();
                var usedPairs = new HashSet<string>(); // Để theo dõi các cặp đã sử dụng

                var random = new Random();

                int invoiceDetailCount = invoiceIds.Count * serviceIds.Count;

                if (invoiceDetailCount > 100)
                {
                    invoiceDetailCount = 100;
                }

                for (int i = 0; i < invoiceDetailCount; i++)
                {
                    int invoiceId = invoiceIds[random.Next(invoiceIds.Count)];
                    int serviceId = serviceIds[random.Next(serviceIds.Count)];
                    string pair = $"{invoiceId}_{serviceId}";

                    // Nếu cặp này đã tồn tại, thử lại
                    if (usedPairs.Contains(pair))
                    {
                        i--; // Giảm bộ đếm để thử lại
                        continue;
                    }

                    usedPairs.Add(pair);

                    var detail = new InvoiceDetail
                    {
                        InvoiceID = invoiceId,
                        ServiceID = serviceId,
                        Quantity = random.Next(1, 100),
                        Price = random.Next(50000, 1000000)
                    };

                    invoiceDetails.Add(detail);
                }
                context.InvoiceDetails.AddRange(invoiceDetails);
                context.SaveChanges();
            }

            // Seed AuditLog
            if (!context.AuditLog.Any())
            {
                var auditFaker = new Faker<AuditLog>("vi")
                    .RuleFor(a => a.Id, f => f.PickRandom(ownerIds))
                    .RuleFor(a => a.Action, f => EAuditLogAction.CREATE)
                    .RuleFor(a => a.Timestamp, f => f.Date.Recent())
                    .RuleFor(a => a.TableName, f => f.Random.Word())
                    .RuleFor(a => a.OldValue, f => f.Lorem.Word())
                    .RuleFor(a => a.NewValue, f => f.Lorem.Word());
                var audits = auditFaker.Generate(20);
                context.AuditLog.AddRange(audits);
                context.SaveChanges();
            }

            // Seed Noti
            if (!context.Noti.Any())
            {
                var notiFaker = new Faker<Noti>("vi")
                    .RuleFor(n => n.Title, f => f.Lorem.Sentence())
                    .RuleFor(n => n.Content, f => f.Lorem.Paragraph())
                    .RuleFor(n => n.CreateAt, f => f.Date.Recent());
                var notis = notiFaker.Generate(20);
                context.Noti.AddRange(notis);
                context.SaveChanges();
            }

            // Seed NotiRecipient
            if (!context.NotiRecipient.Any())
            {
                var notiIds = context.Noti.Select(n => n.NotiID).ToList();
                var notiRecipients = new List<NotiRecipient>();
                var random = new Random();
                for (int i = 0; i < 20; i++)
                {
                    notiRecipients.Add(new NotiRecipient
                    {
                        NotiID = notiIds[random.Next(notiIds.Count)],
                        TenantID = tenantIds[random.Next(tenantIds.Count)]
                    });
                }
                context.NotiRecipient.AddRange(notiRecipients);
                context.SaveChanges();
            }

            // Seed RoomAsset
            if (!context.RoomAsset.Any())
            {
                var assetIds = context.Asset.Select(a => a.AssetID).ToList();
                var roomAssets = new List<RoomAsset>();
                var random = new Random();
                for (int i = 0; i < 450; i++)
                {
                    roomAssets.Add(new RoomAsset
                    {
                        AssetID = assetIds[random.Next(assetIds.Count)],
                        RoomID = roomIds[random.Next(roomIds.Count)]
                    });
                }
                context.RoomAsset.AddRange(roomAssets);
                context.SaveChanges();
            }

            // Seed RoomImage
            if (!context.RoomImage.Any())
            {
                var roomImages = new List<RoomImage>();
                var random = new Random();
                for (int i = 0; i < 180; i++)
                {
                    roomImages.Add(new RoomImage
                    {
                        RoomID = roomIds[random.Next(roomIds.Count)],
                        ImageURL = roomImageUrls[random.Next(roomImageUrls.Count)]
                    });
                }
                context.RoomImage.AddRange(roomImages);
                context.SaveChanges();
            }
        }
    }
}