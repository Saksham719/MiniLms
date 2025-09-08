namespace MiniLms.Api.Models;

public class Enrollment
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public int CourseId { get; set; }
    public DateTime EnrolledAt { get; set; } = DateTime.UtcNow;
    public int Progress { get; set; } = 0;
    public DateTime? LastAccessedAt { get; set; }

    public User? User { get; set; }
    public Course? Course { get; set; }
}
