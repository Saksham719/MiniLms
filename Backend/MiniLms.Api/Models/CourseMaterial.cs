namespace MiniLms.Api.Models
{
  public class CourseMaterial
  {
    public int Id { get; set; }
    public int CourseId { get; set; }
    public string Title { get; set; } = "";
    public string Type { get; set; } = "url";   // "url" | "file"
    public string Location { get; set; } = "";  // URL or /uploads/... path
    public DateTime UploadedAt { get; set; } = DateTime.UtcNow;

    public Course? Course { get; set; }
  }
}
