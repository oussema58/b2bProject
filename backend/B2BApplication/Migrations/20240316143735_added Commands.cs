using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace B2BApplication.Migrations
{
    /// <inheritdoc />
    public partial class addedCommands : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "statusCommandes",
                columns: table => new
                {
                    statusId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    statusCode = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    statustIntitule = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_statusCommandes", x => x.statusId);
                });

            migrationBuilder.CreateTable(
                name: "commandes",
                columns: table => new
                {
                    commandeId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    commandeNumero = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    commandeDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    commandeTotalHt = table.Column<decimal>(type: "decimal(18,3)", precision: 18, scale: 3, nullable: false),
                    commandeTotalTtc = table.Column<decimal>(type: "decimal(18,3)", precision: 18, scale: 3, nullable: false),
                    commandeTotalTaxes = table.Column<decimal>(type: "decimal(18,3)", precision: 18, scale: 3, nullable: false),
                    commandesNbrArticles = table.Column<int>(type: "int", nullable: false),
                    clientId = table.Column<int>(type: "int", nullable: false),
                    clientIntitule = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    clientCode = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    commandeDateLivraisonPrevue = table.Column<DateTime>(type: "datetime2", nullable: false),
                    dateCreate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    userCreateId = table.Column<string>(type: "nvarchar(450)", nullable: true),
                    statutId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_commandes", x => x.commandeId);
                    table.ForeignKey(
                        name: "FK_commandes_AspNetUsers_userCreateId",
                        column: x => x.userCreateId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_commandes_client_clientId",
                        column: x => x.clientId,
                        principalTable: "client",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_commandes_statusCommandes_statutId",
                        column: x => x.statutId,
                        principalTable: "statusCommandes",
                        principalColumn: "statusId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "commandeLignes",
                columns: table => new
                {
                    ligneId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    commandeId = table.Column<int>(type: "int", nullable: false),
                    articleId = table.Column<int>(type: "int", nullable: false),
                    articleCode = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    articleIntitule = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    articlePrixHt = table.Column<decimal>(type: "decimal(18,3)", precision: 18, scale: 3, nullable: false),
                    articlePrixTtc = table.Column<decimal>(type: "decimal(18,3)", precision: 18, scale: 3, nullable: false),
                    articleTauxTva = table.Column<double>(type: "float(18)", precision: 18, scale: 3, nullable: false),
                    ligneQuantite = table.Column<int>(type: "int", nullable: false),
                    ligneTotalHt = table.Column<decimal>(type: "decimal(18,3)", precision: 18, scale: 3, nullable: false),
                    ligneTotalTtc = table.Column<decimal>(type: "decimal(18,3)", precision: 18, scale: 3, nullable: false),
                    ligneTotalTaxes = table.Column<decimal>(type: "decimal(18,3)", precision: 18, scale: 3, nullable: false),
                    dateCreate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    userId = table.Column<string>(type: "nvarchar(450)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_commandeLignes", x => x.ligneId);
                    table.ForeignKey(
                        name: "FK_commandeLignes_AspNetUsers_userId",
                        column: x => x.userId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_commandeLignes_article_articleId",
                        column: x => x.articleId,
                        principalTable: "article",
                        principalColumn: "ArticleID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_commandeLignes_commandes_commandeId",
                        column: x => x.commandeId,
                        principalTable: "commandes",
                        principalColumn: "commandeId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_commandeLignes_articleId",
                table: "commandeLignes",
                column: "articleId");

            migrationBuilder.CreateIndex(
                name: "IX_commandeLignes_commandeId",
                table: "commandeLignes",
                column: "commandeId");

            migrationBuilder.CreateIndex(
                name: "IX_commandeLignes_userId",
                table: "commandeLignes",
                column: "userId");

            migrationBuilder.CreateIndex(
                name: "IX_commandes_clientId",
                table: "commandes",
                column: "clientId");

            migrationBuilder.CreateIndex(
                name: "IX_commandes_statutId",
                table: "commandes",
                column: "statutId");

            migrationBuilder.CreateIndex(
                name: "IX_commandes_userCreateId",
                table: "commandes",
                column: "userCreateId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "commandeLignes");

            migrationBuilder.DropTable(
                name: "commandes");

            migrationBuilder.DropTable(
                name: "statusCommandes");
        }
    }
}
