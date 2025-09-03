using Microsoft.EntityFrameworkCore;
using MiniLms.Api.Models;

namespace MiniLms.Api.Data;

public class AppDb : DbContext {
  public AppDb(DbContextOptions<AppDb> options) : base(options) { }
  public DbSet<User> Users => Set<User>();
  public DbSet<Course> Courses => Set<Course>();

  public override int SaveChanges() {
    foreach (var e in ChangeTracker.Entries<Course>()) {
      if (e.State == EntityState.Modified) e.Entity.UpdatedAt = DateTime.UtcNow;
    }
    return base.SaveChanges();
  }

  protected override void OnModelCreating(ModelBuilder b) {
    b.Entity<User>().HasIndex(u => u.Email).IsUnique();
    base.OnModelCreating(b);
  }
}
