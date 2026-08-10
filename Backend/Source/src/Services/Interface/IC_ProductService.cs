using src.DTOs;
namespace src.Services.Interface
{
    public interface IC_ProductService
    {
        Task<List<ProductPublicDto>> GetPublicProductsAsync();
        Task<ProductDetailDto?> GetProductDetailsAsync(int id);
    }
}