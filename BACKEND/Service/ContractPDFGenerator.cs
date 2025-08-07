using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Reflection.Metadata;
using System.Threading.Tasks;
using BACKEND.Data;
using BACKEND.Enums;
using BACKEND.Models;
using Microsoft.EntityFrameworkCore;
using QuestPDF.Companion;
using QuestPDF.Fluent;
using QuestPDF.Helpers;
using Document = QuestPDF.Fluent.Document;
namespace BACKEND.Service
{
    public class ContractPDFGenerator
    {
        private readonly MotelMateDbContext _context;
        public ContractPDFGenerator(MotelMateDbContext context)
        {
            _context = context;
            QuestPDF.Settings.License = QuestPDF.Infrastructure.LicenseType.Community;
        }
        public async Task<byte[]> GeneratePDF( int RoomID)
        {
            var room = await _context.Room
                .Include(r => r.Building)
                    .ThenInclude(b => b.Owner)
                .Include(r => r.Contracts)
                    .ThenInclude(c => c.ContractDetail)
                        .ThenInclude(cd => cd.Tenant)
                .FirstOrDefaultAsync(r => r.RoomID == RoomID);
            if (room == null) return null;
            var tenant = room.Contracts.FirstOrDefault().ContractDetail.FirstOrDefault(cd => cd.IsRoomRepresentative == true).Tenant;
            var time = DateTime.Now;
            var document = Document.Create(container =>
                container.Page(page =>
                {
                    page.Size(PageSizes.A4);
                    page.Margin(2, QuestPDF.Infrastructure.Unit.Centimetre);
                    page.DefaultTextStyle(x => x.FontSize(12));      

                    page.Content().Column(column =>
                    {
                        column.Spacing(10);

                        column.Item().AlignCenter().Text("CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM").Bold();
                        column.Item().AlignCenter().Text("Độc lập - Tự do - Hạnh phúc").Italic();

                        column.Item().AlignCenter().Text("HỢP ĐỒNG THUÊ PHÒNG TRỌ").FontSize(16).Bold();

                        column.Item().Text($"Hôm nay, ngày {time.Day} tháng {time.Month} năm {time.Year}, tại căn nhà {room.Building.Name}");

                        column.Item().Text("Chúng tôi ký tên dưới đây gồm có:");

                        column.Item().Text("BÊN CHO THUÊ PHÒNG TRỌ (gọi tắt là Bên A):").Bold();
                        column.Item().Text($"Ông/bà (tên chủ hợp đồng): {room.Building.Owner.FullName}");
                        column.Item().Text($"CMND/CCCD số: {room.Building.Owner.CCCD}");

                        column.Item().Text("BÊN THUÊ PHÒNG TRỌ (gọi tắt là Bên B):").Bold();
                        column.Item().Text($"Ông/bà: {tenant.FullName}");
                        column.Item().Text($"CMND/CCCD số: {tenant.CCCD}");

                        column.Item().Text("Sau khi thỏa thuận, hai bên thống nhất như sau:");

                        column.Item().Text("1. Nội dung thuê phòng trọ").Bold();
                        column.Item().Text($"Bên A cho Bên B thuê 01 phòng trọ số {room.RoomNumber} tại căn nhà {room.Building.Name}. Với thời hạn từ ngày {room.Contracts.FirstOrDefault().StartDate}. tới ngày {room.Contracts.FirstOrDefault().EndDate}, giá thuê: {((int)room.Contracts.FirstOrDefault().Price).ToString("N0", new CultureInfo("vi-VN"))} đồng/tháng. Chưa bao gồm chi phí: điện sinh hoạt, nước.").Justify();

                        column.Item().Text("2. Trách nhiệm Bên A").Bold();
                        column.Item().Text("Đảm bảo căn nhà cho thuê không có tranh chấp, khiếu kiện. Đăng ký với chính quyền địa phương về thủ tục cho thuê phòng trọ.").Justify();

                        column.Item().Text("3. Trách nhiệm Bên B").Bold();
                        column.Item().Text($"Đặt cọc với số tiền là {((int)room.Contracts.FirstOrDefault().Deposit).ToString("N0", new CultureInfo("vi-VN"))} đồng, thanh toán tiền thuê phòng hàng tháng là {((int)room.Contracts.FirstOrDefault().Price).ToString("N0", new CultureInfo("vi-VN"))} đồng + tiền điện + nước + dịch vụ phát sinh (nếu có).").Justify();
                        column.Item().Text("Đảm bảo các thiết bị và sửa chữa các hư hỏng trong phòng trong khi sử dụng. Nếu không sửa chữa thì khi trả phòng, bên A sẽ trừ vào tiền đặt cọc, giá trị cụ thể được tính theo giá thị trường.").Justify();
                        column.Item().Text($"Chỉ sử dụng phòng trọ vào mục đích ở, với số lượng tối đa không quá {room.MaxGuests} người (kể cả trẻ em); không chứa các thiết bị gây cháy nổ, hàng cấm... cung cấp giấy tờ tùy thân để đăng ký tạm trú theo quy định, giữ gìn an ninh trật tự, nếp sống văn hóa đô thị.").Justify();

                        column.Item().Text("4. Điều khoản thực hiện").Bold();
                        column.Item().Text("Hai bên nghiêm túc thực hiện những quy định trên trong thời hạn cho thuê, nếu bên A lấy phòng phải báo cho bên B ít nhất 01 tháng, hoặc ngược lại.").Justify();

                        column.Item().PaddingBottom(50).Row(row =>
                        {
                            row.RelativeItem().Text("Bên B\n(Ký, ghi rõ họ tên)").AlignCenter();
                            row.RelativeItem().Text("Bên A\n(Ký, ghi rõ họ tên)").AlignCenter();
                        });
                        column.Item().PaddingBottom(30).Row(row =>
                        {
                            var tenantName = room.Contracts.FirstOrDefault().Status == EContractStatus.Unsigned ? "" : tenant.FullName;
                            row.RelativeItem().Text($"{tenantName}").AlignCenter();
                            row.RelativeItem().Text($"{room.Building.Owner.FullName}").AlignCenter();
                        });
                    });
                })
            );
            // document.ShowInCompanion();
            return document.GeneratePdf();
        }
    }
}