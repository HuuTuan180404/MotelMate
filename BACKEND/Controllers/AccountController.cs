using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using BACKEND.DTOs.AuthDTO;
using BACKEND.Enums;
using BACKEND.Interfaces;
using BACKEND.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;

namespace BACKEND.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AccountController : ControllerBase
    {
        private readonly UserManager<Account> _userManager;
        private readonly ITokenService _tokenService;

        private readonly IConfiguration _config;


        public AccountController(UserManager<Account> userManager, ITokenService tokenService, IConfiguration config)
        {
            _userManager = userManager;
            _tokenService = tokenService;
            _config = config;
        }
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDTO model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            Account user;

            if (!string.IsNullOrEmpty(model.AccountName) && model.AccountNo > 0 && model.BankCode > 0)
            {
                user = new Owner
                {
                    UserName = model.UserName,
                    Email = model.Email,
                    CCCD = model.CCCD,
                    FullName = model.FullName,
                    Bdate = model.Bdate,
                    URLAvatar = model.URLAvatar,
                    Status = EAccountStatus.Active,
                    AccountNo = model.AccountNo,
                    AccountName = model.AccountName,
                    BankCode = model.BankCode,
                    SecurityStamp = Guid.NewGuid().ToString()
                };
            }
            else
            {
                user = new Tenant
                {
                    UserName = model.UserName,
                    Email = model.Email,
                    CCCD = model.CCCD,
                    FullName = model.FullName,
                    Bdate = model.Bdate,
                    URLAvatar = model.URLAvatar,
                    Status = EAccountStatus.Active,
                    SecurityStamp = Guid.NewGuid().ToString()
                };
            }

            var result = await _userManager.CreateAsync(user, model.Password);
            if (!result.Succeeded)
                return BadRequest(result.Errors);

            if (user is Owner)
            {
                await _userManager.AddToRoleAsync(user, "Owner");
            }
            else
            {
                await _userManager.AddToRoleAsync(user, "Tenant");
            }

            return Ok(new
            {
                Message = "User registered successfully.",
                UserId = user.Id,
                Role = user is Owner ? "Owner" : "Tenant"
            });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDTO model)
        {
            var user = await _userManager.FindByNameAsync(model.Username);

            if (user == null || !await _userManager.CheckPasswordAsync(user, model.Password))
                return Unauthorized("Invalid username or password");

            var roles = await _userManager.GetRolesAsync(user);

            var accessToken = await _tokenService.GenerateAccessTokenAsync(user);
            var refreshToken = _tokenService.GenerateRefreshToken();

            await _tokenService.StoreRefreshTokenAsync(user, refreshToken);

            // Gửi refresh token qua HTTP-only cookie
            var cookieOptions = new CookieOptions
            {
                HttpOnly = true,
                Secure = false,
                SameSite = SameSiteMode.None,
                Expires = DateTime.UtcNow.AddYears(100)
            };
            Response.Cookies.Append("refreshToken", refreshToken, cookieOptions);

            // Trả access token qua body
            return Ok(new
            {
                accessToken
            });
        }

        [Authorize]
        [HttpPost("refresh")]
        public async Task<IActionResult> Refresh()
        {
            var token = Request.Headers["Authorization"].FirstOrDefault()?.Replace("Bearer ", "");
            if (string.IsNullOrEmpty(token))
                return Unauthorized();

            var tokenHandler = new JwtSecurityTokenHandler();
            var principal = tokenHandler.ValidateToken(token, new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidIssuer = _config["JWT:Issuer"],

                ValidateAudience = true,
                ValidAudience = _config["JWT:Audience"],

                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["JWT:SigningKey"]!)),

                ValidateLifetime = false,
            }, out var validatedToken);

            var userId = principal.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null) return Unauthorized("Missing user");
            var user = await _userManager.FindByIdAsync(userId);

            var storedRefreshToken = await _tokenService.GetRefreshTokenAsync(user);
            string? refreshTokenFromCookie = Request.Cookies["refreshToken"];

            if (storedRefreshToken != refreshTokenFromCookie)
                return Unauthorized("refreshTokenFromCookie");

            var newAccessToken = await _tokenService.GenerateAccessTokenAsync(user);
            var newRefreshToken = _tokenService.GenerateRefreshToken();

            await _tokenService.StoreRefreshTokenAsync(user, newRefreshToken);
            var cookieOptions = new CookieOptions
            {
                HttpOnly = true,
                SameSite = SameSiteMode.None,
                Expires = DateTime.UtcNow.AddYears(100)
            };
            Response.Cookies.Append("refreshToken", newRefreshToken, cookieOptions);
            return Ok(new
            {
                accessToken = newAccessToken,
            });
        }
    }
}