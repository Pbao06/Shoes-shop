using src.DTOs;

namespace src.Services.AdminInterface;

public interface IProductService
{
    Task<List<ProductDto>> GetAllAsync();
    Task<ProductDto?> GetByIdAsync(int id);
    Task<ProductDto> CreateAsync(CreateProductDto dto);
    Task<ProductDto?> UpdateAsync(int id, ProductDto dto);
    Task<bool> DeleteAsync(int id);
}
