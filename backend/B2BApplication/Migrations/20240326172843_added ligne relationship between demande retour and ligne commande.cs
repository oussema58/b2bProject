using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace B2BApplication.Migrations
{
    /// <inheritdoc />
    public partial class addedlignerelationshipbetweendemanderetourandlignecommande : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "commandeLigneId",
                table: "lignedemandesRetour",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_lignedemandesRetour_commandeLigneId",
                table: "lignedemandesRetour",
                column: "commandeLigneId",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_lignedemandesRetour_commandeLignes_commandeLigneId",
                table: "lignedemandesRetour",
                column: "commandeLigneId",
                principalTable: "commandeLignes",
                principalColumn: "ligneId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_lignedemandesRetour_commandeLignes_commandeLigneId",
                table: "lignedemandesRetour");

            migrationBuilder.DropIndex(
                name: "IX_lignedemandesRetour_commandeLigneId",
                table: "lignedemandesRetour");

            migrationBuilder.DropColumn(
                name: "commandeLigneId",
                table: "lignedemandesRetour");
        }
    }
}
