namespace src.Models;

public class OrderItem
{
    public int Id { get; set; }
    public int OrderId { get; set; }
    public int ProductId { get; set; }
    public int ProductVariantId { get; set; }
    public int Quantity { get; set; }
    public decimal UnitPrice { get; set; }
    public decimal TotalPrice { get; set; }

    public Order? Order { get; set; }
    public Product? Product { get; set; }
    public ProductVariant? ProductVariant { get; set; }
}
