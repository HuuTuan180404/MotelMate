using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using BACKEND.Data;
using BACKEND.DTOs.AuthDTO;
using BACKEND.Enums;
using BACKEND.Interfaces;
using BACKEND.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace BACKEND.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AccountController : ControllerBase
    {
        private readonly UserManager<Account> _userManager;
        private readonly ITokenService _tokenService;

        private readonly MotelMateDbContext _dbContext;


        public AccountController(UserManager<Account> userManager, ITokenService tokenService, MotelMateDbContext dbContext)
        {
            _userManager = userManager;
            _tokenService = tokenService;
            _dbContext = dbContext;
        }
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDTO registerDTO)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            Account user;

            if (!string.IsNullOrEmpty(registerDTO.AccountName) && registerDTO.AccountNo > 0 && registerDTO.BankCode > 0)
            {
                user = new Owner
                {
                    UserName = registerDTO.UserName,
                    Email = registerDTO.Email,
                    CCCD = registerDTO.CCCD,
                    FullName = registerDTO.FullName,
                    Bdate = registerDTO.Bdate,
                    URLAvatar = registerDTO.URLAvatar,
                    Status = EAccountStatus.Active,
                    AccountNo = registerDTO.AccountNo,
                    AccountName = registerDTO.AccountName,
                    BankCode = registerDTO.BankCode,
                    SecurityStamp = Guid.NewGuid().ToString()
                };
            }
            else
            {
                user = new Tenant
                {
                    UserName = registerDTO.UserName,
                    Email = registerDTO.Email,
                    CCCD = registerDTO.CCCD,
                    FullName = registerDTO.FullName,
                    Bdate = registerDTO.Bdate,
                    URLAvatar = registerDTO.URLAvatar,
                    Status = EAccountStatus.Active,
                    SecurityStamp = Guid.NewGuid().ToString()
                };
            }

            var result = await _userManager.CreateAsync(user, registerDTO.Password);
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

            // Send refresh token via HTTP-only cookie
            var cookieOptions = new CookieOptions
            {
                HttpOnly = true,
                SameSite = SameSiteMode.Strict,
                Expires = DateTime.UtcNow.AddYears(100)
            };
            Response.Cookies.Append("refreshToken", refreshToken, cookieOptions);

            return Ok(new
            {
                accessToken
            });
        }

        [HttpPost("refresh")]
        public async Task<IActionResult> Refresh()
        {
            string? refreshTokenFromCookie = Request.Cookies["refreshToken"];
            if (string.IsNullOrEmpty(refreshTokenFromCookie))
                return Unauthorized("Missing refresh token");

            // Find user by refresh token
            var user = await _dbContext.Users
            .Join(_dbContext.UserTokens,
                u => u.Id,
                t => t.UserId,
                (u, t) => new { User = u, Token = t })
            .Where(x => x.Token.Name == "RefreshToken" && x.Token.Value == refreshTokenFromCookie)
            .Select(x => x.User)
            .FirstOrDefaultAsync();
            if (user == null)
                return Unauthorized("Invalid refresh token");

            var storedRefreshToken = await _tokenService.GetRefreshTokenAsync(user);


            if (storedRefreshToken != refreshTokenFromCookie)
                return Unauthorized("refreshTokenFromCookie");

            var newAccessToken = await _tokenService.GenerateAccessTokenAsync(user);
            var newRefreshToken = _tokenService.GenerateRefreshToken();

            await _tokenService.StoreRefreshTokenAsync(user, newRefreshToken);
            var cookieOptions = new CookieOptions
            {
                HttpOnly = true,
                SameSite = SameSiteMode.Strict,
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