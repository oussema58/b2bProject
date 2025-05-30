﻿using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace B2BApplication.Migrations
{
    /// <inheritdoc />
    public partial class addingnavigationproptocommandforuserCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_commandes_AspNetUsers_userCreateId",
                table: "commandes");

            migrationBuilder.AlterColumn<string>(
                name: "userCreateId",
                table: "commandes",
                type: "nvarchar(450)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(450)",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_commandes_AspNetUsers_userCreateId",
                table: "commandes",
                column: "userCreateId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_commandes_AspNetUsers_userCreateId",
                table: "commandes");

            migrationBuilder.AlterColumn<string>(
                name: "userCreateId",
                table: "commandes",
                type: "nvarchar(450)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)");

            migrationBuilder.AddForeignKey(
                name: "FK_commandes_AspNetUsers_userCreateId",
                table: "commandes",
                column: "userCreateId",
                principalTable: "AspNetUsers",
                principalColumn: "Id");
        }
    }
}
