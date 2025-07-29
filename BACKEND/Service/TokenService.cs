using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using BACKEND.Interfaces;
using BACKEND.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
#nullable disable
namespace BACKEND.Service
{
    public class TokenService : ITokenService
    {
        private readonly IConfiguration _config;
        private readonly UserManager<Account> _userManager;

        public TokenService(IConfiguration config, UserManager<Account> userManager)
        {
            _config = config;
            _userManager = userManager;
        }

        public async Task<string> GenerateAccessTokenAsync(Account user)
        {
            var roles = await _userManager.GetRolesAsync(user);

            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.UserName)
            };
            claims.AddRange(roles.Select(role => new Claim(ClaimTypes.Role, role)));

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["JWT:SigningKey"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var expires = DateTime.Now.AddMinutes(double.Parse(_config["JWT:AccessTokenExpireMinutes"] ?? "15"));

            var token = new JwtSecurityToken(
                issuer: _config["JWT:Issuer"],
                audience: _config["JWT:Audience"],
                claims: claims,
                expires: expires,
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        public string GenerateRefreshToken()
        {
            var randomBytes = new byte[32];
            using var rng = RandomNumberGenerator.Create();
            rng.GetBytes(randomBytes);
            return Convert.ToBase64String(randomBytes);
        }

        public Task StoreRefreshTokenAsync(Account user, string refreshToken)
        {
            return _userManager.SetAuthenticationTokenAsync(user, "JWT", "RefreshToken", refreshToken);
        }

        public Task<string?> GetRefreshTokenAsync(Account user)
        {
            return _userManager.GetAuthenticationTokenAsync(user, "JWT", "RefreshToken");
        }

        public Task RemoveRefreshTokenAsync(Account user)
        {
            return _userManager.RemoveAuthenticationTokenAsync(user, "JWT", "RefreshToken");
        }
    }
}