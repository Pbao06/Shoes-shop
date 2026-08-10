using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using src.DTOs;
using src.Middleware;
using src.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace src.Services.Customer;

public class AuthService : IAuthService
{
    private readonly UserManager<User> _userManager;
    private readonly SignInManager<User> _signInManager;
    private readonly IConfiguration _configuration;

    public AuthService(
        UserManager<User> userManager,
        SignInManager<User> signInManager,
        IConfiguration configuration)
    {
        _userManager = userManager;
        _signInManager = signInManager;
        _configuration = configuration;
    }

    public async Task<RegisterResponseDto> RegisterAsync(RegisterDto model)
    {
        if (string.IsNullOrWhiteSpace(model.FirstName) || string.IsNullOrWhiteSpace(model.LastName))
        {
            throw new ValidationError("Họ và tên là bắt buộc.");
        }

        var existingUser = await _userManager.FindByEmailAsync(model.Email);
        if (existingUser is not null)
        {
            throw new ConflictError("Email đã tồn tại.");
        }

        var user = new User
        {
            UserName = model.Email,
            Email = model.Email,
            FirstName = model.FirstName,
            LastName = model.LastName,
            EmailConfirmed = true
        };

        var result = await _userManager.CreateAsync(user, model.Password);
        if (!result.Succeeded)
        {
            var errors = string.Join(" | ", result.Errors.Select(e => e.Description));
            throw new ValidationError(errors);
        }

        return new RegisterResponseDto
        {
            Message = "Đăng ký thành công",
            Email = user.Email ?? string.Empty
        };
    }

    public async Task<LoginResponseDto> LoginAsync(LoginDto model)
    {
        var user = await _userManager.FindByEmailAsync(model.Email);
        if (user is null)
        {
            throw new UnauthorizedError("Email hoặc mật khẩu không đúng.");
        }

        var result = await _signInManager.CheckPasswordSignInAsync(user, model.Password, lockoutOnFailure: false);
        if (!result.Succeeded)
        {
            throw new UnauthorizedError("Email hoặc mật khẩu không đúng.");
        }

        if (!user.IsActive)
        {
            throw new UnauthorizedError("Tài khoản đã bị khóa.");
        }

        var token = GenerateAccessToken(user);

        return new LoginResponseDto
        {
            Id = user.Id,
            UserName = user.UserName ?? string.Empty,
            Email = user.Email ?? string.Empty,
            Token = token
        };
    }

    public string GenerateAccessToken(User user)
    {
        var claims = new List<Claim>
        {
            new(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new(ClaimTypes.Name, user.UserName ?? string.Empty),
            new(ClaimTypes.Email, user.Email ?? string.Empty)
        };

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"] ?? "default-secret-key"));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: _configuration["Jwt:Issuer"],
            audience: _configuration["Jwt:Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddHours(1),
            signingCredentials: creds);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    public string GenerateRefreshToken()
    {
        var randomNumber = new byte[32];
        using var rng = System.Security.Cryptography.RandomNumberGenerator.Create();
        rng.GetBytes(randomNumber);
        return Convert.ToBase64String(randomNumber);
    }
}
