using Microsoft.EntityFrameworkCore;
using src.Data;
using src.DTOs;
using src.Middleware;
using src.Models;
using src.Services.AdminInterface;

namespace src.Services.Admin;

public class BrandService : IBrandService
{
    private readonly ApplicationDbContext _context;

    public BrandService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<BrandDto>> GetAllAsync()
    {
        return await _context.Brands
            .AsNoTracking()
            .Select(b => new BrandDto
            {
                Id = b.Id,
                Name = b.Name,
                Description = b.Description,
                LogoUrl = b.LogoUrl,
                CreatedAt = b.CreatedAt
            })
            .ToListAsync();
    }

    public async Task<BrandDto?> GetByIdAsync(int id)
    {
        var brand = await _context.Brands
            .AsNoTracking()
            .FirstOrDefaultAsync(b => b.Id == id);

        if (brand is null) return null;

        return new BrandDto
        {
            Id = brand.Id,
            Name = brand.Name,
            Description = brand.Description,
            LogoUrl = brand.LogoUrl,
            CreatedAt = brand.CreatedAt
        };
    }

    public async Task<BrandDto> CreateAsync(CreateBrandDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Name))
            throw new ValidationError("Tên thương hiệu là bắt buộc.");

        var brand = new Brand
        {
            Name = dto.Name,
            Description = dto.Description,
            LogoUrl = dto.LogoUrl,
            CreatedAt = DateTime.UtcNow
        };

        _context.Brands.Add(brand);
        await _context.SaveChangesAsync();

        return new BrandDto
        {
            Id = brand.Id,
            Name = brand.Name,
            Description = brand.Description,
            LogoUrl = brand.LogoUrl,
            CreatedAt = brand.CreatedAt
        };
    }

    public async Task<BrandDto?> UpdateAsync(int id, BrandDto dto)
    {
        var brand = await _context.Brands.FirstOrDefaultAsync(b => b.Id == id);
        if (brand is null) return null;

        if (string.IsNullOrWhiteSpace(dto.Name))
            throw new ValidationError("Tên thương hiệu là bắt buộc.");

        brand.Name = dto.Name;
        brand.Description = dto.Description;
        brand.LogoUrl = dto.LogoUrl;

        await _context.SaveChangesAsync();

        dto.Id = brand.Id;
        return dto;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var brand = await _context.Brands
            .Include(b => b.Products)
            .FirstOrDefaultAsync(b => b.Id == id);

        if (brand is null) return false;

        if (brand.Products.Any())
            throw new ValidationError("Không thể xóa thương hiệu vì vẫn còn sản phẩm đang thuộc về thương hiệu này.");

        _context.Brands.Remove(brand);
        await _context.SaveChangesAsync();
        return true;
    }
}