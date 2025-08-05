using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using BACKEND.DTOs.AuthDTO;
using BACKEND.DTOs.ProfileDTO;

namespace BACKEND.Interfaces
{
    public interface IProfileService
    {
        Task<GetProfileDTO?> GetProfileAsync(ClaimsPrincipal user);
        Task<bool> UpdateProfileAsync(ClaimsPrincipal user, UpdateProfileDTO dto, List<IFormFile> addedImages);
    }
}