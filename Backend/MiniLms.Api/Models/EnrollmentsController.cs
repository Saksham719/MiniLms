using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MiniLms.Api.Data;
using MiniLms.Api.Models;
using System.Security.Claims;

namespace MiniLms.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class EnrollmentsController : ControllerBase
{
    private readonly AppDb _db;
    public EnrollmentsController(AppDb db) => _db = db;

    [HttpPost("enroll/{courseId}")]
    [Authorize(Roles = "Student")]
    public async Task<IActionResult> EnrollInCourse(int courseId)
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

        // Check if already enrolled
        if (await _db.Enrollments.AnyAsync(e => e.CourseId == courseId && e.UserId == userId))
            return Conflict("Already enrolled in this course.");

        var course = await _db.Courses.FindAsync(courseId);
        if (course == null) return NotFound("Course not found.");

        var enrollment = new Enrollment
        {
            CourseId = courseId,
            UserId = userId,
            Progress = 0,
            LastAccessed = DateTime.UtcNow
        };

        _db.Enrollments.Add(enrollment);
        await _db.SaveChangesAsync();

        return CreatedAtAction(nameof(GetEnrollment), new { id = enrollment.Id }, enrollment);
    }

    [HttpGet("{id}")]
    [Authorize(Roles = "Student")]
    public async Task<IActionResult> GetEnrollment(int id)
    {
        var enrollment = await _db.Enrollments
            .Include(e => e.Course)
            .Include(e => e.User)
            .FirstOrDefaultAsync(e => e.Id == id);

        if (enrollment == null) return NotFound();
        return Ok(enrollment);
    }
}
