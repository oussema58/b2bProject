using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace B2BApplication.Migrations
{
    /// <inheritdoc />
    public partial class addednumberofviews : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ArticleID",
                table: "AspNetUsers",
                type: "int",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "articlesViews",
                columns: table => new
                {
                    articleId = table.Column<int>(type: "int", nullable: false),
                    userId = table.Column<int>(type: "int", nullable: false),
                    userId1 = table.Column<string>(type: "nvarchar(450)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_articlesViews", x => new { x.articleId, x.userId });
                    table.ForeignKey(
                        name: "FK_articlesViews_AspNetUsers_userId1",
                        column: x => x.userId1,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_articlesViews_article_articleId",
                        column: x => x.articleId,
                        principalTable: "article",
                        principalColumn: "ArticleID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUsers_ArticleID",
                table: "AspNetUsers",
                column: "ArticleID");

            migrationBuilder.CreateIndex(
                name: "IX_articlesViews_userId1",
                table: "articlesViews",
                column: "userId1");

            migrationBuilder.AddForeignKey(
                name: "FK_AspNetUsers_article_ArticleID",
                table: "AspNetUsers",
                column: "ArticleID",
                principalTable: "article",
                principalColumn: "ArticleID");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AspNetUsers_article_ArticleID",
                table: "AspNetUsers");

            migrationBuilder.DropTable(
                name: "articlesViews");

            migrationBuilder.DropIndex(
                name: "IX_AspNetUsers_ArticleID",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "ArticleID",
                table: "AspNetUsers");
        }
    }
}
