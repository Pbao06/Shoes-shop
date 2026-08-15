using Microsoft.AspNetCore.Mvc;
using src.DTOs;
using src.Services.Interface;

namespace src.Controllers.Customer
{
    [ApiController]
    [Route("api/orders")]
    public class C_OrderController : BaseController
    {
        private readonly IC_OrderService _orderService;

        public C_OrderController(IC_OrderService orderService)
        {
            _orderService = orderService;
        }

        [HttpPost("{userId:int}")]
        public async Task<IActionResult> CreateOrder(int userId, [FromBody] CheckoutDto dto)
        {
            var order = await _orderService.CreateOrderAsync(userId, dto);
            return Success(order, "Tạo đơn hàng thành công", 201);
        }

        [HttpGet("{orderId:int}/user/{userId:int}")]
        public async Task<IActionResult> GetOrderById(int orderId, int userId)
        {
            var order = await _orderService.GetOrderByIdAsync(orderId, userId);
            return Success(order, "Lấy chi tiết đơn hàng thành công");
        }

        [HttpGet("user/{userId:int}")]
        public async Task<IActionResult> GetOrdersByUser(int userId)
        {
            var orders = await _orderService.GetOrdersByUserAsync(userId);
            return Success(orders, "Lấy danh sách đơn hàng thành công");
        }

        [HttpPost("{orderId:int}/cancel/user/{userId:int}")]
        public async Task<IActionResult> CancelOrder(int orderId, int userId)
        {
            var order = await _orderService.CancelOrderAsync(orderId, userId);
            return Success(order, "Hủy đơn hàng thành công");
        }
    }
}