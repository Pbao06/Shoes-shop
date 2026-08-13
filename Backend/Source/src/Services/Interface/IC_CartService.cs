using src.DTOs;

namespace src.Services.Interface
{
    public interface IC_CartService
    {
        Task<CartDto> GetCartAsync(int userId);
        Task<CartDto> AddToCartAsync(int userId, AddToCartDto dto);
        Task<CartDto> UpdateItemAsync(int userId, int cartItemId, int quantity);
        Task RemoveItemAsync(int userId, int cartItemId);
        Task ClearCartAsync(int userId);
    }
}