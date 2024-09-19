using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace nns_backend.Migrations
{
    /// <inheritdoc />
    public partial class Addfieldintouser : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Gender",
                table: "AspNetUsers");

            migrationBuilder.RenameColumn(
                name: "UnsignFullName",
                table: "AspNetUsers",
                newName: "ThumbnailUrl");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "ThumbnailUrl",
                table: "AspNetUsers",
                newName: "UnsignFullName");

            migrationBuilder.AddColumn<bool>(
                name: "Gender",
                table: "AspNetUsers",
                type: "bit",
                nullable: true);
        }
    }
}
