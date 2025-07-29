using AutoMapper;
using BACKEND.Models;
using BACKEND.DTOs.RoomDTO;
using BACKEND.Enums;

namespace BACKEND.Mappers
{
    public class TenantMapper : Profile
    {
        public TenantMapper()
        {
            CreateMap<Tenant, ReadTenantDTO>()
                .ForMember(t => t.Status, opt => opt.MapFrom(src => src.Status.ToString()))
                .ForMember(t => t.ContractDetails, opt => opt.MapFrom(src => src.ContractDetails.ToList()));
        }
    }
}
