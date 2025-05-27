using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace B2BApplication.Migrations
{
    /// <inheritdoc />
    public partial class addedcommandeobjecttoDemandeRetour : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_demandesRetour_commandeId",
                table: "demandesRetour",
                column: "commandeId",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_demandesRetour_commandes_commandeId",
                table: "demandesRetour",
                column: "commandeId",
                principalTable: "commandes",
                principalColumn: "commandeId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_demandesRetour_commandes_commandeId",
                table: "demandesRetour");

            migrationBuilder.DropIndex(
                name: "IX_demandesRetour_commandeId",
                table: "demandesRetour");
        }
    }
}
