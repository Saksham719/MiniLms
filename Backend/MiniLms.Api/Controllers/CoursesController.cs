// MiniLms.Api/Controllers/CoursesController.cs
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MiniLms.Api.Data;
using MiniLms.Api.Models;

namespace MiniLms.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CoursesController : ControllerBase
{
    private readonly AppDbContext _db;
    public CoursesController(AppDbContext db) { _db = db; }

    [HttpGet]
    [AllowAnonymous]
    public async Task<IActionResult> List([FromQuery] string? search, [FromQuery] string? category, [FromQuery] string? level,
        [FromQuery] int page = 1, [FromQuery] int pageSize = 10)
    {
        var q = _db.Courses.AsQueryable();
        if (!string.IsNullOrWhiteSpace(search)) q = q.Where(c => c.Title.Contains(search));
        if (!string.IsNullOrWhiteSpace(category)) q = q.Where(c => c.Category == category);
        if (!string.IsNullOrWhiteSpace(level)) q = q.Where(c => c.Level == level);

        var total = await q.CountAsync();
        var items = await q.OrderByDescending(c => c.CreatedAt)
                           .Skip((page - 1) * pageSize)
                           .Take(pageSize)
                           .ToListAsync();
        return Ok(new { total, page, pageSize, items });
    }

    [HttpGet("{id:int}")]
    [AllowAnonymous]
    public async Task<IActionResult> Get(int id)
        => (await _db.Courses.FindAsync(id)) is { } c ? Ok(c) : NotFound();

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Create(Course input)
    {
        _db.Courses.Add(input);
        await _db.SaveChangesAsync();
        return CreatedAtAction(nameof(Get), new { id = input.Id }, input);
    }

    [HttpPut("{id:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Update(int id, Course input)
    {
        var c = await _db.Courses.FindAsync(id);
        if (c is null) return NotFound();
        c.Title = input.Title;
        c.Description = input.Description;
        c.Category = input.Category;
        c.Level = input.Level;
        c.DurationMinutes = input.DurationMinutes;
        c.IsPublished = input.IsPublished;
        await _db.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(int id)
    {
        var c = await _db.Courses.FindAsync(id);
        if (c is null) return NotFound();
        _db.Remove(c);
        await _db.SaveChangesAsync();
        return NoContent();
    }
}
