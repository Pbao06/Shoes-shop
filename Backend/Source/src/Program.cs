using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Pomelo.EntityFrameworkCore.MySql.Infrastructure;
using Microsoft.OpenApi.Models;
using src.Data;
using src.Middleware;
using src.Models;
using src.Services;
using src.Services.AdminInterface;
using src.Services.Admin;
using src.Services.Customer;
using src.Services.Interface;
using Microsoft.Extensions.DependencyInjection;
using MySqlConnector;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

// Allow the Next.js frontend (http://localhost:3000) to call this API
// cross-origin during development.
builder.Services.AddCors(options =>
{
    options.AddPolicy("FrontendDev", policy =>
    {
        policy.WithOrigins("http://localhost:3000", "https://shoes-shop-bice.vercel.app")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo { Title = "Shoes API", Version = "v1" });

    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "Nhập token JWT theo định dạng: Bearer {token}"
    });

    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

builder.Services.AddIdentity<User, IdentityRole<int>>()
    .AddEntityFrameworkStores<ApplicationDbContext>()
    .AddDefaultTokenProviders();

var connectionString = "Server=todoapp-mysql-phangia223-d258.l.aivencloud.com;Port=20487;Database=Shoes;Uid=avnadmin;Pwd=AVNS_s_UdKoxSIQUY-qsHeyI;SslMode=Required;AllowPublicKeyRetrieval=True;";

MySqlConnectionStringBuilder csb = new MySqlConnectionStringBuilder(connectionString)
{
    SslMode = MySqlSslMode.Required,
    AllowPublicKeyRetrieval = true,
    SslCa = string.Empty
};
connectionString = csb.ConnectionString;

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseMySql(connectionString, new MySqlServerVersion(new Version(8, 4, 8))));

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = builder.Configuration["Jwt:Issuer"],
        ValidAudience = builder.Configuration["Jwt:Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"] ?? "default-secret-key"))
    };
});

builder.Services.AddHttpContextAccessor();

builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IProductService, ProductService>();
builder.Services.AddScoped<ICategoryService, CategoryService>();
builder.Services.AddScoped<IBrandService,BrandService>();
builder.Services.AddScoped<IAdminOrderService, AdminOrderService>();
builder.Services.AddScoped<IAdminDashboardService, AdminDashboardService>();
// customer api 
builder.Services.AddScoped<IC_ProductService,C_ProductService>();
builder.Services.AddScoped<IC_CartService,C_CartService>();
builder.Services.AddScoped<IC_OrderService,C_OrderService>();
// builder.Services.AddScoped<IC_CartItemService,C_CartItemService>();

var app = builder.Build();

app.UseMiddleware<ExceptionMiddleware>();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Only redirect to HTTPS when an HTTPS port is actually configured.
// When running with the "http" launch profile (no HTTPS port), this
// middleware would fail to determine the redirect port and could
// interfere with HTTP-only API calls from the frontend.
if (!string.IsNullOrEmpty(builder.Configuration["HttpsPort"]))
{
    app.UseHttpsRedirection();
}
app.UseStaticFiles();
app.UseCors("FrontendDev");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

// Tự động Seed dữ liệu mẫu khi khởi chạy (bỏ qua nếu DB đã có sản phẩm)
// using (var scope = app.Services.CreateScope())
// {
//     var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
//     var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole<int>>>();
//     var userManager = scope.ServiceProvider.GetRequiredService<UserManager<User>>();
//     await context.Database.EnsureCreatedAsync();
//     await DbSeeder.SeedAsync(context, roleManager, userManager);
// }

app.Run();


