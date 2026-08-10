using src.DTOs;

namespace src.Services.AdminInterface;

public interface IBrandService
{
    Task<List<BrandDto>> GetAllAsync();
    Task<BrandDto?> GetByIdAsync(int id);
    Task<BrandDto> CreateAsync(CreateBrandDto dto);
    Task<BrandDto?> UpdateAsync(int id, BrandDto dto);
    Task<bool> DeleteAsync(int id);
}