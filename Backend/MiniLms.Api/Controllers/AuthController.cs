using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using MiniLms.Api.Data;
using MiniLms.Api.Models;

namespace MiniLms.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase {
  private readonly AppDb _db;
  private readonly IConfiguration _cfg;
  public AuthController(AppDb db, IConfiguration cfg) { _db = db; _cfg = cfg; }

  public record RegisterDto(string FullName, string Email, string Password, string? Role);
  public record LoginDto(string Email, string Password);

  [HttpPost("register")]
  public async Task<IActionResult> Register(RegisterDto dto) {
    if (await _db.Users.AnyAsync(u => u.Email == dto.Email)) return Conflict("Email already registered");
    var user = new User {
      FullName = dto.FullName,
      Email = dto.Email,
      Role = string.IsNullOrWhiteSpace(dto.Role) ? "Student" : dto.Role!,
      PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password)
    };
    _db.Users.Add(user);
    await _db.SaveChangesAsync();
    return Ok(new { user.Id, user.FullName, user.Email, user.Role });
  }

  [HttpPost("login")]
  public async Task<IActionResult> Login(LoginDto dto) {
    var user = await _db.Users.FirstOrDefaultAsync(u => u.Email == dto.Email);
    if (user is null || !BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash)) return Unauthorized("Invalid credentials");

    var jwt = _cfg.GetSection("Jwt");
    var claims = new[] {
      new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
      new Claim(JwtRegisteredClaimNames.Email, user.Email),
      new Claim(ClaimTypes.Name, user.FullName),
      new Claim(ClaimTypes.Role, user.Role)
    };
    var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwt["Key"]!));
    var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
    var token = new JwtSecurityToken(
      issuer: jwt["Issuer"], audience: jwt["Audience"],
      claims: claims, expires: DateTime.UtcNow.AddMinutes(int.Parse(jwt["ExpiresMinutes"]!)),
      signingCredentials: creds
    );
    var tokenStr = new JwtSecurityTokenHandler().WriteToken(token);
    return Ok(new { token = tokenStr, user = new { user.Id, user.FullName, user.Email, user.Role } });
  }
}
