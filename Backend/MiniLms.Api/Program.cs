using System.Text;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using MiniLms.Api.Data;

var builder = WebApplication.CreateBuilder(args);

// DB
builder.Services.AddDbContext<AppDb>(o =>
  o.UseSqlite(builder.Configuration.GetConnectionString("Default"))
);

// JSON enum names
builder.Services.ConfigureHttpJsonOptions(opts => {
  opts.SerializerOptions.Converters.Add(new JsonStringEnumConverter());
});

// CORS for Vite dev server
builder.Services.AddCors(opt => opt.AddDefaultPolicy(p =>
  p.WithOrigins("http://localhost:5173").AllowAnyHeader().AllowAnyMethod()
));

// AuthN (JWT)
var jwt = builder.Configuration.GetSection("Jwt");
var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwt["Key"]!));

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
  .AddJwtBearer(o => {
    o.TokenValidationParameters = new TokenValidationParameters {
      ValidateIssuer = true,
      ValidateAudience = true,
      ValidateIssuerSigningKey = true,
      ValidateLifetime = true,
      ValidIssuer = jwt["Issuer"],
      ValidAudience = jwt["Audience"],
      IssuerSigningKey = key
    };
  });

builder.Services.AddAuthorization();
builder.Services.AddControllers();

var app = builder.Build();

// Seed at startup
using (var scope = app.Services.CreateScope()) {
  var db = scope.ServiceProvider.GetRequiredService<AppDb>();
  Seed.Ensure(db);
}

app.UseCors();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.Run();
