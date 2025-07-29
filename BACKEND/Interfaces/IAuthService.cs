using BACKEND.DTOs.AuthDTO;
using BACKEND.Models;
using System.Threading.Tasks;

namespace BACKEND.Interfaces
{
    public interface IAuthService
    {
        Task<(bool Success, object Result)> Register(RegisterDTO model);
        Task<(bool Success, object Result)> Login(LoginDTO model);
        Task<(bool Success, object Result)> RefreshToken(string refreshToken);
    }
}