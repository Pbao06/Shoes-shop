using System.Collections.Generic;

namespace src.Models;

public class ProductVariant
{
    public int Id { get; set; }
    public int ProductId { get; set; }
    public int SizeId { get; set; }
    public string SKU { get; set; } = string.Empty;
    public int StockQuantity { get; set; }
    public decimal Price { get; set; }
    public decimal? SalePrice { get; set; }
    // public bool IsAvailable { get; set; } = true;

    public Product? Product { get; set; }
    public Size? Size { get; set; }
    public ICollection<CartItem> CartItems { get; set; } = new List<CartItem>();
    public ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
}
