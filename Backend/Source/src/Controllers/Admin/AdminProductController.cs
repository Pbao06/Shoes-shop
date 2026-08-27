using Microsoft.AspNetCore.Mvc;
using src.Controllers;
using src.DTOs;
using src.Middleware;
using src.Models;
using src.Services.AdminInterface;

namespace src.Controllers.Admin;

[ApiController]
[Route("api/admin/products")]
public class AdminProductController : AdminBaseController
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

    [HttpGet("{productId:int}/variants")]
    public async Task<IActionResult> GetVariants(int productId)
    {
        var variants = await _productService.GetVariantsAsync(productId);
        return Success(variants, "Lấy danh sách biến thể thành công");
    }

    [HttpPost("{productId:int}/variants")]
    public async Task<IActionResult> CreateVariant(int productId, [FromBody] CreateProductVariantDto dto)
    {
        var created = await _productService.CreateVariantAsync(productId, dto);
        return Success(created, "Tạo biến thể thành công", 201);
    }

    [HttpPut("variants/{variantId:int}")]
    public async Task<IActionResult> UpdateVariant(int variantId, [FromBody] UpdateProductVariantDto dto)
    {
        var updated = await _productService.UpdateVariantAsync(variantId, dto);
        if (updated == null)
        {
            throw new NotFoundError("Không tìm thấy biến thể");
        }

        return Success(updated, "Cập nhật biến thể thành công");
    }

    [HttpDelete("variants/{variantId:int}")]
    public async Task<IActionResult> DeleteVariant(int variantId)
    {
        var deleted = await _productService.DeleteVariantAsync(variantId);
        if (!deleted)
        {
            throw new NotFoundError("Không tìm thấy biến thể");
        }

        return Success("Xóa biến thể thành công");
    }

    [HttpGet("sizes")]
    public async Task<IActionResult> GetSizes()
    {
        var sizes = await _productService.GetAllSizesAsync();
        return Success(sizes, "Lấy danh sách size thành công");
    }

    [HttpGet("{productId:int}/images")]
    public async Task<IActionResult> GetImages(int productId)
    {
        var images = await _productService.GetImagesAsync(productId);
        return Success(images, "Lấy danh sách ảnh thành công");
    }

    [HttpPost("{productId:int}/images")]
    public async Task<IActionResult> UploadImage(int productId, [FromForm] IFormFile file, [FromForm] string? altText)
    {
        var uploaded = await _productService.UploadImageAsync(productId, file, altText);
        return Success(uploaded, "Tải ảnh lên thành công", 201);
    }

    [HttpDelete("images/{imageId:int}")]
    public async Task<IActionResult> DeleteImage(int imageId)
    {
        var deleted = await _productService.DeleteImageAsync(imageId);
        if (!deleted)
        {
            throw new NotFoundError("Không tìm thấy ảnh");
        }

        return Success("Xóa ảnh thành công");
    }

    [HttpPut("images/{imageId:int}/primary")]
    public async Task<IActionResult> SetPrimaryImage(int imageId)
    {
        var updated = await _productService.SetPrimaryImageAsync(imageId);
        if (updated == null)
        {
            throw new NotFoundError("Không tìm thấy ảnh");
        }

        return Success(updated, "Đặt ảnh chính thành công");
    }
}
