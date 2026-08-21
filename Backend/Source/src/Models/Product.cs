using System.Collections.Generic;

namespace src.Models;

public class Product
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string? Description { get; set; }
    public decimal Price { get; set; }
    public decimal? SalePrice { get; set; }
    public string? Color { get; set; }
    public bool IsActive { get; set; } = true;
    public int BrandId { get; set; }
    public int CategoryId { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public Brand? Brand { get; set; }
    public Category? Category { get; set; }
    public ICollection<ProductVariant> Variants { get; set; } = new List<ProductVariant>();
    public ICollection<ProductImage> Images { get; set; } = new List<ProductImage>();
    public ICollection<Review> Reviews { get; set; } = new List<Review>();
    public ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
}
