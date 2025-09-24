using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using MiniLms.Api.Data;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// 1) CORS
const string ViteDevCors = "ViteDevCors";
builder.Services.AddCors(options =>
{
    options.AddPolicy(ViteDevCors, policy =>
    {
        policy
            .WithOrigins("http://localhost:5173") // your Vite dev server
            .AllowAnyHeader()
            .AllowAnyMethod();
            // If you ever send cookies: add .AllowCredentials() and DO NOT use AllowAnyOrigin()
    });
});

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<AppDbContext>(opt =>
    opt.UseSqlite(builder.Configuration.GetConnectionString("Default")));

var jwt = builder.Configuration.GetSection("Jwt");
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(opts =>
    {
        opts.TokenValidationParameters = new()
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwt["Issuer"],
            ValidAudience = jwt["Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwt["Key"]!))
        };
    });

// Authorization
builder.Services.AddAuthorization();

var app = builder.Build();

app.UseSwagger();
app.UseSwaggerUI();

app.UseHttpsRedirection();

// 2) Enable CORS BEFORE auth/authorization
app.UseCors(ViteDevCors);

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// Optional: migrations + seed
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.Migrate();
    DbSeeder.Seed(db);
}

app.Run();
