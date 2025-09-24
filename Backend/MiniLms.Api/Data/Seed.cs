using MiniLms.Api.Models;

namespace MiniLms.Api.Data;

public static class Seed {
  public static void Ensure(AppDbContext db) {
    db.Database.EnsureCreated();

    if (!db.Users.Any()) {
      db.Users.AddRange(
        new User {
          FullName = "Admin User",
          Email = "admin@demo.com",
          PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin@123"),
          Role = "Admin"
        },
        new User {
          FullName = "Student User",
          Email = "student@demo.com",
          PasswordHash = BCrypt.Net.BCrypt.HashPassword("Student@123"),
          Role = "Student"
        }
      );
    }

    if (!db.Courses.Any()) {
      db.Courses.AddRange(
        new Course { Title="Intro to Databases", Category="Data", Level="Beginner", DurationMinutes=90, IsPublished=true },
        new Course { Title="C# for Web APIs", Category="Programming", Level="Intermediate", DurationMinutes=120, IsPublished=true }
      );
    }

    db.SaveChanges();
  }
}
