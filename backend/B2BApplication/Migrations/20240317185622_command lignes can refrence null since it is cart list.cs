using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace B2BApplication.Migrations
{
    /// <inheritdoc />
    public partial class commandlignescanrefrencenullsinceitiscartlist : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_commandeLignes_commandes_commandeId",
                table: "commandeLignes");

            migrationBuilder.AlterColumn<int>(
                name: "commandeId",
                table: "commandeLignes",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddForeignKey(
                name: "FK_commandeLignes_commandes_commandeId",
                table: "commandeLignes",
                column: "commandeId",
                principalTable: "commandes",
                principalColumn: "commandeId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_commandeLignes_commandes_commandeId",
                table: "commandeLignes");

            migrationBuilder.AlterColumn<int>(
                name: "commandeId",
                table: "commandeLignes",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_commandeLignes_commandes_commandeId",
                table: "commandeLignes",
                column: "commandeId",
                principalTable: "commandes",
                principalColumn: "commandeId",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
