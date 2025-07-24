using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using BACKEND.Models;

namespace BACKEND.Interfaces
{
    public interface ITokenService
    {
        Task<string> GenerateAccessTokenAsync(Account user);
        string GenerateRefreshToken();
        Task StoreRefreshTokenAsync(Account user, string refreshToken);
        Task<string?> GetRefreshTokenAsync(Account user);
        Task RemoveRefreshTokenAsync(Account user);
    }
}