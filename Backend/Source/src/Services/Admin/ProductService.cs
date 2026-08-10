using Microsoft.EntityFrameworkCore;
using src.Data;
using src.DTOs;
using src.Middleware;
using src.Models;
using src.Services.AdminInterface;

namespace src.Services.Admin;

public class ProductService : IProductService
{
    private readonly ApplicationDbContext _context;

    public ProductService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<ProductDto>> GetAllAsync()
    {
        return await _context.Products
            .AsNoTracking()
            .Select(p => new ProductDto
            {
                Id = p.Id,
                Name = p.Name,
                Slug = p.Slug,
                Description = p.Description,
                Price = p.Price,
                SalePrice = p.SalePrice,
                IsActive = p.IsActive,
                BrandId = p.BrandId,
                CategoryId = p.CategoryId,
                CreatedAt = p.CreatedAt
            })
            .ToListAsync();
    }

    public async Task<ProductDto?> GetByIdAsync(int id)
    {
        var product = await _context.Products
            .AsNoTracking()
            .FirstOrDefaultAsync(p => p.Id == id);

        if (product is null) return null;

        return new ProductDto
        {
            Id = product.Id,
            Name = product.Name,
            Slug = product.Slug,
            Description = product.Description,
            Price = product.Price,
            SalePrice = product.SalePrice,
            IsActive = product.IsActive,
            BrandId = product.BrandId,
            CategoryId = product.CategoryId,
            CreatedAt = product.CreatedAt
        };
    }

    public async Task<ProductDto> CreateAsync(CreateProductDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Name))
            throw new ValidationError("Tên sản phẩm là bắt buộc.");

        if (dto.Price < 0)
            throw new ValidationError("Giá sản phẩm không hợp lệ.");

        var product = new Product
        {
            Name = dto.Name,
            Slug = string.IsNullOrWhiteSpace(dto.Slug) ? dto.Name.ToLower().Replace(" ", "-") : dto.Slug,
            Description = dto.Description,
            Price = dto.Price,
            SalePrice = dto.SalePrice,
            BrandId = dto.BrandId,
            CategoryId = dto.CategoryId,

        };

        _context.Products.Add(product);
        await _context.SaveChangesAsync();
        var dtoo= new ProductDto
        {
            Id=product.Id,
            Name=product.Name,
            Description=product.Description,
            Price=product.Price,
            SalePrice=product.SalePrice,
            BrandId=product.BrandId,
            CategoryId=product.CategoryId,
            IsActive= product.IsActive,
            CreatedAt=product.CreatedAt

        };
        return dtoo;
    }

    public async Task<ProductDto?> UpdateAsync(int id, ProductDto dto)
    {
        var product = await _context.Products.FirstOrDefaultAsync(p => p.Id == id);
        if (product is null) return null;

        if (string.IsNullOrWhiteSpace(dto.Name))
            throw new ValidationError("Tên sản phẩm là bắt buộc.");

        if (dto.Price < 0)
            throw new ValidationError("Giá sản phẩm không hợp lệ.");

        product.Name = dto.Name;
        product.Slug = string.IsNullOrWhiteSpace(dto.Slug) ? dto.Name.ToLower().Replace(" ", "-") : dto.Slug;
        product.Description = dto.Description;
        product.Price = dto.Price;
        product.SalePrice = dto.SalePrice;
        product.IsActive = dto.IsActive;
        product.BrandId = dto.BrandId;
        product.CategoryId = dto.CategoryId;

        await _context.SaveChangesAsync();

        dto.Id = product.Id;
        return dto;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var product = await _context.Products.FirstOrDefaultAsync(p => p.Id == id);
        if (product is null) return false;

        _context.Products.Remove(product);
        await _context.SaveChangesAsync();
        return true;
    }
}
