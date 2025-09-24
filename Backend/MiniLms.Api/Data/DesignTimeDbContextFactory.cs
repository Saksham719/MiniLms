using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;

namespace MiniLms.Api.Data;

public class DesignTimeDbContextFactory : IDesignTimeDbContextFactory<AppDbContext> {
  public AppDbContext CreateDbContext(string[] args) {
    var config = new ConfigurationBuilder()
      .AddJsonFile("appsettings.json", optional: true)
      .AddEnvironmentVariables()
      .Build();

    var optionsBuilder = new DbContextOptionsBuilder<AppDbContext>();
    var conn = config.GetConnectionString("Default") ?? "Data Source=minilms.db";
    optionsBuilder.UseSqlite(conn);
    return new AppDbContext(optionsBuilder.Options);
  }
}
