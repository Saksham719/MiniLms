// MiniLms.Api/Controllers/EnrollmentsController.cs
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MiniLms.Api.Data;
using MiniLms.Api.Models;
using System.Security.Claims;

namespace MiniLms.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EnrollmentsController : ControllerBase
    {
        private readonly AppDbContext _db;
        public EnrollmentsController(AppDbContext db) { _db = db; }

        [HttpPost("enroll/{courseId:int}")]
        [Authorize(Roles = "Student")]
        public async Task<IActionResult> Enroll(int courseId)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

            var exists = await _db.Enrollments.AnyAsync(e => e.UserId == userId && e.CourseId == courseId);
            if (exists) return BadRequest("Already enrolled in this course.");

            var enrollment = new Enrollment
            {
                UserId = userId,
                CourseId = courseId,
                Progress = 0,
                EnrolledAt = DateTime.UtcNow
            };

            _db.Enrollments.Add(enrollment);
            await _db.SaveChangesAsync();
            return Ok(enrollment);
            // (Optional) return Created(...) if you prefer
        }

        [HttpGet("student/{userId:int}")]
        [Authorize(Roles = "Student")]
        public async Task<IActionResult> GetStudentEnrollments(int userId, [FromQuery] int page = 1, [FromQuery] int pageSize = 10)
        {
            var tokenUserId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            if (userId != tokenUserId) return Forbid(); // students can only see their own enrollments

            var q = _db.Enrollments
                .Include(e => e.Course)
                .Where(e => e.UserId == userId);

            var total = await q.CountAsync();
            var items = await q.OrderByDescending(e => e.EnrolledAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(e => new
                {
                    e.Id,
                    e.CourseId,
                    CourseTitle = e.Course!.Title,
                    e.Progress,
                    e.EnrolledAt,
                    e.LastAccessedAt
                })
                .ToListAsync();

            return Ok(new { total, page, pageSize, items });
        }

        [HttpGet("admin")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAllEnrollments(
            [FromQuery] string? search,
            [FromQuery] int? userId,
            [FromQuery] int? courseId,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10)
        {
            var q = _db.Enrollments
                .Include(e => e.Course)
                .Include(e => e.User)
                .AsQueryable();

            if (userId.HasValue) q = q.Where(e => e.UserId == userId);
            if (courseId.HasValue) q = q.Where(e => e.CourseId == courseId);
            if (!string.IsNullOrWhiteSpace(search))
            {
                var s = search.ToLower();
                q = q.Where(e =>
                    e.Course!.Title.ToLower().Contains(s) ||
                    e.User!.FullName.ToLower().Contains(s) ||
                    e.User.Email.ToLower().Contains(s));
            }

            var totalCount = await q.CountAsync();
            var data = await q
                .OrderByDescending(e => e.EnrolledAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(e => new
                {
                    e.Id,
                    e.Progress,
                    e.EnrolledAt,
                    e.LastAccessedAt,
                    Student = new { e.UserId, e.User!.FullName, e.User.Email },
                    Course = new { e.CourseId, e.Course!.Title }
                })
                .ToListAsync();

            return Ok(new { totalCount, page, pageSize, data });
        }

        [HttpPut("{id:int}/progress")]
        [Authorize(Roles = "Student")]
        public async Task<IActionResult> UpdateProgress(int id, [FromBody] int progress)
        {
            var tokenUserId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var enrollment = await _db.Enrollments.Include(e => e.User).FirstOrDefaultAsync(e => e.Id == id);
            if (enrollment == null) return NotFound();
            if (enrollment.UserId != tokenUserId) return Forbid();

            enrollment.Progress = Math.Clamp(progress, 0, 100);
            enrollment.LastAccessedAt = DateTime.UtcNow;
            await _db.SaveChangesAsync();
            return Ok(new { enrollment.Id, enrollment.Progress, enrollment.LastAccessedAt });
        }
        // PUT: api/enrollments/{id}/admin
// Admin can update progress (and later you can extend fields if needed)
[HttpPut("{id:int}/admin")]
[Authorize(Roles = "Admin")]
public async Task<IActionResult> AdminUpdateEnrollment(int id, [FromBody] int progress)
{
    var e = await _db.Enrollments.FindAsync(id);
    if (e == null) return NotFound();
    e.Progress = Math.Clamp(progress, 0, 100);
    e.LastAccessedAt = DateTime.UtcNow;
    await _db.SaveChangesAsync();
    return Ok(new { e.Id, e.Progress, e.LastAccessedAt });
}

// DELETE: api/enrollments/{id}
[HttpDelete("{id:int}")]
[Authorize(Roles = "Admin")]
public async Task<IActionResult> AdminDeleteEnrollment(int id)
{
    var e = await _db.Enrollments.FindAsync(id);
    if (e == null) return NotFound();
    _db.Enrollments.Remove(e);
    await _db.SaveChangesAsync();
    return NoContent();
}

    }
}
