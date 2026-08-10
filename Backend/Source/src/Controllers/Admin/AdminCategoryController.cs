using Microsoft.AspNetCore.Mvc;
using src.DTOs;
using src.Middleware;
using src.Services.AdminInterface;

namespace src.Controllers.Admin;

[ApiController]
[Route("api/admin/categories")]
public class AdminCategoryController : BaseController
{
    private readonly ICategoryService _categoryService;

    public AdminCategoryController(ICategoryService categoryService)
    {
        _categoryService = categoryService;
    }
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var categories = await _categoryService.GetAllAsync();
        return Success(categories, "Lấy danh sách danh mục thành công");
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var category = await _categoryService.GetByIdAsync(id);
        if (category == null)
        {
            throw new NotFoundError("Không tìm thấy danh mục");
        }

        return Success(category, "Lấy danh mục thành công");
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateCategoryDto dto)
    {
        var created = await _categoryService.CreateAsync(dto);
        return Success(created, "Tạo danh mục thành công", 201);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, [FromBody] CategoryDto dto)
    {
        var updated = await _categoryService.UpdateAsync(id, dto);
        if (updated == null)
        {
            throw new NotFoundError("Không tìm thấy danh mục");
        }

        return Success(updated, "Cập nhật danh mục thành công");
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var deleted = await _categoryService.DeleteAsync(id);
        if (!deleted)
        {
            throw new NotFoundError("Không tìm thấy danh mục");
        }

        return Success( "Xóa danh mục thành công");
    }
}
