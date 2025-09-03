using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;

namespace MiniLms.Api.Data;

public class DesignTimeDbContextFactory : IDesignTimeDbContextFactory<AppDb> {
  public AppDb CreateDbContext(string[] args) {
    var config = new ConfigurationBuilder()
      .AddJsonFile("appsettings.json", optional: true)
      .AddEnvironmentVariables()
      .Build();

    var optionsBuilder = new DbContextOptionsBuilder<AppDb>();
    var conn = config.GetConnectionString("Default") ?? "Data Source=minilms.db";
    optionsBuilder.UseSqlite(conn);
    return new AppDb(optionsBuilder.Options);
  }
}
