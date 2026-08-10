using Microsoft.EntityFrameworkCore;
using src.Data;
using src.DTOs;
using src.Middleware;
using src.Models;
using src.Services.AdminInterface;

namespace src.Services.Admin;

public class CategoryService : ICategoryService
{
    private readonly ApplicationDbContext _context;

    public CategoryService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<CategoryDto>> GetAllAsync()
    {
        return await _context.Categories
            .AsNoTracking()
            .Select(c => new CategoryDto
            {
                Id = c.Id,
                Name = c.Name,
                Slug = c.Slug,
                Description = c.Description,
                CreatedAt = c.CreatedAt
            })
            .ToListAsync();
    }

    public async Task<CategoryDto?> GetByIdAsync(int id)
    {
        var category = await _context.Categories
            .AsNoTracking()
            .FirstOrDefaultAsync(c => c.Id == id);

        if (category is null) return null;

        return new CategoryDto
        {
            Id = category.Id,
            Name = category.Name,
            Slug = category.Slug,
            Description = category.Description,
            CreatedAt = category.CreatedAt
        };
    }

    public async Task<CategoryDto> CreateAsync(CreateCategoryDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Name))
            throw new ValidationError("Tên danh mục là bắt buộc.");

        var category = new Category
        {
            Name = dto.Name,
            Slug = string.IsNullOrWhiteSpace(dto.Slug) ? dto.Name.ToLower().Replace(" ", "-") : dto.Slug,
            Description = dto.Description,
            CreatedAt = DateTime.UtcNow
        };

        _context.Categories.Add(category);
        await _context.SaveChangesAsync();

        return new CategoryDto
        {
            Id = category.Id,
            Name = category.Name,
            Slug = category.Slug,
            Description = category.Description,
            CreatedAt = category.CreatedAt
        };
    }

    public async Task<CategoryDto?> UpdateAsync(int id, CategoryDto dto)
    {
        var category = await _context.Categories.FirstOrDefaultAsync(c => c.Id == id);
        if (category is null) return null;

        if (string.IsNullOrWhiteSpace(dto.Name))
            throw new ValidationError("Tên danh mục là bắt buộc.");

        category.Name = dto.Name;
        category.Slug = string.IsNullOrWhiteSpace(dto.Slug) ? dto.Name.ToLower().Replace(" ", "-") : dto.Slug;
        category.Description = dto.Description;

        await _context.SaveChangesAsync();

        dto.Id = category.Id;
        return dto;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var category = await _context.Categories
            .Include(c => c.Products)
            .FirstOrDefaultAsync(c => c.Id == id);

        if (category is null) return false;

        if (category.Products.Any())
            throw new ValidationError("Không thể xóa danh mục vì vẫn còn sản phẩm đang thuộc về danh mục này.");

        _context.Categories.Remove(category);
        await _context.SaveChangesAsync();
        return true;
    }
}
