using src.DTOs;

namespace src.Services.AdminInterface;

public interface ICategoryService
{
    Task<List<CategoryDto>> GetAllAsync();
    Task<CategoryDto?> GetByIdAsync(int id);
    Task<CategoryDto> CreateAsync(CreateCategoryDto dto);
    Task<CategoryDto?> UpdateAsync(int id, CategoryDto dto);
    Task<bool> DeleteAsync(int id);
}
