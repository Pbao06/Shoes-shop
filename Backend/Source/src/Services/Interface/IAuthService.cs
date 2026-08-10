using src.DTOs;

namespace src.Services;

public interface IAuthService
{
    Task<RegisterResponseDto> RegisterAsync(RegisterDto model);
    Task<LoginResponseDto> LoginAsync(LoginDto model);
}
