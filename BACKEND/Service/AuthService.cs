// Services/AuthService.cs
using BACKEND.Data;
using BACKEND.DTOs.AuthDTO;
using BACKEND.Enums;
using BACKEND.Interfaces;
using BACKEND.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading.Tasks;

namespace BACKEND.Service
{
    public class AuthService : IAuthService
    {
        private readonly UserManager<Account> _userManager;
        private readonly ITokenService _tokenService;
        private readonly MotelMateDbContext _context;

        public AuthService(
            UserManager<Account> userManager,
            ITokenService tokenService,
            MotelMateDbContext context)
        {
            _userManager = userManager;
            _tokenService = tokenService;
            _context = context;
        }
        public async Task<bool> ResetPasswordAsync(string email, string newPassword)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
            if (user == null) return false;
            user.PasswordHash = _userManager.PasswordHasher.HashPassword(user, newPassword);

            var result = await _userManager.UpdateAsync(user);

            return result.Succeeded;
        }
        public async Task<(bool Success, object Result)> Register(RegisterDTO model)
        {
            try
            {
                var existingUser = await _context.Users.FirstOrDefaultAsync(u => u.UserName == model.UserName);
                if (existingUser != null)
                    return (false, new { message = "Username already exists" });
                existingUser = await _context.Users.FirstOrDefaultAsync(u => u.CCCD == model.CCCD);
                if (existingUser != null)
                    return (false, new { message = "CCCD already exists" });
                existingUser = await _context.Users.FirstOrDefaultAsync(u => u.PhoneNumber == model.PhoneNumber);
                if (existingUser != null)
                    return (false, new { message = "Phone number already exists" });
                existingUser = await _userManager.FindByEmailAsync(model.Email);
                if (existingUser != null)
                    return (false, new { message = "Email already exists" });
                Account user = CreateUserFromModel(model);
                
                var result = await _userManager.CreateAsync(user, model.Password);
                if (!result.Succeeded)
                    return (false, result.Errors);

                await AddToRoleAsync(user);

                return (true, new
                {
                    Message = "User registered successfully.",
                    UserId = user.Id,
                    Role = user is Owner ? "Owner" : "Tenant"
                });
            }
            catch (Exception ex)
            {
                return (false, ex.Message);
            }
        }

        public async Task<(bool Success, object Result)> Login(LoginDTO model)
        {
            try
            {
                var user = await _userManager.FindByNameAsync(model.Username);
                if (user == null || !await _userManager.CheckPasswordAsync(user, model.Password))
                    return (false, "Invalid username or password");

                var accessToken = await _tokenService.GenerateAccessTokenAsync(user);
                var refreshToken = _tokenService.GenerateRefreshToken();

                await _tokenService.StoreRefreshTokenAsync(user, refreshToken);

                return (true, new
                {
                    AccessToken = accessToken,
                    RefreshToken = refreshToken
                });
            }
            catch (Exception ex)
            {
                return (false, ex.Message);
            }
        }

        public async Task<(bool Success, object Result)> RefreshToken(string refreshToken)
        {
            try
            {
                var user = await GetUserFromRefreshToken(refreshToken);
                if (user == null)
                    return (false, "Invalid refresh token");

                var newAccessToken = await _tokenService.GenerateAccessTokenAsync(user);
                var newRefreshToken = _tokenService.GenerateRefreshToken();

                await _tokenService.StoreRefreshTokenAsync(user, newRefreshToken);

                return (true, new
                {
                    AccessToken = newAccessToken,
                    RefreshToken = newRefreshToken
                });
            }
            catch (Exception ex)
            {
                return (false, ex.Message);
            }
        }

        private Account CreateUserFromModel(RegisterDTO model)
        {
            if (!string.IsNullOrEmpty(model.AccountName) && model.AccountNo > 0 && model.BankCode > 0)
            {
                return new Owner
                {
                    UserName = model.UserName,
                    Email = model.Email,
                    CCCD = model.CCCD,
                    FullName = model.FullName,
                    PhoneNumber = model.PhoneNumber,
                    Bdate = model.Bdate,
                    URLAvatar = model.URLAvatar,
                    Status = EAccountStatus.Active,
                    AccountNo = model.AccountNo,
                    AccountName = model.AccountName,
                    BankCode = model.BankCode,
                    SecurityStamp = Guid.NewGuid().ToString()
                };
            }

            return new Tenant
            {
                UserName = model.UserName,
                Email = model.Email,
                CCCD = model.CCCD,
                FullName = model.FullName,
                PhoneNumber = model.PhoneNumber,
                Bdate = model.Bdate,
                URLAvatar = model.URLAvatar,
                Status = EAccountStatus.Active,
                SecurityStamp = Guid.NewGuid().ToString()
            };
        }

        private async Task AddToRoleAsync(Account user)
        {
            var role = user is Owner ? "Owner" : "Tenant";
            await _userManager.AddToRoleAsync(user, role);
        }

        private async Task<Account> GetUserFromRefreshToken(string refreshToken)
        {
            return await _context.Users
                .Join(_context.UserTokens,
                    u => u.Id,
                    t => t.UserId,
                    (u, t) => new { User = u, Token = t })
                .Where(x => x.Token.Name == "RefreshToken" && x.Token.Value == refreshToken)
                .Select(x => x.User)
                .FirstOrDefaultAsync() ?? throw new Exception("Invalid refresh token");
        }
    }
}