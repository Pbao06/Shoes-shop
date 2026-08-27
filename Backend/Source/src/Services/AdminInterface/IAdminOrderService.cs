using src.DTOs;

namespace src.Services.AdminInterface;

public interface IAdminOrderService
{
    Task<List<AdminOrderDto>> GetAllAsync(string? status = null);
    Task<AdminOrderDetailDto?> GetByIdAsync(int orderId);
    Task<AdminOrderDetailDto?> UpdateStatusAsync(int orderId, UpdateOrderStatusDto dto);
}
