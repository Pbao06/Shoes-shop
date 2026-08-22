// Empty file to start analysis - will be filled in later
using Microsoft.EntityFrameworkCore;
using src.Data;
using src.Models;
using src.Services.Interface;
using src.DTOs;

namespace src.Services.Customer;

public class C_ProductService:IC_ProductService
{
    private readonly ApplicationDbContext _context;

    public C_ProductService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<ProductPublicDto>> GetPublicProductsAsync(string? category = null, string? sortBy = null, string? keyword = null, int page = 1, int pageSize = 12, int? categoryId = null, int? brandId = null)
{
    var query = _context.Products
        .AsNoTracking()
        .Where(p => p.IsActive)
        .Include(p => p.Category)
        .Include(p => p.Brand)
        .Include(p => p.Images)
        .Include(p => p.Variants)
            .ThenInclude(v => v.Size)
        .AsQueryable();

    // 1. Lọc theo Category
    if (!string.IsNullOrEmpty(category) && category != "All")
    {
        query = query.Where(p => p.Category != null && p.Category.Name == category);
    }

    // 1.1 Lọc theo CategoryId / BrandId (từ trang Shop của Frontend)
    if (categoryId.HasValue)
    {
        query = query.Where(p => p.CategoryId == categoryId.Value);
    }

    if (brandId.HasValue)
    {
        query = query.Where(p => p.BrandId == brandId.Value);
    }

    // 1.1 Tìm kiếm theo từ khóa (không phân biệt hoa thường) trên Name, Brand.Name, Category.Name
    if (!string.IsNullOrWhiteSpace(keyword))
    {
        var kw = keyword.ToLower();
        query = query.Where(p =>
            (p.Name != null && p.Name.ToLower().Contains(kw)) ||
            (p.Brand != null && p.Brand.Name != null && p.Brand.Name.ToLower().Contains(kw)) ||
            (p.Category != null && p.Category.Name != null && p.Category.Name.ToLower().Contains(kw)));
    }

    // 2. Sắp xếp theo giá số (decimal) hoặc mới nhất
    query = sortBy switch
    {
        "Price: low to high" => query.OrderBy(p => p.SalePrice ?? p.Price),
        "Price: high to low" => query.OrderByDescending(p => p.SalePrice ?? p.Price),
        _ => query.OrderByDescending(p => p.CreatedAt)
    };

    // 3. Phân trang
    var products = await query
        .Skip((page - 1) * pageSize)
        .Take(pageSize)
        .ToListAsync();

    // 4. Map dữ liệu trả về DTO
    return products.Select(p => new ProductPublicDto
    {
        Id = p.Id,
        Name = p.Name,
        Slug = p.Slug,
        Description = p.Description,
        Price = p.Price,
        SalePrice = p.SalePrice,
        BrandName = p.Brand?.Name,
        CategoryName = p.Category?.Name,
        PrimaryImageUrl = p.Images.OrderByDescending(i => i.IsPrimary).Select(i => i.ImageUrl).FirstOrDefault(),
        PrimaryImageAlt = p.Images.OrderByDescending(i => i.IsPrimary).Select(i => i.AltText).FirstOrDefault(),
        TotalStock = p.Variants.Sum(v => v.StockQuantity),
        IsActive = p.IsActive,
        CreatedAt = p.CreatedAt,
        Brand = p.Brand?.Name ?? string.Empty,
        Category = p.Category?.Name ?? string.Empty,
        Color = p.Color,
        Image = p.Images.OrderByDescending(i => i.IsPrimary).Select(i => i.ImageUrl).FirstOrDefault(),
        Sizes = p.Variants.Select(v => v.Size?.Name ?? string.Empty).Where(s => !string.IsNullOrEmpty(s)).Distinct().ToList(),
        Gallery = p.Images.OrderByDescending(i => i.IsPrimary).Select(i => i.ImageUrl).ToList()
    }).ToList();
}

    public async Task<ProductDetailDto?> GetProductDetailsAsync(int id)
    {
        var product = await _context.Products
            .AsNoTracking()
            .Where(p => p.Id == id && p.IsActive)
            .Include(p => p.Category)
            .Include(p => p.Brand)
            .Include(p => p.Variants)
                .ThenInclude(v => v.Size)
            .Include(p => p.Images)
            .Include(p => p.Reviews)
                .ThenInclude(r => r.User)
            .FirstOrDefaultAsync();

        if (product == null)
            return null;

        return new ProductDetailDto
        {
            Id = product.Id,
            Name = product.Name,
            Slug = product.Slug,
            Description = product.Description,
            Price = product.Price,
            SalePrice = product.SalePrice,
            BrandName = product.Brand?.Name,
            CategoryName = product.Category?.Name,
            TotalStock = product.Variants.Sum(v => v.StockQuantity),
            IsActive = product.IsActive,
            CreatedAt = product.CreatedAt,
            Images = product.Images
                .OrderByDescending(i => i.IsPrimary)
                .Select(i => new ProductImageDto
                {
                    Id = i.Id,
                    ImageUrl = i.ImageUrl,
                    AltText = i.AltText,
                    IsPrimary = i.IsPrimary
                })
                .ToList(),
            Variants = product.Variants.Select(v => new ProductVariantDto
            {
                Id = v.Id,
                SizeId = v.SizeId,
                SizeName = v.Size?.Name ?? string.Empty,
                SKU = v.SKU,
                StockQuantity = v.StockQuantity,
                Price = v.Price,
                SalePrice = v.SalePrice
            }).ToList(),
            Reviews = product.Reviews.Select(r => new ReviewDto
            {
                Id = r.Id,
                UserId = r.UserId,
                UserName = string.IsNullOrEmpty(r.User?.FirstName) && string.IsNullOrEmpty(r.User?.LastName)
                    ? r.User?.UserName
                    : $"{r.User?.FirstName} {r.User?.LastName}".Trim(),
                Rating = r.Rating,
                Comment = r.Comment,
                CreatedAt = r.CreatedAt
            }).ToList(),
            AverageRating = product.Reviews.Count > 0
                ? product.Reviews.Average(r => r.Rating)
                : 0,
            Brand = product.Brand?.Name ?? string.Empty,
            Category = product.Category?.Name ?? string.Empty,
            PriceDisplay = FormatPrice(product.SalePrice ?? product.Price),
            Color = product.Color,
            Image = product.Images.OrderByDescending(i => i.IsPrimary).Select(i => i.ImageUrl).FirstOrDefault(),
            Sizes = product.Variants.Select(v => v.Size?.Name ?? string.Empty).Where(s => !string.IsNullOrEmpty(s)).Distinct().ToList(),
            Gallery = product.Images.OrderByDescending(i => i.IsPrimary).Select(i => i.ImageUrl).ToList()
        };
    }

    private static string FormatPrice(decimal price)
    {
        return $"${price:0}";
    }
}


