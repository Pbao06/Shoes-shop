using Microsoft.AspNetCore.Mvc;
using src.Controllers;
using src.DTOs;
using src.Middleware;
using src.Services.AdminInterface;

namespace src.Controllers.Admin;

[ApiController]
[Route("api/admin/dashboard")]
public class AdminDashboardController : AdminBaseController
{
    private readonly IAdminDashboardService _dashboardService;

    public AdminDashboardController(IAdminDashboardService dashboardService)
    {
        _dashboardService = dashboardService;
    }

    [HttpGet("stats")]
    public async Task<IActionResult> GetStats()
    {
        var stats = await _dashboardService.GetStatsAsync();
        return Success(stats, "Lấy thống kê dashboard thành công");
    }
}
