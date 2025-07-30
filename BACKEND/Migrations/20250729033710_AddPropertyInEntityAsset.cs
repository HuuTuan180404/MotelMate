using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BACKEND.Migrations
{
    /// <inheritdoc />
    public partial class AddPropertyInEntityAsset : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "BuildingID",
                table: "Asset",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Asset_BuildingID",
                table: "Asset",
                column: "BuildingID");

            migrationBuilder.AddForeignKey(
                name: "FK_Asset_Building_BuildingID",
                table: "Asset",
                column: "BuildingID",
                principalTable: "Building",
                principalColumn: "BuildingID");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Asset_Building_BuildingID",
                table: "Asset");

            migrationBuilder.DropIndex(
                name: "IX_Asset_BuildingID",
                table: "Asset");

            migrationBuilder.DropColumn(
                name: "BuildingID",
                table: "Asset");
        }
    }
}
