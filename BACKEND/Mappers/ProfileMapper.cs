using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using BACKEND.DTOs.ProfileDTO;
using BACKEND.Models;

namespace BACKEND.Mappers
{
    public class ProfileMapper : Profile
    {
        public ProfileMapper()
        {
            CreateMap<Account, GetProfileDTO>()
                .ForMember(dest => dest.AccountNo, opt => opt.MapFrom(src => (src as Owner)!.AccountNo.ToString()))
                .ForMember(dest => dest.AccountName, opt => opt.MapFrom(src => (src as Owner)!.AccountName))
                .ForMember(dest => dest.BankCode, opt => opt.MapFrom(src => (src as Owner)!.BankCode.ToString()));

            CreateMap<UpdateProfileDTO, Tenant>()
                .ForMember(dest => dest.UpdateAt, opt => opt.MapFrom(src => DateTime.Now));

            CreateMap<UpdateProfileDTO, Owner>()
                .ForMember(dest => dest.UpdateAt, opt => opt.MapFrom(src => DateTime.Now))
                .ForMember(dest => dest.AccountNo, opt => opt.MapFrom(src => long.Parse(src.AccountNo)))
                .ForMember(dest => dest.BankCode, opt => opt.MapFrom(src => int.Parse(src.BankCode)));
        }
    }
}