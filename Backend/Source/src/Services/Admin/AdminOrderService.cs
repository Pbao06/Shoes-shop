using Microsoft.EntityFrameworkCore;
using src.Data;
using src.DTOs;
using src.Middleware;
using src.Models;
using src.Services.AdminInterface;

namespace src.Services.Admin;

public class AdminOrderService : IAdminOrderService
{
    private readonly ApplicationDbContext _context;

    public AdminOrderService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<AdminOrderDto>> GetAllAsync(string? status = null)
    {
        var query = _context.Orders
            .AsNoTracking()
            .Include(o => o.User)
            .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Product)
            .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.ProductVariant)
                    .ThenInclude(v => v!.Size)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(status))
        {
            query = query.Where(o => o.Status == status);
        }

        var orders = await query
            .OrderByDescending(o => o.CreatedAt)
            .ToListAsync();

        return orders.Select(MapToAdminOrderDto).ToList();
    }

    public async Task<AdminOrderDetailDto?> GetByIdAsync(int orderId)
    {
        var order = await _context.Orders
            .AsNoTracking()
            .Include(o => o.User)
            .Include(o => o.Address)
            .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Product)
                    .ThenInclude(p => p.Images)
            .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.ProductVariant)
                    .ThenInclude(v => v!.Size)
            .Include(o => o.Payments)
            .FirstOrDefaultAsync(o => o.Id == orderId);

        if (order is null) return null;

        var dto = MapToAdminOrderDetailDto(order);
        dto.Payment = order.Payments.FirstOrDefault() is Payment payment ? new PaymentInfoDto
        {
            Id = payment.Id,
            PaymentMethod = payment.PaymentMethod,
            Status = payment.Status,
            Amount = payment.Amount,
            TransactionId = payment.TransactionId,
            CreatedAt = payment.CreatedAt
        } : null;

        return dto;
    }

    public async Task<AdminOrderDetailDto?> UpdateStatusAsync(int orderId, UpdateOrderStatusDto dto)
    {
        var order = await _context.Orders
            .Include(o => o.User)
            .Include(o => o.Address)
            .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Product)
            .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.ProductVariant)
                    .ThenInclude(v => v!.Size)
            .Include(o => o.Payments)
            .FirstOrDefaultAsync(o => o.Id == orderId);

        if (order is null) return null;

        if (order.Status == "Shipped" || order.Status == "Completed" || order.Status == "Cancelled")
        {
            throw new ValidationError("Không thể thay đổi trạng thái đơn hàng đã giao hoặc đã kết thúc.");
        }

        order.Status = dto.Status;
        await _context.SaveChangesAsync();

        return MapToAdminOrderDetailDto(order);
    }

    private static AdminOrderDto MapToAdminOrderDto(Order order)
    {
        return new AdminOrderDto
        {
            Id = order.Id,
            OrderNumber = order.OrderNumber,
            Status = order.Status,
            PaymentStatus = order.PaymentStatus,
            TotalAmount = order.TotalAmount,
            CreatedAt = order.CreatedAt,
            CustomerName = order.User != null ? $"{order.User.FirstName} {order.User.LastName}".Trim() : string.Empty,
            CustomerEmail = order.User?.Email ?? string.Empty,
            ItemCount = order.OrderItems.Sum(oi => oi.Quantity)
        };
    }

    private static AdminOrderDetailDto MapToAdminOrderDetailDto(Order order)
    {
        return new AdminOrderDetailDto
        {
            Id = order.Id,
            OrderNumber = order.OrderNumber,
            Status = order.Status,
            PaymentStatus = order.PaymentStatus,
            TotalAmount = order.TotalAmount,
            CreatedAt = order.CreatedAt,
            CustomerName = order.User != null ? $"{order.User.FirstName} {order.User.LastName}".Trim() : string.Empty,
            CustomerEmail = order.User?.Email ?? string.Empty,
            ItemCount = order.OrderItems.Sum(oi => oi.Quantity),
            ShippingAddress = order.Address == null ? null : new AddressDto
            {
                RecipientName = order.Address.RecipientName,
                PhoneNumber = order.Address.PhoneNumber,
                Street = order.Address.Street,
                City = order.Address.City,
                State = order.Address.State,
                PostalCode = order.Address.PostalCode,
                Country = order.Address.Country,
                Email = order.User?.Email
            },
            Items = order.OrderItems.Select(oi => new AdminOrderItemDto
            {
                ProductId = oi.ProductId,
                ProductName = oi.Product?.Name ?? string.Empty,
                SizeName = oi.ProductVariant?.Size?.Name ?? string.Empty,
                Quantity = oi.Quantity,
                UnitPrice = oi.UnitPrice,
                TotalPrice = oi.TotalPrice
            }).ToList()
        };
    }
}
