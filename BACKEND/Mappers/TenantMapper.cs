using AutoMapper;
using BACKEND.Models;
using BACKEND.DTOs.RoomDTO;
using BACKEND.Enums;

public class TenantMappingProfile : Profile
{
    public TenantMappingProfile()
    {
        CreateMap<Tenant, ReadTenantDTO>()
            .ForMember(t => t.Status, opt => opt.MapFrom(src => src.Status.ToString()));

        CreateMap<ReadTenantDTO, Tenant>()
            .ForMember(dest => dest.Status, opt => opt.MapFrom(src =>
                Enum.Parse<EAccountStatus>(src.Status, true)));
    }
}
