using Microsoft.AspNetCore.Mvc;
using src.Middleware;
using src.Services.Interface;

namespace src.Controllers.Customer;

[ApiController]
[Route("api/products")]
public class C_ProductController : BaseController
{
    private readonly IC_ProductService _productService;

    public C_ProductController(IC_ProductService productService)
    {
        _productService = productService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var products = await _productService.GetPublicProductsAsync();
        return Success(products, "Lấy danh sách sản phẩm thành công");
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var product = await _productService.GetProductDetailsAsync(id);
        if (product == null)
        {
            throw new NotFoundError("Không tìm thấy sản phẩm");
        }

        return Success(product, "Lấy chi tiết sản phẩm thành công");
    }
}