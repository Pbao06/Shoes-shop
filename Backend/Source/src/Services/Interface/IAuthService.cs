using src.DTOs;
using src.Models;

namespace src.Services;

public interface IAuthService
{
    Task<RegisterResponseDto> RegisterAsync(RegisterDto model);
    Task<LoginResponseDto> LoginAsync(LoginDto model);
    Task<string> GenerateAccessToken(User user);
}
