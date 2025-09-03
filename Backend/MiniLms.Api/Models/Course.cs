namespace MiniLms.Api.Models;

public class Course {
  public int Id { get; set; }
  public string Title { get; set; } = "";
  public string? Description { get; set; }
  public string? Category { get; set; }
  public string? Level { get; set; }
  public int DurationMinutes { get; set; }
  public bool IsPublished { get; set; }
  public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
  public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
