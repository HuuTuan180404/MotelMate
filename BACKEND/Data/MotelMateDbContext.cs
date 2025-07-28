namespace BACKEND.Data
{
    using Microsoft.EntityFrameworkCore;
    using BACKEND.Models;
    using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
    using Microsoft.AspNetCore.Identity;

    public class MotelMateDbContext : IdentityDbContext<Account, IdentityRole<int>, int>
    {
        public MotelMateDbContext(DbContextOptions<MotelMateDbContext> options)
            : base(options) { }

        public DbSet<Account> Account { get; set; }
        public DbSet<Asset> Asset { get; set; }

        public DbSet<AuditLog> AuditLog { get; set; }
        public DbSet<Building> Building { get; set; }
        public DbSet<Contract> Contract { get; set; }
        public DbSet<ContractDetail> ContractDetail { get; set; }
        public DbSet<Invoice> Invoice { get; set; }
        public DbSet<InvoiceDetail> InvoiceDetails { get; set; }
        public DbSet<ExtraCost> ExtraCosts { get; set; }

        public DbSet<Noti> Noti { get; set; }
        public DbSet<NotiRecipient> NotiRecipient { get; set; }
        public DbSet<Owner> Owner { get; set; }
        public DbSet<Request> Request { get; set; }
        public DbSet<Room> Room { get; set; }
        public DbSet<RoomAsset> RoomAsset { get; set; }
        public DbSet<RoomImage> RoomImage { get; set; }
        public DbSet<Service> Services { get; set; }
        public DbSet<ServiceTier> ServiceTiers { get; set; }
        public DbSet<Tenant> Tenant { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Nếu muốn lưu enum dưới dạng string thay vì int, bỏ comment các dòng dưới:
            modelBuilder.Entity<Account>().Property(e => e.Status).HasConversion<string>();

            modelBuilder.Entity<Asset>().Property(e => e.Type).HasConversion<string>();

            modelBuilder.Entity<AuditLog>().Property(e => e.Action).HasConversion<string>();

            modelBuilder.Entity<Contract>().Property(e => e.Status).HasConversion<string>();

            modelBuilder.Entity<Invoice>().Property(e => e.Status).HasConversion<string>();

            modelBuilder.Entity<Request>().Property(e => e.Status).HasConversion<string>();

            modelBuilder.Entity<Room>().Property(e => e.Status).HasConversion<string>();

            // Cấu hình khóa chính tổng hợp
            modelBuilder.Entity<InvoiceDetail>().HasKey(id => new { id.InvoiceID, id.ServiceID });
            modelBuilder.Entity<ContractDetail>().HasKey(id => new { id.ContractID, id.TenantID, id.StartDate });
            modelBuilder.Entity<RoomAsset>().HasKey(id => new { id.AssetID, id.RoomID });
            modelBuilder.Entity<RoomImage>().HasKey(id => new { id.RoomID, id.ImageURL });
            modelBuilder.Entity<NotiRecipient>().HasKey(id => new { id.NotiID, id.TenantID });

            modelBuilder.Entity<ExtraCost>()
                .HasOne(e => e.Invoice)
                .WithMany(i => i.ExtraCosts)
                .HasForeignKey(e => e.InvoiceID)
                .OnDelete(DeleteBehavior.Cascade);
            
            modelBuilder.Entity<InvoiceDetail>()
                .HasOne(id => id.Invoice)
                .WithMany(i => i.InvoiceDetail)
                .HasForeignKey(id => id.InvoiceID)
                .OnDelete(DeleteBehavior.Cascade);

            base.OnModelCreating(modelBuilder);
        }
    }
}