namespace src.DTOs;

public class AdminOrderDto
{
    public int Id { get; set; }
    public string OrderNumber { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public string PaymentStatus { get; set; } = string.Empty;
    public decimal TotalAmount { get; set; }
    public DateTime CreatedAt { get; set; }
    public string CustomerName { get; set; } = string.Empty;
    public string CustomerEmail { get; set; } = string.Empty;
    public int ItemCount { get; set; }
}

public class AdminOrderDetailDto : AdminOrderDto
{
    public AddressDto? ShippingAddress { get; set; }
    public List<AdminOrderItemDto> Items { get; set; } = new();
    public PaymentInfoDto? Payment { get; set; }
}

public class AdminOrderItemDto
{
    public int ProductId { get; set; }
    public string ProductName { get; set; } = string.Empty;
    public string SizeName { get; set; } = string.Empty;
    public int Quantity { get; set; }
    public decimal UnitPrice { get; set; }
    public decimal TotalPrice { get; set; }
}

public class PaymentInfoDto
{
    public int Id { get; set; }
    public string PaymentMethod { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public string? TransactionId { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class UpdateOrderStatusDto
{
    public string Status { get; set; } = string.Empty;
}
