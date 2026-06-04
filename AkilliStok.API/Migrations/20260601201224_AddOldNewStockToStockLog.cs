using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AkilliStok.API.Migrations
{
    /// <inheritdoc />
    public partial class AddOldNewStockToStockLog : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "NewStock",
                table: "StockLogs",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "OldStock",
                table: "StockLogs",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_StockLogs_ProductId",
                table: "StockLogs",
                column: "ProductId");

            migrationBuilder.AddForeignKey(
                name: "FK_StockLogs_Products_ProductId",
                table: "StockLogs",
                column: "ProductId",
                principalTable: "Products",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_StockLogs_Products_ProductId",
                table: "StockLogs");

            migrationBuilder.DropIndex(
                name: "IX_StockLogs_ProductId",
                table: "StockLogs");

            migrationBuilder.DropColumn(
                name: "NewStock",
                table: "StockLogs");

            migrationBuilder.DropColumn(
                name: "OldStock",
                table: "StockLogs");
        }
    }
}
