using Microsoft.AspNetCore.Mvc;
using src.DTOs;
using src.Services.Interface;

namespace src.Controllers.Customer
{
    [ApiController]
    [Route("api/cart")]
    public class C_CartController : BaseController
    {
        private readonly IC_CartService _cartService;

        public C_CartController(IC_CartService cartService)
        {
            _cartService = cartService;
        }

        [HttpGet("{userId:int}")]
        public async Task<IActionResult> GetCart(int userId)
        {
            var cart = await _cartService.GetCartAsync(userId);
            return Success(cart, "Lấy giỏ hàng thành công");
        }

        [HttpPost("{userId:int}/add")]
        public async Task<IActionResult> AddToCart(int userId, [FromBody] AddToCartDto dto)
        {
            var cart = await _cartService.AddToCartAsync(userId, dto);
            return Success(cart, "Thêm sản phẩm vào giỏ hàng thành công", 201);
        }

        [HttpPut("{userId:int}/items/{cartItemId:int}")]
        public async Task<IActionResult> UpdateItem(int userId, int cartItemId, [FromBody] int quantity)
        {
            var cart = await _cartService.UpdateItemAsync(userId, cartItemId, quantity);
            return Success(cart, "Cập nhật giỏ hàng thành công");
        }

        [HttpDelete("{userId:int}/items/{cartItemId:int}")]
        public async Task<IActionResult> RemoveItem(int userId, int cartItemId)
        {
            await _cartService.RemoveItemAsync(userId, cartItemId);
            return Success(new { }, "Xóa sản phẩm khỏi giỏ hàng thành công");
        }

        [HttpDelete("{userId:int}/clear")]
        public async Task<IActionResult> ClearCart(int userId)
        {
            await _cartService.ClearCartAsync(userId);
            return Success(new { }, "Xóa toàn bộ giỏ hàng thành công");
        }
    }
}