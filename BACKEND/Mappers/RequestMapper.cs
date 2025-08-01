using AutoMapper;
using BACKEND.Models;
using BACKEND.DTOs.RequestDTO;
using BACKEND.Enums;

namespace BACKEND.Mappers
{
    public class RequestMappingProfile : Profile
    {
        public RequestMappingProfile()
        {
            CreateMap<Request, ReadRequestDTO>()
                .ForMember(dest => dest.Type, opt => opt.MapFrom(src => src.Type.ToString()));
        }
    }
}
