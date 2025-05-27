using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace B2BApplication.Migrations
{
    /// <inheritdoc />
    public partial class newchapter : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_client_AspNetUsers_UserId",
                table: "client");

            migrationBuilder.DropForeignKey(
                name: "FK_client_societe_SocieteId",
                table: "client");

            migrationBuilder.DropTable(
                name: "tokens");

            migrationBuilder.DropIndex(
                name: "IX_client_SocieteId",
                table: "client");

            migrationBuilder.DropIndex(
                name: "IX_client_UserId",
                table: "client");

            migrationBuilder.DropColumn(
                name: "SocieteId",
                table: "client");

            migrationBuilder.DropColumn(
                name: "UserId",
                table: "client");

            migrationBuilder.DropColumn(
                name: "Telephone",
                table: "AspNetUsers");

            migrationBuilder.RenameColumn(
                name: "matricule",
                table: "client",
                newName: "userCreate");

            migrationBuilder.RenameColumn(
                name: "status",
                table: "AspNetUsers",
                newName: "etat");

            migrationBuilder.AlterColumn<string>(
                name: "telephone",
                table: "client",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "adresse",
                table: "client",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "dateCreate",
                table: "client",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<string>(
                name: "matricule_Fiscale",
                table: "client",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "ville",
                table: "client",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "clientId",
                table: "AspNetUsers",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUsers_clientId",
                table: "AspNetUsers",
                column: "clientId");

            migrationBuilder.AddForeignKey(
                name: "FK_AspNetUsers_client_clientId",
                table: "AspNetUsers",
                column: "clientId",
                principalTable: "client",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AspNetUsers_client_clientId",
                table: "AspNetUsers");

            migrationBuilder.DropIndex(
                name: "IX_AspNetUsers_clientId",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "dateCreate",
                table: "client");

            migrationBuilder.DropColumn(
                name: "matricule_Fiscale",
                table: "client");

            migrationBuilder.DropColumn(
                name: "ville",
                table: "client");

            migrationBuilder.DropColumn(
                name: "clientId",
                table: "AspNetUsers");

            migrationBuilder.RenameColumn(
                name: "userCreate",
                table: "client",
                newName: "matricule");

            migrationBuilder.RenameColumn(
                name: "etat",
                table: "AspNetUsers",
                newName: "status");

            migrationBuilder.AlterColumn<string>(
                name: "telephone",
                table: "client",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<string>(
                name: "adresse",
                table: "client",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AddColumn<int>(
                name: "SocieteId",
                table: "client",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "UserId",
                table: "client",
                type: "nvarchar(450)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Telephone",
                table: "AspNetUsers",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "tokens",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    SocieteId = table.Column<int>(type: "int", nullable: false),
                    UserId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    value = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_tokens", x => x.Id);
                    table.ForeignKey(
                        name: "FK_tokens_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_tokens_societe_SocieteId",
                        column: x => x.SocieteId,
                        principalTable: "societe",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_client_SocieteId",
                table: "client",
                column: "SocieteId");

            migrationBuilder.CreateIndex(
                name: "IX_client_UserId",
                table: "client",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_tokens_SocieteId",
                table: "tokens",
                column: "SocieteId");

            migrationBuilder.CreateIndex(
                name: "IX_tokens_UserId",
                table: "tokens",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_client_AspNetUsers_UserId",
                table: "client",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_client_societe_SocieteId",
                table: "client",
                column: "SocieteId",
                principalTable: "societe",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
