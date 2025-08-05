using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using BACKEND.Data;
using BACKEND.DTOs.ProfileDTO;
using BACKEND.Interfaces;
using BACKEND.Models;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.AspNetCore.Identity;
using UserAccount = BACKEND.Models.Account;

namespace BACKEND.Service
{
    public class ProfileService : IProfileService
    {
        private readonly UserManager<UserAccount> _userManager;
        private readonly IMapper _mapper;
        private readonly MotelMateDbContext _context;
        private readonly Cloudinary _cloudinary;

        public ProfileService(UserManager<UserAccount> userManager, IMapper mapper, MotelMateDbContext context, Cloudinary cloudinary)
        {
            _context = context;
            _cloudinary = cloudinary;
            _userManager = userManager;
            _mapper = mapper;
        }

        public async Task<GetProfileDTO?> GetProfileAsync(ClaimsPrincipal user)
        {
            var userId = int.Parse(user.FindFirst(ClaimTypes.NameIdentifier)!.Value);
            var account = await _userManager.FindByIdAsync(userId.ToString());

            if (account == null) return null;

            var role = (await _userManager.GetRolesAsync(account)).FirstOrDefault() ?? "";
            var dto = _mapper.Map<GetProfileDTO>(account);
            dto.Role = role;
            return dto;
        }

        public async Task<bool> UpdateProfileAsync(ClaimsPrincipal user, UpdateProfileDTO dto, List<IFormFile> addedImages)
        {
            var userId = int.Parse(user.FindFirst(ClaimTypes.NameIdentifier)!.Value);
            var account = await _userManager.FindByIdAsync(userId.ToString());
            if (account == null) return false;
            if (addedImages?.Any() == true)
            {
                var file = addedImages.First();
                if (file.Length > 0)
                {
                    var uploadParams = new ImageUploadParams
                    {
                        File = new FileDescription(account.Id + file.FileName, file.OpenReadStream()),
                        Folder = "intern_motel_mate"
                    };

                    var uploadResult = await _cloudinary.UploadAsync(uploadParams);

                    if (uploadResult.StatusCode == HttpStatusCode.OK)
                    {
                        account.URLAvatar = uploadResult.SecureUrl.ToString();
                    }
                    else
                    {
                        return false;
                    }
                }
            }
            if (account is Owner)
            {
                _mapper.Map(dto, account as Owner);
            }
            else
            {
                _mapper.Map(dto, account as Tenant);
            }

            var result = await _userManager.UpdateAsync(account);
            return result.Succeeded;
        }
    }
}