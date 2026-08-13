namespace src.DTOs;

/// <summary>
/// DTO trả về thông tin chi tiết của một đơn hàng cho người dùng.
/// </summary>
public class OrderDto
{
    public int Id { get; set; }
    public string OrderNumber { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public string PaymentStatus { get; set; } = string.Empty;
    public decimal Subtotal { get; set; }
    public decimal ShippingFee { get; set; }
    public decimal TotalAmount { get; set; }
    public DateTime CreatedAt { get; set; }
    public AddressDto? Address { get; set; }
    public List<OrderItemDto> Items { get; set; } = new();
}

/// <summary>
/// Thông tin địa chỉ giao hàng của đơn hàng.
/// </summary>
public class AddressDto
{
    public string RecipientName { get; set; } = string.Empty;
    public string PhoneNumber { get; set; } = string.Empty;
    public string Street { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public string State { get; set; } = string.Empty;
    public string PostalCode { get; set; } = string.Empty;
    public string Country { get; set; } = string.Empty;
}

/// <summary>
/// Thông tin từng sản phẩm trong đơn hàng.
/// </summary>
public class OrderItemDto
{
    public int ProductId { get; set; }
    public int ProductVariantId { get; set; }
    public string ProductName { get; set; } = string.Empty;
    public string SizeName { get; set; } = string.Empty;
    public int Quantity { get; set; }
    public decimal UnitPrice { get; set; }
    public decimal TotalPrice { get; set; }
}