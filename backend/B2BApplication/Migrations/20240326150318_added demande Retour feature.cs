using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace B2BApplication.Migrations
{
    /// <inheritdoc />
    public partial class addeddemandeRetourfeature : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "demandesRetour",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    nbArtcileRetenue = table.Column<int>(type: "int", nullable: false),
                    userId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    clientId = table.Column<int>(type: "int", nullable: false),
                    dateCreated = table.Column<DateTime>(type: "datetime2", nullable: false),
                    adminId = table.Column<string>(type: "nvarchar(450)", nullable: true),
                    commandeId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_demandesRetour", x => x.Id);
                    table.ForeignKey(
                        name: "FK_demandesRetour_AspNetUsers_adminId",
                        column: x => x.adminId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_demandesRetour_AspNetUsers_userId",
                        column: x => x.userId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_demandesRetour_client_clientId",
                        column: x => x.clientId,
                        principalTable: "client",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "motifs",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    code = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    intitule = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_motifs", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "lignedemandesRetour",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    nbArticleRetenue = table.Column<int>(type: "int", nullable: false),
                    motifId = table.Column<int>(type: "int", nullable: false),
                    articleId = table.Column<int>(type: "int", nullable: false),
                    artcileIntitule = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    articleCode = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    nbArticleTotale = table.Column<int>(type: "int", nullable: false),
                    demandeRetourId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_lignedemandesRetour", x => x.id);
                    table.ForeignKey(
                        name: "FK_lignedemandesRetour_article_articleId",
                        column: x => x.articleId,
                        principalTable: "article",
                        principalColumn: "ArticleID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_lignedemandesRetour_demandesRetour_demandeRetourId",
                        column: x => x.demandeRetourId,
                        principalTable: "demandesRetour",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_lignedemandesRetour_motifs_motifId",
                        column: x => x.motifId,
                        principalTable: "motifs",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_demandesRetour_adminId",
                table: "demandesRetour",
                column: "adminId");

            migrationBuilder.CreateIndex(
                name: "IX_demandesRetour_clientId",
                table: "demandesRetour",
                column: "clientId");

            migrationBuilder.CreateIndex(
                name: "IX_demandesRetour_userId",
                table: "demandesRetour",
                column: "userId");

            migrationBuilder.CreateIndex(
                name: "IX_lignedemandesRetour_articleId",
                table: "lignedemandesRetour",
                column: "articleId");

            migrationBuilder.CreateIndex(
                name: "IX_lignedemandesRetour_demandeRetourId",
                table: "lignedemandesRetour",
                column: "demandeRetourId");

            migrationBuilder.CreateIndex(
                name: "IX_lignedemandesRetour_motifId",
                table: "lignedemandesRetour",
                column: "motifId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "lignedemandesRetour");

            migrationBuilder.DropTable(
                name: "demandesRetour");

            migrationBuilder.DropTable(
                name: "motifs");
        }
    }
}
