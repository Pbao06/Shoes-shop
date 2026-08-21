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
public async Task<IActionResult> GetAll(
    [FromQuery] string? category, 
    [FromQuery] string? sortBy, 
    [FromQuery] int page = 1, 
    [FromQuery] int pageSize = 12)
{
    var products = await _productService.GetPublicProductsAsync(category, sortBy, page, pageSize);
    return Success(products, "Get Product Success");
}

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var product = await _productService.GetProductDetailsAsync(id);
        if (product == null)
        {
            throw new NotFoundError("NotFound");
        }

        return Success(product, "Get product success");
    }
}