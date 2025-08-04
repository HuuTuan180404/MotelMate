using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using BACKEND.DTOs.ProfileDTO;
using BACKEND.Interfaces;
using BACKEND.Models;
using Microsoft.AspNetCore.Identity;

namespace BACKEND.Service
{
    public class ProfileService: IProfileService
    {
         private readonly UserManager<Account> _userManager;
        private readonly IMapper _mapper;

        public ProfileService(UserManager<Account> userManager, IMapper mapper)
        {
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

        public async Task<bool> UpdateProfileAsync(ClaimsPrincipal user, UpdateProfileDTO dto)
        {
            var userId = int.Parse(user.FindFirst(ClaimTypes.NameIdentifier)!.Value);
            var account = await _userManager.FindByIdAsync(userId.ToString());
            if (account == null) return false;
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