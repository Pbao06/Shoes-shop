using src.DTOs;

namespace src.Services.AdminInterface;

public interface IAdminDashboardService
{
    Task<DashboardStatsDto> GetStatsAsync();
}
