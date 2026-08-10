namespace src.DTOs;

public class AddToCartDto
{
    public int ProductVariantId { get; set; } // ID của biến thể (size, màu cụ thể)
    public int Quantity { get; set; }         // Số lượng muốn mua (ví dụ: 1, 2...)
}