using System;

namespace MiniLms.Api.Models
{
    public class Enrollment
    {
        public int Id { get; set; }
        public int CourseId { get; set; }
        public int UserId { get; set; }
        public int Progress { get; set; } = 0;  // Default progress
        public DateTime LastAccessed { get; set; } = DateTime.UtcNow;

        // Navigation properties
        public Course? Course { get; set; }
        public User? User { get; set; }
    }
}
