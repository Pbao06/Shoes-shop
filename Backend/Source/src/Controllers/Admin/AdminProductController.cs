using Microsoft.AspNetCore.Mvc;
using src.Controllers;
using src.DTOs;
using src.Middleware;
using src.Services.AdminInterface;

namespace src.Controllers.Admin;

[ApiController]
[Route("api/admin/products")]
public class AdminProductController : BaseController
{
    private readonly IProductService _productService;

    public AdminProductController(IProductService productService)
    {
        _productService = productService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var products = await _productService.GetAllAsync();
        return Success(products, "Lấy danh sách sản phẩm thành công");
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var product = await _productService.GetByIdAsync(id);
        if (product == null)
        {
            throw new NotFoundError("Không tìm thấy sản phẩm");
        }

        return Success(product, "Lấy sản phẩm thành công");
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateProductDto dto)
    {
        var created = await _productService.CreateAsync(dto);
        return Success(created, "Tạo sản phẩm thành công", 201);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, [FromBody] ProductDto dto)
    {
        var updated = await _productService.UpdateAsync(id, dto);
        if (updated == null)
        {
            throw new NotFoundError("Không tìm thấy sản phẩm");
        }

        return Success(updated, "Cập nhật sản phẩm thành công");
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var deleted = await _productService.DeleteAsync(id);
        if (!deleted)
        {
            throw new NotFoundError("Không tìm thấy sản phẩm");
        }

        return Success("Xóa sản phẩm thành công");
    }
}
