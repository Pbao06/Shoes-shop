namespace src.DTOs;
public class CreateProductDto
{
    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string? Description { get; set; }
    public decimal Price { get; set; }
    public decimal? SalePrice { get; set; }
    public int BrandId { get; set; }
    public int CategoryId { get; set; }
}
public class ProductDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string? Description { get; set; }
    public decimal Price { get; set; }
    public decimal? SalePrice { get; set; }
    public bool IsActive { get; set; } = true;
    public int BrandId { get; set; }
    public int CategoryId { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
public class ProductPublicDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string? Description { get; set; }
    public decimal Price { get; set; }
    public decimal? SalePrice { get; set; }
    public string? BrandName { get; set; }
    public string? CategoryName { get; set; }
    public int TotalStock { get; set; }
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class ProductDetailDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string? Description { get; set; }
    public decimal Price { get; set; }
    public decimal? SalePrice { get; set; }
    public string? BrandName { get; set; }
    public string? CategoryName { get; set; }
    public int TotalStock { get; set; }
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }
    public List<ProductImageDto> Images { get; set; } = new();
    public List<ProductVariantDto> Variants { get; set; } = new();
    public List<ReviewDto> Reviews { get; set; } = new();
    public double AverageRating { get; set; }
}

public class ProductImageDto
{
    public int Id { get; set; }
    public string ImageUrl { get; set; } = string.Empty;
    public string? AltText { get; set; }
    public bool IsPrimary { get; set; }
}

public class ProductVariantDto
{
    public int Id { get; set; }
    public int SizeId { get; set; }
    public string SizeName { get; set; } = string.Empty;
    public string SKU { get; set; } = string.Empty;
    public int StockQuantity { get; set; }
    public decimal Price { get; set; }
    public decimal? SalePrice { get; set; }
}

public class ReviewDto
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public string? UserName { get; set; }
    public int Rating { get; set; }
    public string? Comment { get; set; }
    public DateTime CreatedAt { get; set; }
}

