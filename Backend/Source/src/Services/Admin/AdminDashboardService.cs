using Microsoft.EntityFrameworkCore;
using src.Data;
using src.DTOs;
using src.Middleware;
using src.Models;
using src.Services.AdminInterface;

namespace src.Services.Admin;

public class AdminDashboardService : IAdminDashboardService
{
    private readonly ApplicationDbContext _context;

    public AdminDashboardService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<DashboardStatsDto> GetStatsAsync()
    {
        var totalOrders = await _context.Orders.CountAsync();
        var totalProducts = await _context.Products.CountAsync();
        var totalUsers = await _context.Users.CountAsync();
        var pendingOrders = await _context.Orders.CountAsync(o => o.Status == "Pending");
        var totalRevenue = await _context.Payments
            .Where(p => p.Status == "Paid")
            .SumAsync(p => p.Amount);

        var recentOrders = await _context.Orders
            .AsNoTracking()
            .Include(o => o.User)
            .OrderByDescending(o => o.CreatedAt)
            .Take(5)
            .ToListAsync();

        return new DashboardStatsDto
        {
            TotalOrders = totalOrders,
            TotalProducts = totalProducts,
            TotalUsers = totalUsers,
            TotalRevenue = totalRevenue,
            PendingOrders = pendingOrders,
            RecentOrders = recentOrders.Select(o => new RecentOrderDto
            {
                Id = o.Id,
                OrderNumber = o.OrderNumber,
                CustomerName = o.User != null ? $"{o.User.FirstName} {o.User.LastName}".Trim() : string.Empty,
                TotalAmount = o.TotalAmount,
                Status = o.Status,
                CreatedAt = o.CreatedAt
            }).ToList()
        };
    }
}
