using System;

namespace src.Models;

public class ProductImage
{
    public int Id { get; set; }
    public int ProductId { get; set; }
    public string ImageUrl { get; set; } = string.Empty;
    public string? AltText { get; set; }
    public bool IsPrimary { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public Product? Product { get; set; }
}
