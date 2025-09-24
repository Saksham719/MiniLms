using MiniLms.Api.Models;

namespace MiniLms.Api.Data
{
    public static class DbSeeder
    {
        public static void Seed(AppDbContext context)
        {
            context.Database.EnsureCreated();

            if (!context.Users.Any())
            {
                context.Users.AddRange(
                    new User
                    {
                        FullName = "Admin User",
                        Email = "admin@mini.com",
                        PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin@123"),
                        Role = "Admin"
                    },
                    new User
                    {
                        FullName = "Student User",
                        Email = "student@mini.com",
                        PasswordHash = BCrypt.Net.BCrypt.HashPassword("Student@123"),
                        Role = "Student"
                    }
                );
                context.SaveChanges();
            }

            if (!context.Courses.Any())
            {
                context.Courses.AddRange(
                    new Course
                    {
                        
                        Title = "Intro to Programming",
                        Description = "Learn basics of programming with C#",
                        Category = "Programming",
                        Level = "Beginner",
                        DurationMinutes = 120
                    },
                    new Course
                    {
                        Title = "Web Development with React",
                        Description = "Learn frontend development using React.js",
                        Category = "Web Development",
                        Level = "Intermediate",
                        DurationMinutes = 180
                    }
                );
                context.SaveChanges();
            }
        }
    }
}
