using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BACKEND.Migrations
{
    /// <inheritdoc />
    public partial class AddAuditLog : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AuditLog_AspNetUsers_AccountID",
                table: "AuditLog");

            migrationBuilder.RenameColumn(
                name: "AccountID",
                table: "AuditLog",
                newName: "Id");

            migrationBuilder.RenameIndex(
                name: "IX_AuditLog_AccountID",
                table: "AuditLog",
                newName: "IX_AuditLog_Id");

            migrationBuilder.AddForeignKey(
                name: "FK_AuditLog_AspNetUsers_Id",
                table: "AuditLog",
                column: "Id",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AuditLog_AspNetUsers_Id",
                table: "AuditLog");

            migrationBuilder.RenameColumn(
                name: "Id",
                table: "AuditLog",
                newName: "AccountID");

            migrationBuilder.RenameIndex(
                name: "IX_AuditLog_Id",
                table: "AuditLog",
                newName: "IX_AuditLog_AccountID");

            migrationBuilder.AddForeignKey(
                name: "FK_AuditLog_AspNetUsers_AccountID",
                table: "AuditLog",
                column: "AccountID",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
