using src.DTOs;
using src.Models;

namespace src.Services.AdminInterface;

public interface IProductService
{
    Task<List<ProductDto>> GetAllAsync();
    Task<ProductDto?> GetByIdAsync(int id);
    Task<ProductDto> CreateAsync(CreateProductDto dto);
    Task<ProductDto?> UpdateAsync(int id, ProductDto dto);
    Task<bool> DeleteAsync(int id);

    // Product Variants
    Task<List<ProductVariantDto>> GetVariantsAsync(int productId);
    Task<ProductVariantDto?> GetVariantByIdAsync(int variantId);
    Task<ProductVariantDto> CreateVariantAsync(int productId, CreateProductVariantDto dto);
    Task<ProductVariantDto?> UpdateVariantAsync(int variantId, UpdateProductVariantDto dto);
    Task<bool> DeleteVariantAsync(int variantId);
    Task<List<Size>> GetAllSizesAsync();

    // Product Images
    Task<List<ProductImageDto>> GetImagesAsync(int productId);
    Task<ProductImageDto> UploadImageAsync(int productId, IFormFile file, string? altText);
    Task<bool> DeleteImageAsync(int imageId);
    Task<ProductImageDto?> SetPrimaryImageAsync(int imageId);
}
