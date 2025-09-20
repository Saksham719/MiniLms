using Microsoft.EntityFrameworkCore;
using MiniLms.Api.Models;

namespace MiniLms.Api.Data;

public class AppDb : DbContext
{
    public AppDb(DbContextOptions<AppDb> options) : base(options) { }

    public DbSet<User> Users => Set<User>();
    public DbSet<Course> Courses => Set<Course>();
    public DbSet<Enrollment> Enrollments => Set<Enrollment>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Prevent duplicate enrollment
        modelBuilder.Entity<Enrollment>()
            .HasIndex(e => new { e.CourseId, e.UserId })
            .IsUnique();
    }
}
