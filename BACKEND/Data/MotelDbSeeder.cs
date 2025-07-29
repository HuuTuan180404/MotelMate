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
                    "https://images.pexels.com/photos/415071/pexels-photo-415071.jpeg",
                    "https://images.pexels.com/photos/834863/pexels-photo-834863.jpeg",
                    "https://images.pexels.com/photos/1542085/pexels-photo-1542085.jpeg",
                    "https://images.pexels.com/photos/1065084/pexels-photo-1065084.jpeg",
                    "https://images.pexels.com/photos/1851164/pexels-photo-1851164.jpeg",
                    "https://images.pexels.com/photos/1674752/pexels-photo-1674752.jpeg",
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
    "https://images.pexels.com/photos/259962/pexels-photo-259962.jpeg",
    "https://images.pexels.com/photos/206172/pexels-photo-206172.jpeg",
    "https://images.pexels.com/photos/2082087/pexels-photo-2082087.jpeg",
    "https://images.pexels.com/photos/2062427/pexels-photo-2062427.jpeg",
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
    "https://images.pexels.com/photos/1571486/pexels-photo-1571486.jpeg",
    "https://images.pexels.com/photos/1571487/pexels-photo-1571487.jpeg",
    "https://images.pexels.com/photos/1571488/pexels-photo-1571488.jpeg",
    "https://images.pexels.com/photos/1571489/pexels-photo-1571489.jpeg",
    "https://images.pexels.com/photos/1571490/pexels-photo-1571490.jpeg",
    "https://images.pexels.com/photos/1571491/pexels-photo-1571491.jpeg",
    "https://images.pexels.com/photos/1571492/pexels-photo-1571492.jpeg",
    "https://images.pexels.com/photos/1571493/pexels-photo-1571493.jpeg",
    "https://images.pexels.com/photos/1571502/pexels-photo-1571502.jpeg",
    "https://images.pexels.com/photos/1571503/pexels-photo-1571503.jpeg",
    "https://images.pexels.com/photos/1571504/pexels-photo-1571504.jpeg",
    "https://images.pexels.com/photos/1571506/pexels-photo-1571506.jpeg",
    "https://images.pexels.com/photos/1571510/pexels-photo-1571510.jpeg",
    "https://images.pexels.com/photos/1571514/pexels-photo-1571514.jpeg",
    "https://images.pexels.com/photos/1571517/pexels-photo-1571517.jpeg",
    "https://images.pexels.com/photos/1571522/pexels-photo-1571522.jpeg",
    "https://images.pexels.com/photos/1571524/pexels-photo-1571524.jpeg",
    "https://images.pexels.com/photos/1571529/pexels-photo-1571529.jpeg",
    "https://images.pexels.com/photos/1571532/pexels-photo-1571532.jpeg",
    "https://images.pexels.com/photos/1571533/pexels-photo-1571533.jpeg",
    "https://images.pexels.com/photos/1571536/pexels-photo-1571536.jpeg",
            };

            // Seed Owner
            // if (!context.Owner.Any())
            // {
            //     var ownerFaker = new Faker<Owner>("vi")
            //         .RuleFor(a => a.PhoneNumber, f => f.Phone.PhoneNumber("09########"))
            //         .RuleFor(a => a.Email, f => f.Internet.Email())
            //         .RuleFor(a => a.PasswordHash, f => BCrypt.Net.BCrypt.HashPassword("Password@123"))

            //         .RuleFor(a => a.CCCD, f => f.Random.Replace("############"))
            //         .RuleFor(a => a.FullName, f => f.Name.FullName())
            //         .RuleFor(a => a.Bdate, f => DateOnly.FromDateTime(f.Date.Past(30, DateTime.Now.AddYears(-18))))
            //         .RuleFor(a => a.Status, f => EAccountStatus.Active)
            //         .RuleFor(a => a.URLAvatar, f => f.PickRandom(avatarUrls))
            //         .RuleFor(a => a.CreateAt, f => f.Date.Past(2))
            //         .RuleFor(a => a.UpdateAt, f => f.Date.Recent())

            //         .RuleFor(a => a.AccountNo, f => 123456789)
            //         .RuleFor(a => a.AccountName, f => "ACCOUNT BANK NAME")
            //         .RuleFor(a => a.AccountNo, f => 1234);


            //     var owners = ownerFaker.Generate(30);
            //     context.Owner.AddRange(owners);
            //     context.SaveChanges();
            // }
            var ownerIds = context.Owner.Select(t => t.Id).ToList();

            // Seed Buildings
            // if (!context.Building.Any())
            // {
            //     var buildingFaker = new Faker<Building>("vi")
            //         .RuleFor(b => b.Name, f => $"Tòa nhà {f.Random.AlphaNumeric(1)}")
            //         .RuleFor(b => b.Address, f => f.Address.FullAddress())
            //         .RuleFor(b => b.BuildingCode, f => f.Random.Replace("B##"))
            //         .RuleFor(b => b.OwnerID, f => f.PickRandom(ownerIds));

            //     var buildings = buildingFaker.Generate(10);
            //     context.Building.AddRange(buildings);
            //     context.SaveChanges();
            // }
            var buildingIds = context.Building.Select(b => b.BuildingID).ToList();

            // Seed Rooms
            // if (!context.Room.Any())
            // {
            //     var roomFaker = new Faker<Room>("vi")
            //         .RuleFor(r => r.RoomNumber, f => f.Random.Replace("A-###"))
            //         .RuleFor(r => r.Area, f => f.Random.Double(20, 50))
            //         .RuleFor(r => r.Price, f => f.Random.Decimal(2000000, 8000000))
            //         .RuleFor(r => r.Status, f => f.PickRandom<ERoomStatus>())
            //         .RuleFor(r => r.Description, f => f.Lorem.Sentence())
            //         .RuleFor(r => r.BuildingID, f => f.PickRandom(buildingIds));

            //     var rooms = roomFaker.Generate(100);
            //     context.Room.AddRange(rooms);
            //     context.SaveChanges();
            // }
            var roomIds = context.Room.Select(r => r.RoomID).ToList();

            // Seed Tenants
            // if (!context.Tenant.Any())
            // {
            //     var tenantFaker = new Faker<Tenant>("vi")
            //         .RuleFor(a => a.CCCD, f => f.Random.Replace("############"))
            //         .RuleFor(a => a.FullName, f => f.Name.FullName())
            //         .RuleFor(a => a.Bdate, f => DateOnly.FromDateTime(f.Date.Past(30, DateTime.Now.AddYears(-18))))
            //         .RuleFor(a => a.Status, f => EAccountStatus.Active)
            //         .RuleFor(a => a.URLAvatar, f => f.PickRandom(avatarUrls))
            //         .RuleFor(a => a.CreateAt, f => f.Date.Past(2))
            //         .RuleFor(a => a.UpdateAt, f => f.Date.Recent())
            //         .RuleFor(a => a.PhoneNumber, f => f.Phone.PhoneNumber("09########"))
            //         .RuleFor(a => a.Email, f => f.Internet.Email())
            //         .RuleFor(a => a.PasswordHash, f => BCrypt.Net.BCrypt.HashPassword("Password@123"));

            //     var tenants = tenantFaker.Generate(100);
            //     context.Tenant.AddRange(tenants);
            //     context.SaveChanges();
            // }
            var tenantIds = context.Tenant.Select(t => t.Id).ToList();

            // Seed Services
            // if (!context.Services.Any())
            // {
            //     var serviceFaker = new Faker<Service>("vi")
            //         .RuleFor(s => s.Name, f => f.Random.ArrayElement(new[] { "Điện", "Nước", "Internet", "Vệ sinh", "Bảo vệ", "Giữ xe" }))
            //         .RuleFor(s => s.Unit, f => f.Random.ArrayElement(new[] { "kWh", "m³", "tháng", "người" }))
            //         .RuleFor(s => s.CustomerPrice, f => f.Random.Decimal(50000, 500000))
            //         .RuleFor(s => s.InitialPrice, f => f.Random.Decimal(40000, 450000))
            //         .RuleFor(s => s.IsTiered, f => f.Random.Bool());

            //     var services = serviceFaker.Generate(6);
            //     context.Services.AddRange(services);
            //     context.SaveChanges();
            // }
            var serviceIds = context.Services.Select(s => s.ServiceID).ToList();

            // Seed ServiceTiers
            // if (!context.ServiceTiers.Any())
            // {
            //     var electricityServiceId = context.Services.FirstOrDefault(s => s.Name == "Điện")?.ServiceID;
            //     var waterServiceId = context.Services.FirstOrDefault(s => s.Name == "Nước")?.ServiceID;

            //     var serviceTiers = new List<ServiceTier>();

            //     if (electricityServiceId != null)
            //     {
            //         serviceTiers.AddRange(new[]
            //         {
            //             new ServiceTier { ServiceID = electricityServiceId.Value, FromQuantity = 0, ToQuantity = 50, GovUnitPrice = 1500 },
            //             new ServiceTier { ServiceID = electricityServiceId.Value, FromQuantity = 51, ToQuantity = 100, GovUnitPrice = 2000 },
            //             new ServiceTier { ServiceID = electricityServiceId.Value, FromQuantity = 101, ToQuantity = 99999, GovUnitPrice = 3000 },
            //         });
            //     }

            //     if (waterServiceId != null)
            //     {
            //         serviceTiers.AddRange(new[]
            //         {
            //             new ServiceTier { ServiceID = waterServiceId.Value, FromQuantity = 0, ToQuantity = 10, GovUnitPrice = 5000 },
            //             new ServiceTier { ServiceID = waterServiceId.Value, FromQuantity = 11, ToQuantity = 30, GovUnitPrice = 7000 },
            //             new ServiceTier { ServiceID = waterServiceId.Value, FromQuantity = 31, ToQuantity = 99999, GovUnitPrice = 10000 },
            //         });
            //     }

            //     context.ServiceTiers.AddRange(serviceTiers);
            //     context.SaveChanges();
            // }

            // Seed Contracts
            // if (!context.Contract.Any())
            // {
            //     var contractFaker = new Faker<Contract>("vi")
            //         .RuleFor(c => c.RoomID, f => f.PickRandom(roomIds))
            //         .RuleFor(c => c.StartDate, f => DateOnly.FromDateTime(f.Date.Past(1)))
            //         .RuleFor(c => c.EndDate, f => DateOnly.FromDateTime(f.Date.Future(1)))
            //         .RuleFor(c => c.Price, f => f.Random.Decimal(3000000, 10000000))
            //         .RuleFor(c => c.Deposit, f => f.Random.Decimal(5000000, 20000000))
            //         .RuleFor(c => c.Status, f => f.PickRandom<EContractStatus>())
            //         .RuleFor(c => c.Description, f => f.Lorem.Sentence());

            //     var contracts = contractFaker.Generate(100);
            //     context.Contract.AddRange(contracts);
            //     context.SaveChanges();
            // }
            var contractIds = context.Contract.Select(c => c.ContractID).ToList();


            // Seed ContractDetail
            // if (!context.ContractDetail.Any())
            // {
            //     var contractDetailFaker = new Faker<ContractDetail>("vi")
            //         .RuleFor(c => c.ContractID, f => f.PickRandom(contractIds))
            //         .RuleFor(c => c.TenantID, f => f.PickRandom(tenantIds))
            //         .RuleFor(c => c.StartDate, f => DateOnly.FromDateTime(f.Date.Between(
            //                                                 new DateTime(2023, 1, 1),
            //                                                 new DateTime(2023, 6, 30)
            //                                             )))
            //         .RuleFor(c => c.EndDate, f => DateOnly.FromDateTime(f.Date.Between(
            //                                                 new DateTime(2023, 7, 30),
            //                                                 new DateTime(2024, 7, 30)
            //                                             )))
            //         .RuleFor(c => c.IsRoomRepresentative, f => f.Random.Bool());

            //     var contractDetails = contractDetailFaker.Generate(400);
            //     context.ContractDetail.AddRange(contractDetails);
            //     context.SaveChanges();
            // }


            // Seed Assets
            // if (!context.Asset.Any())
            // {
            //     var assetFaker = new Faker<Asset>("vi")
            //         .RuleFor(a => a.Name, f => f.Commerce.ProductName())
            //         .RuleFor(a => a.Price, f => f.Random.Decimal(500000, 10000000))
            //         .RuleFor(a => a.Type, f => f.PickRandom<EAssetType>())
            //         .RuleFor(a => a.Description, f => f.Lorem.Sentence());

            //     var assets = assetFaker.Generate(100);
            //     context.Asset.AddRange(assets);
            //     context.SaveChanges();
            // }

            // Seed Invoices and InvoiceDetails
            // if (!context.Invoice.Any())
            // {
            //     var invoiceFaker = new Faker<Invoice>("vi")
            //         .RuleFor(i => i.ContractID, f => f.PickRandom(contractIds))
            //         .RuleFor(i => i.InvoiceCode, f => f.Random.Replace("INV-###"))
            //         .RuleFor(i => i.ExtraCosts, f => f.PickRandom(contractIds))
            //         .RuleFor(i => i.CreateAt, f => f.Date.Recent())
            //         .RuleFor(i => i.PeriodStart, f => DateOnly.FromDateTime(f.Date.Past(1)))
            //         .RuleFor(i => i.PeriodEnd, f => DateOnly.FromDateTime(f.Date.Recent()))
            //         .RuleFor(i => i.TotalAmount, f => f.Random.Decimal(1000000, 5000000))
            //         .RuleFor(i => i.Status, f => f.PickRandom<EInvoiceStatus>());

            //     var invoices = invoiceFaker.Generate(100);
            //     context.Invoice.AddRange(invoices);
            //     context.SaveChanges();
            // }

            var invoiceIds = context.Invoice.Select(inv => inv.InvoiceID).ToList();
            //Seed InvoiceDetails
            // if (!context.InvoiceDetails.Any())
            // {
            //     var invoiceDetails = new List<InvoiceDetail>();
            //     var usedPairs = new HashSet<string>(); // Để theo dõi các cặp đã sử dụng

            //     var random = new Random();

            //     int invoiceDetailCount = invoiceIds.Count * serviceIds.Count;

            //     if (invoiceDetailCount > 100)
            //     {
            //         invoiceDetailCount = 100;
            //     }

            //     for (int i = 0; i < invoiceDetailCount; i++)
            //     {
            //         int invoiceId = invoiceIds[random.Next(invoiceIds.Count)];
            //         int serviceId = serviceIds[random.Next(serviceIds.Count)];
            //         string pair = $"{invoiceId}_{serviceId}";

            //         // Nếu cặp này đã tồn tại, thử lại
            //         if (usedPairs.Contains(pair))
            //         {
            //             i--; // Giảm bộ đếm để thử lại
            //             continue;
            //         }

            //         usedPairs.Add(pair);

            //         var detail = new InvoiceDetail
            //         {
            //             InvoiceID = invoiceId,
            //             ServiceID = serviceId,
            //             Quantity = random.Next(1, 100),
            //             Price = random.Next(50000, 1000000)
            //         };

            //         invoiceDetails.Add(detail);
            //     }
            //     context.InvoiceDetails.AddRange(invoiceDetails);
            //     context.SaveChanges();
            // }

            // Seed AuditLog
            // if (!context.AuditLog.Any())
            // {
            //     var auditFaker = new Faker<AuditLog>("vi")
            //         .RuleFor(a => a.Id, f => f.PickRandom(ownerIds))
            //         .RuleFor(a => a.Action, f => EAuditLogAction.CREATE)
            //         .RuleFor(a => a.Timestamp, f => f.Date.Recent())
            //         .RuleFor(a => a.TableName, f => f.Random.Word())
            //         .RuleFor(a => a.OldValue, f => f.Lorem.Word())
            //         .RuleFor(a => a.NewValue, f => f.Lorem.Word());
            //     var audits = auditFaker.Generate(20);
            //     context.AuditLog.AddRange(audits);
            //     context.SaveChanges();
            // }

            // Seed Noti
            // if (!context.Noti.Any())
            // {
            //     var notiFaker = new Faker<Noti>("vi")
            //         .RuleFor(n => n.Title, f => f.Lorem.Sentence())
            //         .RuleFor(n => n.Content, f => f.Lorem.Paragraph())
            //         .RuleFor(n => n.CreateAt, f => f.Date.Recent());
            //     var notis = notiFaker.Generate(20);
            //     context.Noti.AddRange(notis);
            //     context.SaveChanges();
            // }

            // Seed NotiRecipient
            // if (!context.NotiRecipient.Any())
            // {
            //     var notiIds = context.Noti.Select(n => n.NotiID).ToList();
            //     var notiRecipients = new List<NotiRecipient>();
            //     var random = new Random();
            //     for (int i = 0; i < 20; i++)
            //     {
            //         notiRecipients.Add(new NotiRecipient
            //         {
            //             NotiID = notiIds[random.Next(notiIds.Count)],
            //             TenantID = tenantIds[random.Next(tenantIds.Count)]
            //         });
            //     }
            //     context.NotiRecipient.AddRange(notiRecipients);
            //     context.SaveChanges();
            // }

            // Seed RoomAsset
            // if (context.RoomAsset.Count() < 100)
            // {
            //     var assetIds = context.Asset.Select(a => a.AssetID).ToList();
            //     var roomAssets = new List<RoomAsset>();
            //     var random = new Random();
            //     for (int i = 0; i < 450; i++)
            //     {
            //         roomAssets.Add(new RoomAsset
            //         {
            //             AssetID = assetIds[random.Next(assetIds.Count)],
            //             RoomID = roomIds[random.Next(roomIds.Count)]
            //         });
            //     }
            //     context.RoomAsset.AddRange(roomAssets);
            //     context.SaveChanges();
            // }

            // Seed RoomImage
            if (!context.RoomImage.Any())
            {
                var roomImages = new List<RoomImage>();
                var usedKeys = new HashSet<(int RoomID, string ImageURL)>();
                var random = new Random();

                int maxAttempts = 500; // để tránh vòng lặp vô hạn nếu danh sách ít
                int i = 0;
                while (roomImages.Count < 180 && maxAttempts-- > 0)
                {
                    var roomId = roomIds[random.Next(roomIds.Count)];
                    var imageUrl = roomImageUrls[random.Next(roomImageUrls.Count)];

                    var key = (roomId, imageUrl);

                    if (!usedKeys.Contains(key))
                    {
                        usedKeys.Add(key);
                        roomImages.Add(new RoomImage
                        {
                            RoomID = roomId,
                            ImageURL = imageUrl
                        });
                    }
                }

                context.RoomImage.AddRange(roomImages);
                context.SaveChanges();
            }


            // if (context.RoomImage.Any())
            // {
            //     var roomImages = context.RoomImage.ToList();
            //     var random = new Random();

            //     foreach (var roomImage in roomImages)
            //     {
            //         roomImage.ImageURL = roomImageUrls[random.Next(roomImageUrls.Count)];
            //     }

            //     context.RoomImage.UpdateRange(roomImages);
            //     context.SaveChanges();
            // }

            // if (context.Tenant.Any())
            // {
            //     var roomImages = context.Tenant.ToList();
            //     var random = new Random();

            //     foreach (var roomImage in roomImages)
            //     {
            //         roomImage. = roomImageUrls[random.Next(roomImageUrls.Count)];
            //     }

            //     context.RoomImage.UpdateRange(roomImages);
            //     context.SaveChanges();
            // }
        }
    }
}