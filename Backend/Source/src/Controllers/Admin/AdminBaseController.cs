using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using src.Controllers;

namespace src.Controllers.Admin;

/// <summary>
/// Base controller for all Admin APIs.
/// Requires the user to be in the "Admin" role.
/// </summary>
[Authorize(Roles = "Admin")]
public class AdminBaseController : BaseController
{
}
