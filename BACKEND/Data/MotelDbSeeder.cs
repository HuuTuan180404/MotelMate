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
            var faker = new Faker("vi");

            // Seed Accounts
            if (!context.Account.Any())
            {
                var accountFaker = new Faker<Account>("vi")
                    .RuleFor(a => a.FullName, f => f.Name.FullName())
                    .RuleFor(a => a.CCCD, f => f.Random.Replace("############"))
                    .RuleFor(a => a.PhoneNumber, f => f.Phone.PhoneNumber("09########"))
                    .RuleFor(a => a.Email, f => f.Internet.Email())
                    .RuleFor(a => a.PasswordHash, f => BCrypt.Net.BCrypt.HashPassword("Password@123"))
                    .RuleFor(a => a.Status, f => EAccountStatus.Active)
                    .RuleFor(a => a.Bdate, f => DateOnly.FromDateTime(f.Date.Past(30, DateTime.Now.AddYears(-18))))
                    .RuleFor(a => a.URLAvatar, f => f.Internet.Avatar())
                    .RuleFor(a => a.CreateAt, f => f.Date.Past(2))
                    .RuleFor(a => a.UpdateAt, f => f.Date.Recent());

                var accounts = accountFaker.Generate(100);
                context.Account.AddRange(accounts);
                context.SaveChanges();
            }
            var accountIds = context.Account.Select(a => a.Id).ToList();

            // Seed Buildings
            if (!context.Building.Any())
            {
                var buildingFaker = new Faker<Building>("vi")
                    .RuleFor(b => b.Name, f => $"Tòa nhà {f.Random.AlphaNumeric(1)}")
                    .RuleFor(b => b.Address, f => f.Address.FullAddress())
                    .RuleFor(b => b.BuildingCode, f => f.Random.Replace("B##"))
                    .RuleFor(b => b.OwnerID, f => f.PickRandom(accountIds));

                var buildings = buildingFaker.Generate(10);
                context.Building.AddRange(buildings);
                context.SaveChanges();
            }
            var buildingIds = context.Building.Select(b => b.BuildingID).ToList();

            // Seed Rooms
            if (!context.Room.Any())
            {
                var roomFaker = new Faker<Room>("vi")
                    .RuleFor(r => r.BuildingID, f => f.PickRandom(buildingIds))
                    .RuleFor(r => r.RoomNumber, f => f.Random.Replace("A-###"))
                    .RuleFor(r => r.Area, f => f.Random.Double(20, 50))
                    .RuleFor(r => r.Price, f => f.Random.Decimal(2000000, 8000000))
                    .RuleFor(r => r.Status, f => f.PickRandom<ERoomStatus>())
                    .RuleFor(r => r.Description, f => f.Lorem.Sentence());

                var rooms = roomFaker.Generate(100);
                context.Room.AddRange(rooms);
                context.SaveChanges();
            }
            var roomIds = context.Room.Select(r => r.RoomID).ToList();

            // Seed Tenants
            if (!context.Tenant.Any())
            {
                var tenantFaker = new Faker<Tenant>("vi")
                    .RuleFor(t => t.FullName, f => f.Name.FullName())
                    .RuleFor(t => t.CCCD, f => f.Random.Replace("############"))
                    .RuleFor(t => t.Email, f => f.Internet.Email())
                    .RuleFor(t => t.PhoneNumber, f => f.Phone.PhoneNumber("09########"));

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

            // Seed Owner
            if (!context.Owner.Any())
            {
                var ownerFaker = new Faker<Owner>("vi")
                    .RuleFor(o => o.FullName, f => f.Name.FullName())
                    .RuleFor(o => o.PhoneNumber, f => f.Phone.PhoneNumber("09########"))
                    .RuleFor(t => t.CCCD, f => f.Random.Replace("############"))
                    .RuleFor(o => o.Email, f => f.Internet.Email());
                var owners = ownerFaker.Generate(10);
                context.Owner.AddRange(owners);
                context.SaveChanges();
            }

            // Seed AuditLog
            if (!context.AuditLog.Any())
            {
                var auditFaker = new Faker<AuditLog>("vi")
                    .RuleFor(a => a.Id, f => f.PickRandom(accountIds))
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
                for (int i = 0; i < 50; i++)
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
                for (int i = 0; i < 50; i++)
                {
                    roomImages.Add(new RoomImage
                    {
                        RoomID = roomIds[random.Next(roomIds.Count)],
                        ImageURL = $"https://picsum.photos/seed/{random.Next(1000)}/400/300"
                    });
                }
                context.RoomImage.AddRange(roomImages);
                context.SaveChanges();
            }
        }
    }
}