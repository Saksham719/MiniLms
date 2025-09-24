using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MiniLms.Api.Data;
using MiniLms.Api.Models;

namespace MiniLms.Api.Controllers;

[ApiController]
[Route("api/courses/{courseId:int}/materials")]
public class CourseMaterialsController : ControllerBase
{
  private readonly AppDbContext _db;
  private readonly IWebHostEnvironment _env;
  public CourseMaterialsController(AppDbContext db, IWebHostEnvironment env)
  { _db = db; _env = env; }

  // GET: api/courses/1/materials
  [HttpGet]
  [AllowAnonymous]
  public async Task<IActionResult> List(int courseId)
  {
    var items = await _db.CourseMaterials
      .Where(m => m.CourseId == courseId)
      .OrderByDescending(m => m.UploadedAt)
      .ToListAsync();
    return Ok(items);
  }

  public record UrlDto(string Title, string Url);

  // POST: api/courses/1/materials/url
  [HttpPost("url")]
  [Authorize(Roles = "Admin")]
  public async Task<IActionResult> AddUrl(int courseId, UrlDto dto)
  {
    var m = new CourseMaterial {
      CourseId = courseId, Title = dto.Title, Type = "url", Location = dto.Url
    };
    _db.CourseMaterials.Add(m);
    await _db.SaveChangesAsync();
    return CreatedAtAction(nameof(List), new { courseId }, m);
  }

  // POST: api/courses/1/materials/file
  [HttpPost("file")]
  [Authorize(Roles = "Admin")]
  public async Task<IActionResult> UploadFile(int courseId, [FromForm] string title, [FromForm] IFormFile file)
  {
    if (file == null || file.Length == 0) return BadRequest("File required");
    var webroot = _env.WebRootPath ?? Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
    var dir = Path.Combine(webroot, "uploads", courseId.ToString());
    Directory.CreateDirectory(dir);
    var safeName = $"{Guid.NewGuid()}_{Path.GetFileName(file.FileName)}";
    var fullPath = Path.Combine(dir, safeName);
    using (var fs = System.IO.File.Create(fullPath))
      await file.CopyToAsync(fs);

    var relUrl = $"/uploads/{courseId}/{safeName}";
    var m = new CourseMaterial { CourseId = courseId, Title = title, Type = "file", Location = relUrl };
    _db.CourseMaterials.Add(m);
    await _db.SaveChangesAsync();
    return CreatedAtAction(nameof(List), new { courseId }, m);
  }
}

[ApiController]
[Route("api/materials")]
public class MaterialsAdminController : ControllerBase
{
  private readonly AppDbContext _db;
  private readonly IWebHostEnvironment _env;
  public MaterialsAdminController(AppDbContext db, IWebHostEnvironment env) { _db = db; _env = env; }

  // DELETE: api/materials/5
  [HttpDelete("{id:int}")]
  [Authorize(Roles = "Admin")]
  public async Task<IActionResult> Delete(int id)
  {
    var m = await _db.CourseMaterials.FindAsync(id);
    if (m == null) return NotFound();

    // Best-effort: remove file from disk if Type=file
    if (m.Type == "file" && !string.IsNullOrWhiteSpace(m.Location) && m.Location.StartsWith("/uploads/"))
    {
      var webroot = _env.WebRootPath ?? Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
      var toDelete = Path.Combine(webroot, m.Location.TrimStart('/').Replace('/', Path.DirectorySeparatorChar));
      if (System.IO.File.Exists(toDelete)) System.IO.File.Delete(toDelete);
    }
    _db.CourseMaterials.Remove(m);
    await _db.SaveChangesAsync();
    return NoContent();
  }
}
