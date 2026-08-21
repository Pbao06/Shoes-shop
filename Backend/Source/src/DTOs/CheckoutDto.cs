namespace src.DTOs;

/// <summary>
/// DTO nhận dữ liệu từ người dùng khi thanh toán (checkout).
/// Bao gồm thông tin địa chỉ giao hàng và phương thức thanh toán.
/// </summary>
public class CheckoutDto
{
    /// <summary>
    /// ID của địa chỉ có sẵn nếu người dùng chọn từ danh sách địa chỉ đã lưu.
    /// Nếu null, hệ thống sẽ tạo địa chỉ mới từ các trường bên dưới.
    /// </summary>
    public int? AddressId { get; set; }

    // ===== Thông tin địa chỉ giao hàng (dùng khi AddressId == null) =====
    public string? RecipientName { get; set; }
    public string? PhoneNumber { get; set; }
    public string? Street { get; set; }
    public string? City { get; set; }
    public string? State { get; set; }
    public string? PostalCode { get; set; }
    public string? Country { get; set; }

    /// <summary>
    /// Phương thức thanh toán: "COD", "CreditCard", "BankTransfer", v.v.
    /// </summary>
    public string PaymentMethod { get; set; } = "COD";

    // ===== Trường nhận từ Frontend (Checkout-page) =====
    // Frontend gửi họ và tên riêng biệt, Backend gộp thành RecipientName.
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    // Email người đặt (Frontend có thu thập, Backend chưa lưu vào Address).
    public string? Email { get; set; }
    // Địa chỉ đơn giản từ Frontend, tương ứng với Street.
    public string? Address { get; set; }
    // Phương thức thanh toán từ Frontend ('card', 'paypal', ...).
    public string? Payment { get; set; }
}