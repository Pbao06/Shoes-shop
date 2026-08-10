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

    public async Task<List<ProductPublicDto>> GetPublicProductsAsync()
    {
        var products = await _context.Products
            .AsNoTracking()
            .Where(p => p.IsActive)
            .Include(p => p.Category)
            .Include(p => p.Brand)
            .Include(p => p.Variants)
            .OrderByDescending(p => p.CreatedAt)
            .ToListAsync();
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
            TotalStock = p.Variants.Sum(v => v.StockQuantity),
            IsActive = p.IsActive,
            CreatedAt = p.CreatedAt
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
            
        };
    }
}


