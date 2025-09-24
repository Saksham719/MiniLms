// MiniLms.Api/Program.cs
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using MiniLms.Api.Data;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<AppDbContext>(opt =>
    opt.UseSqlite(builder.Configuration.GetConnectionString("Default")));

var jwt = builder.Configuration.GetSection("Jwt");
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(opts =>
    {
        opts.TokenValidationParameters = new Microsoft.IdentityModel.Tokens.TokenValidationParameters
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

builder.Services.AddAuthorization();

const string ViteDevCors = "ViteDevCors";

builder.Services.AddCors(options =>
{
    options.AddPolicy(ViteDevCors, policy =>
    {
        policy
            .WithOrigins("http://localhost:5173") // EXACT match to your Vite origin
            .AllowAnyHeader()                     // allows Content-Type: application/json, Authorization, etc.
            .AllowAnyMethod();                    // GET/POST/PUT/DELETE/OPTIONS
        // DO NOT call .AllowCredentials() unless you’re using cookies;
        // if you do, you cannot use AllowAnyOrigin()
    });
});


var app = builder.Build();

app.UseSwagger();
app.UseSwaggerUI();

app.UseHttpsRedirection();
app.UseCors(ViteDevCors);        // <--- put CORS BEFORE auth/authorization

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// optional: basic DB seed on first run
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.EnsureCreated();
    DbSeeder.Seed(db);
}

app.Run();
