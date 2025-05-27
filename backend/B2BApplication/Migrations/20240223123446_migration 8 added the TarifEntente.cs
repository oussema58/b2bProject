using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace B2BApplication.Migrations
{
    /// <inheritdoc />
    public partial class migration8addedtheTarifEntente : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "TarifEntete",
                columns: table => new
                {
                    TarifEnteteId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Tarif_Entete_intitule = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Tarif_Entete_Code = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Tarif_Entete_DateFin = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TarifEntete", x => x.TarifEnteteId);
                });

            migrationBuilder.CreateTable(
                name: "tarifs",
                columns: table => new
                {
                    TarifId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    TarifPrix = table.Column<double>(type: "float", nullable: false),
                    articleId = table.Column<int>(type: "int", nullable: false),
                    tarifEnteteId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_tarifs", x => x.TarifId);
                    table.ForeignKey(
                        name: "FK_tarifs_TarifEntete_tarifEnteteId",
                        column: x => x.tarifEnteteId,
                        principalTable: "TarifEntete",
                        principalColumn: "TarifEnteteId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_tarifs_article_articleId",
                        column: x => x.articleId,
                        principalTable: "article",
                        principalColumn: "ArticleID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_tarifs_articleId",
                table: "tarifs",
                column: "articleId");

            migrationBuilder.CreateIndex(
                name: "IX_tarifs_tarifEnteteId",
                table: "tarifs",
                column: "tarifEnteteId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "tarifs");

            migrationBuilder.DropTable(
                name: "TarifEntete");
        }
    }
}
