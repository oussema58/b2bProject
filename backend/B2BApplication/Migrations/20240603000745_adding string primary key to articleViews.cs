using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace B2BApplication.Migrations
{
    /// <inheritdoc />
    public partial class addingstringprimarykeytoarticleViews : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_articlesViews_AspNetUsers_userId1",
                table: "articlesViews");

            migrationBuilder.DropPrimaryKey(
                name: "PK_articlesViews",
                table: "articlesViews");

            migrationBuilder.DropIndex(
                name: "IX_articlesViews_userId1",
                table: "articlesViews");

            migrationBuilder.DropColumn(
                name: "userId1",
                table: "articlesViews");

            migrationBuilder.AlterColumn<string>(
                name: "userId",
                table: "articlesViews",
                type: "nvarchar(450)",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddColumn<string>(
                name: "idArt",
                table: "articlesViews",
                type: "nvarchar(450)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddPrimaryKey(
                name: "PK_articlesViews",
                table: "articlesViews",
                columns: new[] { "idArt", "userId" });

            migrationBuilder.CreateIndex(
                name: "IX_articlesViews_articleId",
                table: "articlesViews",
                column: "articleId");

            migrationBuilder.CreateIndex(
                name: "IX_articlesViews_userId",
                table: "articlesViews",
                column: "userId");

            migrationBuilder.AddForeignKey(
                name: "FK_articlesViews_AspNetUsers_userId",
                table: "articlesViews",
                column: "userId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_articlesViews_AspNetUsers_userId",
                table: "articlesViews");

            migrationBuilder.DropPrimaryKey(
                name: "PK_articlesViews",
                table: "articlesViews");

            migrationBuilder.DropIndex(
                name: "IX_articlesViews_articleId",
                table: "articlesViews");

            migrationBuilder.DropIndex(
                name: "IX_articlesViews_userId",
                table: "articlesViews");

            migrationBuilder.DropColumn(
                name: "idArt",
                table: "articlesViews");

            migrationBuilder.AlterColumn<int>(
                name: "userId",
                table: "articlesViews",
                type: "int",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)");

            migrationBuilder.AddColumn<string>(
                name: "userId1",
                table: "articlesViews",
                type: "nvarchar(450)",
                nullable: true);

            migrationBuilder.AddPrimaryKey(
                name: "PK_articlesViews",
                table: "articlesViews",
                columns: new[] { "articleId", "userId" });

            migrationBuilder.CreateIndex(
                name: "IX_articlesViews_userId1",
                table: "articlesViews",
                column: "userId1");

            migrationBuilder.AddForeignKey(
                name: "FK_articlesViews_AspNetUsers_userId1",
                table: "articlesViews",
                column: "userId1",
                principalTable: "AspNetUsers",
                principalColumn: "Id");
        }
    }
}
