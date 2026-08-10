using src.DTOs;

namespace src.Services.Interface
{
    public interface IC_CartService
    {
        Task<CartDto> AddToCartAsync(int userId, AddToCartDto dto);
    }
}