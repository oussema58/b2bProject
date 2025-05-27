using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace B2BApplication.Migrations
{
    /// <inheritdoc />
    public partial class addingimagecontenttothethreeentity : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AspNetUsers_article_ArticleID",
                table: "AspNetUsers");

            migrationBuilder.DropIndex(
                name: "IX_AspNetUsers_ArticleID",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "ArticleID",
                table: "AspNetUsers");

            migrationBuilder.AddColumn<string>(
                name: "imageContent",
                table: "client",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "imageContent",
                table: "AspNetUsers",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "imageContent",
                table: "article",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "imageContent",
                table: "client");

            migrationBuilder.DropColumn(
                name: "imageContent",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "imageContent",
                table: "article");

            migrationBuilder.AddColumn<int>(
                name: "ArticleID",
                table: "AspNetUsers",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUsers_ArticleID",
                table: "AspNetUsers",
                column: "ArticleID");

            migrationBuilder.AddForeignKey(
                name: "FK_AspNetUsers_article_ArticleID",
                table: "AspNetUsers",
                column: "ArticleID",
                principalTable: "article",
                principalColumn: "ArticleID");
        }
    }
}
