using BACKEND.DTOs.AuthDTO;
using BACKEND.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace BACKEND.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AccountController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AccountController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDTO model)
        {
            var (success, result) = await _authService.Register(model);
            return success ? Ok(result) : BadRequest(result);
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDTO model)
        {
            var (success, result) = await _authService.Login(model);
            
            if (success && result is { } successResult)
            {
                var cookieOptions = new CookieOptions
                {
                    HttpOnly = true,
                    SameSite = SameSiteMode.Strict,
                    Expires = DateTime.UtcNow.AddYears(100)
                };
                Response.Cookies.Append("refreshToken", (result as dynamic)?.RefreshToken, cookieOptions);
                
                return Ok(new { AccessToken = (result as dynamic)?.AccessToken });
            }
                
            return Unauthorized(result);
        }

        [HttpPost("refresh")]
        public async Task<IActionResult> Refresh()
        {
            var refreshToken = Request.Cookies["refreshToken"];
            var (success, result) = await _authService.RefreshToken(refreshToken);
            
            if (success && result is { } successResult)
            {
                var cookieOptions = new CookieOptions
                {
                    HttpOnly = true,
                    SameSite = SameSiteMode.Strict,
                    Expires = DateTime.UtcNow.AddYears(100)
                };
                Response.Cookies.Append("refreshToken", (result as dynamic)?.RefreshToken, cookieOptions);
                
                return Ok(new { AccessToken = (result as dynamic)?.AccessToken });
            }
            
            return Unauthorized(result);
        }
    }
}