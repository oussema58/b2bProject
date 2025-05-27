using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace B2BApplication.Migrations
{
    /// <inheritdoc />
    public partial class addedTarifEntituletoclient : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "entTarifId",
                table: "client",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_client_entTarifId",
                table: "client",
                column: "entTarifId");

            migrationBuilder.AddForeignKey(
                name: "FK_client_TarifEntete_entTarifId",
                table: "client",
                column: "entTarifId",
                principalTable: "TarifEntete",
                principalColumn: "TarifEnteteId",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_client_TarifEntete_entTarifId",
                table: "client");

            migrationBuilder.DropIndex(
                name: "IX_client_entTarifId",
                table: "client");

            migrationBuilder.DropColumn(
                name: "entTarifId",
                table: "client");
        }
    }
}
