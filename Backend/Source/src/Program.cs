using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using src.Data;
using src.Middleware;
using src.Models;
using src.Services;
using src.Services.AdminInterface;
using src.Services.Admin;
using src.Services.Customer;
using src.Services.Interface;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

// Cấu hình CORS cho Next.js Vercel
builder.Services.AddCors(options =>
{
    options.AddPolicy("FrontendDev", policy =>
    {
        policy.WithOrigins(
                "http://localhost:3000",
                "https://shoes-shop-bice.vercel.app",
                "https://shoes-shop-git-main-pbao06s-projects.vercel.app"
              )
              .AllowAnyHeader()
              .AllowAnyMethod()
              .SetIsOriginAllowedToAllowWildcardSubdomains()
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

// Chuỗi kết nối chuẩn cho Aiven (giữ nguyên SslMode=Required)
var connectionString = "Server=todoapp-mysql-phangia223-d258.l.aivencloud.com;Port=20487;Database=Shoes;Uid=avnadmin;Pwd=AVNS_s_UdKoxSIQUY-qsHeyI;SslMode=Required;AllowPublicKeyRetrieval=True;Pooling=false;";

// FIX 1: Ép cứng phiên bản MySQL 8.0 thay vì dùng AutoDetect (Tránh lỗi bắt tay 0x0A / 0x0B)
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseMySql(connectionString, ServerVersion.Parse("8.0.30-mysql")));

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
builder.Services.AddScoped<IBrandService, BrandService>();
builder.Services.AddScoped<IAdminOrderService, AdminOrderService>();
builder.Services.AddScoped<IAdminDashboardService, AdminDashboardService>();

// customer api 
builder.Services.AddScoped<IC_ProductService, C_ProductService>();
builder.Services.AddScoped<IC_CartService, C_CartService>();
builder.Services.AddScoped<IC_OrderService, C_OrderService>();

var app = builder.Build();

app.UseMiddleware<ExceptionMiddleware>();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.UseSwagger();
    app.UseSwaggerUI();
}

if (!string.IsNullOrEmpty(builder.Configuration["HttpsPort"]))
{
    app.UseHttpsRedirection();
}

app.UseStaticFiles();
app.UseCors("FrontendDev");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

// FIX 2: Mở comment để tự động tạo bảng trong Database khi deploy lên Render
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    
    // Áp dụng các file Migration để tạo bảng (AspNetUsers, Products...)
    context.Database.Migrate(); 
    
    // Nếu bạn muốn chạy data mẫu (Seed) thì mở comment 3 dòng dưới này ra
    // var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole<int>>>();
    // var userManager = scope.ServiceProvider.GetRequiredService<UserManager<User>>();
    // await DbSeeder.SeedAsync(context, roleManager, userManager);
}

app.Run();