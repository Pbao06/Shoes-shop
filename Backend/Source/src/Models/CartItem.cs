namespace src.Models;

public class CartItem
{
    public int Id { get; set; }
    public int CartId { get; set; }
    public int ProductVariantId { get; set; }
    public int Quantity { get; set; }
    public decimal UnitPrice { get; set; } // tổng giá 

    public Cart? Cart { get; set; }
    public ProductVariant? ProductVariant { get; set; }
}
