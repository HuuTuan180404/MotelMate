using AutoMapper;
using BACKEND.Models;
using BACKEND.DTOs.RequestDTO;

namespace BACKEND.Mappers
{
    public class RequestMappingProfile : Profile
    {
        public RequestMappingProfile()
        {
            CreateMap<Request, ReadRequestDTO>()
                .ForMember(dest => dest.Type, opt => opt.MapFrom(src => src.Type.ToString()))
                .ForMember(dest => dest.TenantName, opt => opt.MapFrom(src => src.Tenant.FullName))
                .ForMember(dest => dest.RoomName, opt => opt.Ignore()) // Sẽ handle thủ công ở Controller
                .ForMember(dest => dest.BuildingName, opt => opt.Ignore());
        }
    }
}
