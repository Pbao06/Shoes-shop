using src.DTOs;

namespace src.Services.Interface;

/// <summary>
/// Interface cho dịch vụ đơn hàng phía khách hàng.
/// </summary>
public interface IC_OrderService
{
    /// <summary>
    /// Tạo đơn hàng mới từ giỏ hàng của người dùng.
    /// </summary>
    /// <param name="userId">ID người dùng đang đặt hàng.</param>
    /// <param name="dto">Thông tin thanh toán: địa chỉ giao hàng và phương thức thanh toán.</param>
    /// <returns>Chi tiết đơn hàng vừa tạo.</returns>
    Task<OrderDto> CreateOrderAsync(int userId, CheckoutDto dto);

    /// <summary>
    /// Lấy chi tiết một đơn hàng theo ID (chỉ đơn hàng của chính người dùng đó).
    /// </summary>
    /// <param name="orderId">ID đơn hàng.</param>
    /// <param name="userId">ID người dùng sở hữu đơn hàng.</param>
    Task<OrderDto> GetOrderByIdAsync(int orderId, int userId);

    /// <summary>
    /// Lấy danh sách tất cả đơn hàng của một người dùng.
    /// </summary>
    /// <param name="userId">ID người dùng.</param>
    Task<List<OrderDto>> GetOrdersByUserAsync(int userId);

    /// <summary>
    /// Hủy đơn hàng nếu đơn hàng chưa được giao (restore lại tồn kho).
    /// </summary>
    /// <param name="orderId">ID đơn hàng cần hủy.</param>
    /// <param name="userId">ID người dùng sở hữu đơn hàng.</param>
    Task<OrderDto> CancelOrderAsync(int orderId, int userId);
}