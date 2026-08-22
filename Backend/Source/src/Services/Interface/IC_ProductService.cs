using src.DTOs;
namespace src.Services.Interface
{
    public interface IC_ProductService
    {
        Task<List<ProductPublicDto>> GetPublicProductsAsync(string? category = null, string? sortBy = null, string? keyword = null, int page = 1, int pageSize = 12, int? categoryId = null, int? brandId = null);
        Task<ProductDetailDto?> GetProductDetailsAsync(int id);
    }
}