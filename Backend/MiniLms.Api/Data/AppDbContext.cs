// MiniLms.Api/Data/AppDbContext.cs
using Microsoft.EntityFrameworkCore;
using MiniLms.Api.Models;

namespace MiniLms.Api.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<User> Users => Set<User>();
        public DbSet<Course> Courses => Set<Course>();
        public DbSet<Enrollment> Enrollments => Set<Enrollment>();
        public DbSet<CourseMaterial> CourseMaterials => Set<CourseMaterial>();


        public override int SaveChanges()
        {
            foreach (var e in ChangeTracker.Entries<Course>())
            {
                if (e.State == EntityState.Modified) e.Entity.UpdatedAt = DateTime.UtcNow;
            }
            return base.SaveChanges();
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<User>().HasIndex(u => u.Email).IsUnique();

            modelBuilder.Entity<Enrollment>()
                .HasIndex(e => new { e.UserId, e.CourseId })
                .IsUnique(); // prevent duplicate enrollments
             modelBuilder.Entity<CourseMaterial>()
                .HasOne(m => m.Course)
                .WithMany() // or create Course.Materials nav if you like
                .HasForeignKey(m => m.CourseId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
