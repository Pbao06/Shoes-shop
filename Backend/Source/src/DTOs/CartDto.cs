namespace src.DTOs;

public class CartDto
{
    public int Id { get; set; }
    public int TotalItems { get; set; } // Tổng số lượng món trong giỏ (để hiện cái badge đỏ trên icon giỏ hàng)
    public decimal TotalPrice { get; set; } // Tổng tiền phải trả
    public List<CartItemDto> Items { get; set; } = new();
}

public class CartItemDto
{
    public int Id { get; set; } // CartItemId để làm nút Xóa/Sửa
    public int ProductVariantId { get; set; }
    public string ProductName { get; set; } = string.Empty;
    public string? ProductImage { get; set; }
    public string SizeName { get; set; } = string.Empty;
    public decimal UnitPrice { get; set; }
    public int Quantity { get; set; }
    public decimal TotalPrice => UnitPrice * Quantity; // Giá thành tiền của dòng này
}