using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BACKEND.Migrations
{
    /// <inheritdoc />
    public partial class AddExtraCost : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ExtraCosts",
                table: "Invoice");

            migrationBuilder.CreateTable(
                name: "ExtraCosts",
                columns: table => new
                {
                    ExtraCostID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    InvoiceID = table.Column<int>(type: "int", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Amount = table.Column<decimal>(type: "decimal(18,2)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ExtraCosts", x => x.ExtraCostID);
                    table.ForeignKey(
                        name: "FK_ExtraCosts_Invoice_InvoiceID",
                        column: x => x.InvoiceID,
                        principalTable: "Invoice",
                        principalColumn: "InvoiceID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ExtraCosts_InvoiceID",
                table: "ExtraCosts",
                column: "InvoiceID");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ExtraCosts");

            migrationBuilder.AddColumn<decimal>(
                name: "ExtraCosts",
                table: "Invoice",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);
        }
    }
}
