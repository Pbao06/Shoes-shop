using Microsoft.AspNetCore.Mvc;

namespace src.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BaseController : ControllerBase
{
    protected IActionResult Success<T>(T data, string message = "Thành công", int statusCode = 200)
    {
        return StatusCode(statusCode, new
        {
            success = true,
            message,
            data
        });
    }
}
