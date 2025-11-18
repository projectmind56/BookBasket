using backend.Context;
using backend.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Add services
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// JWT setup
var issuer = "https://www.EXAMPLE.com/";
var audience = "InvigilationDutyManagementSystem";
var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("tfgusjhabdfy-yuawzsdfji-iowjhekcf-fgyuhjkhgvtfgyuhb-5678fghj"));

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidIssuer = issuer,
        ValidAudience = audience,
        IssuerSigningKey = key,
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateIssuerSigningKey = true,
        ValidateLifetime = true,
        ClockSkew = TimeSpan.Zero,
        RoleClaimType = ClaimTypes.Role,
        NameClaimType = ClaimTypes.NameIdentifier
    };
});

builder.Services.AddAuthorization();

// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        policy =>
        {
            policy.WithOrigins("http://localhost:5173")
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});

// Database
const string connectionString =
    "Data Source=PTPLL512;TrustServerCertificate=True;Integrated Security=True;Initial Catalog=BookBasket;";

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(connectionString));

// Add custom services
builder.Services.AddScoped<StudentService>();
builder.Services.AddScoped<AdminService>();
builder.Services.AddScoped<DonorService>();

var app = builder.Build();

// Ensure wwwroot exists
var wwwRoot = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
if (!Directory.Exists(wwwRoot))
{
    Directory.CreateDirectory(wwwRoot);
    Directory.CreateDirectory(Path.Combine(wwwRoot, "uploads", "covers"));
    Directory.CreateDirectory(Path.Combine(wwwRoot, "uploads", "ebooks"));
}

// Middleware
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors("AllowFrontend");
app.UseAuthentication();
app.UseAuthorization();
app.UseStaticFiles(); // Serve wwwroot

app.MapControllers();

// Redirect root to Swagger
app.MapGet("/", context =>
{
    context.Response.Redirect("/swagger");
    return Task.CompletedTask;
});

app.Run();