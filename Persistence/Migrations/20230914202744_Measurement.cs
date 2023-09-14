using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Persistence.Migrations
{
    /// <inheritdoc />
    public partial class Measurement : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "MeasurementId",
                table: "Ingredients",
                type: "TEXT",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.CreateTable(
                name: "Measurements",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    Name = table.Column<string>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Measurements", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Ingredients_MeasurementId",
                table: "Ingredients",
                column: "MeasurementId");

            migrationBuilder.AddForeignKey(
                name: "FK_Ingredients_Measurements_MeasurementId",
                table: "Ingredients",
                column: "MeasurementId",
                principalTable: "Measurements",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Ingredients_Measurements_MeasurementId",
                table: "Ingredients");

            migrationBuilder.DropTable(
                name: "Measurements");

            migrationBuilder.DropIndex(
                name: "IX_Ingredients_MeasurementId",
                table: "Ingredients");

            migrationBuilder.DropColumn(
                name: "MeasurementId",
                table: "Ingredients");
        }
    }
}
