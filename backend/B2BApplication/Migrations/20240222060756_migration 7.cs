using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace B2BApplication.Migrations
{
    /// <inheritdoc />
    public partial class migration7 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "article",
                columns: table => new
                {
                    ArticleID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ArticleCode = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ArticleIntitule = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ArticlePrixHT = table.Column<double>(type: "float", nullable: false),
                    TaxeId = table.Column<int>(type: "int", nullable: false),
                    ArticleBarCode = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ArticleEtat = table.Column<bool>(type: "bit", nullable: false),
                    ArticleStatistique = table.Column<bool>(type: "bit", nullable: false),
                    CatalogueId = table.Column<int>(type: "int", nullable: false),
                    FamilleId = table.Column<int>(type: "int", nullable: false),
                    DateCreate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    DateUpdate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UserCreatedId = table.Column<string>(type: "nvarchar(450)", nullable: true),
                    UserModifiedId = table.Column<string>(type: "nvarchar(450)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_article", x => x.ArticleID);
                    table.ForeignKey(
                        name: "FK_article_AspNetUsers_UserCreatedId",
                        column: x => x.UserCreatedId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_article_AspNetUsers_UserModifiedId",
                        column: x => x.UserModifiedId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_article_catalogue_CatalogueId",
                        column: x => x.CatalogueId,
                        principalTable: "catalogue",
                        principalColumn: "CatalogueId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_article_famille_FamilleId",
                        column: x => x.FamilleId,
                        principalTable: "famille",
                        principalColumn: "FamilleId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_article_taxe_TaxeId",
                        column: x => x.TaxeId,
                        principalTable: "taxe",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_article_CatalogueId",
                table: "article",
                column: "CatalogueId");

            migrationBuilder.CreateIndex(
                name: "IX_article_FamilleId",
                table: "article",
                column: "FamilleId");

            migrationBuilder.CreateIndex(
                name: "IX_article_TaxeId",
                table: "article",
                column: "TaxeId");

            migrationBuilder.CreateIndex(
                name: "IX_article_UserCreatedId",
                table: "article",
                column: "UserCreatedId");

            migrationBuilder.CreateIndex(
                name: "IX_article_UserModifiedId",
                table: "article",
                column: "UserModifiedId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "article");
        }
    }
}
