using BACKEND.DTOs.AuthDTO;
using BACKEND.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using System.Threading.Tasks;

namespace BACKEND.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AccountController : ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly IOtpService _otpService;

        public AccountController(IAuthService authService, IOtpService otpService)
        {
            _authService = authService;
            _otpService = otpService;
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

        [HttpPost("logout")]
        public async Task<IActionResult> Logout()
        {
            var refreshToken = Request.Cookies["refreshToken"];

            if (refreshToken != null)
            {
                Response.Cookies.Delete("refreshToken");
                return Ok();
            }

            return Unauthorized();
        }

        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPassDTO dto)
        {
            if (!_otpService.VerifyOtp(dto.Email, dto.Otp))
                return BadRequest(new { message = "Invalid or expired OTP." });

            bool result = await _authService.ResetPasswordAsync(dto.Email, dto.NewPassword);
            if (!result)
                return NotFound(new { message = "User not found." });

            return Ok(new { message = "Password reset successfully." });
        }
        [HttpPatch("change-password")]
        [Authorize]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePassDTO dto)
        {
            int userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

            var result = await _authService.ChangePasswordAsync(userId, dto);

            if (!result)
            {
                return BadRequest(new { message = "Invalid old password." });
            }

            return Ok(new { message = "Password changed successfully." });
        }
    }
}