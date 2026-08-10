using Microsoft.AspNetCore.Mvc;
using src.DTOs;
using src.Middleware;
using src.Services.AdminInterface;

namespace src.Controllers.Admin;

[ApiController]
[Route("api/admin/brands")]
public class AdminBrandController : BaseController
{
    private readonly IBrandService _brandService;

    public AdminBrandController(IBrandService brandService)
    {
        _brandService = brandService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var brands = await _brandService.GetAllAsync();
        return Success(brands, "Lấy danh sách thương hiệu thành công");
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var brand = await _brandService.GetByIdAsync(id);
        if (brand == null)
        {
            throw new NotFoundError("Không tìm thấy thương hiệu");
        }

        return Success(brand, "Lấy thương hiệu thành công");
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateBrandDto dto)
    {
        var created = await _brandService.CreateAsync(dto);
        return Success(created, "Tạo thương hiệu thành công", 201);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, [FromBody] BrandDto dto)
    {
        var updated = await _brandService.UpdateAsync(id, dto);
        if (updated == null)
        {
            throw new NotFoundError("Không tìm thấy thương hiệu");
        }

        return Success(updated, "Cập nhật thương hiệu thành công");
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var deleted = await _brandService.DeleteAsync(id);
        if (!deleted)
        {
            throw new NotFoundError("Không tìm thấy thương hiệu");
        }

        return Success("Xóa thương hiệu thành công");
    }
}