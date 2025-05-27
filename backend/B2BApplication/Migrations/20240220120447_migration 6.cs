using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace B2BApplication.Migrations
{
    /// <inheritdoc />
    public partial class migration6 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "famille",
                columns: table => new
                {
                    FamilleId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    FamilleCode = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    FamilleIntitule = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_famille", x => x.FamilleId);
                });

            migrationBuilder.CreateTable(
                name: "taxe",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    TaxeCode = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    TaxeIntitule = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    TaxeTaux = table.Column<double>(type: "float", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_taxe", x => x.Id);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "famille");

            migrationBuilder.DropTable(
                name: "taxe");
        }
    }
}
