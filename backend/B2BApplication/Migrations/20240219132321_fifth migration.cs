using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace B2BApplication.Migrations
{
    /// <inheritdoc />
    public partial class fifthmigration : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "catalogue",
                columns: table => new
                {
                    CatalogueId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CatalogueIntitule = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CatalogueNiveau = table.Column<int>(type: "int", nullable: false),
                    CatalogueParentId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_catalogue", x => x.CatalogueId);
                    table.ForeignKey(
                        name: "FK_catalogue_catalogue_CatalogueParentId",
                        column: x => x.CatalogueParentId,
                        principalTable: "catalogue",
                        principalColumn: "CatalogueId");
                });

            migrationBuilder.CreateIndex(
                name: "IX_catalogue_CatalogueParentId",
                table: "catalogue",
                column: "CatalogueParentId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "catalogue");
        }
    }
}
