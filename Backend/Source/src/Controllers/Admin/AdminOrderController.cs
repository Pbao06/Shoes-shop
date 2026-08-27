using Microsoft.AspNetCore.Mvc;
using src.Controllers;
using src.DTOs;
using src.Middleware;
using src.Services.AdminInterface;

namespace src.Controllers.Admin;

[ApiController]
[Route("api/admin/orders")]
public class AdminOrderController : AdminBaseController
{
    private readonly IAdminOrderService _adminOrderService;

    public AdminOrderController(IAdminOrderService adminOrderService)
    {
        _adminOrderService = adminOrderService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] string? status)
    {
        var orders = await _adminOrderService.GetAllAsync(status);
        return Success(orders, "Lấy danh sách đơn hàng thành công");
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var order = await _adminOrderService.GetByIdAsync(id);
        if (order == null)
        {
            throw new NotFoundError("Không tìm thấy đơn hàng");
        }

        return Success(order, "Lấy chi tiết đơn hàng thành công");
    }

    [HttpPut("{id:int}/status")]
    public async Task<IActionResult> UpdateStatus(int id, [FromBody] UpdateOrderStatusDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Status))
        {
            throw new ValidationError("Trạng thái đơn hàng là bắt buộc.");
        }

        var updated = await _adminOrderService.UpdateStatusAsync(id, dto);
        if (updated == null)
        {
            throw new NotFoundError("Không tìm thấy đơn hàng");
        }

        return Success(updated, "Cập nhật trạng thái đơn hàng thành công");
    }
}
