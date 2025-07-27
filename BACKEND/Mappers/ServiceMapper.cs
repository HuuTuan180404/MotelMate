using AutoMapper;
using BACKEND.Models;
using BACKEND.DTOs.ServiceDTO;

namespace BACKEND.Mappers
{
    public class ServiceMappingProfile : Profile
    {
        public ServiceMappingProfile()
        {
            CreateMap<BACKEND.Models.Service, ReadServiceDTO>();
            CreateMap<ServiceTier, ReadServiceTierDTO>();

            CreateMap<EditServiceDTO, BACKEND.Models.Service>()
                .ForMember(dest => dest.ServiceID, opt => opt.Ignore())
                .ForMember(dest => dest.IsTiered, opt => opt.Ignore())
                .ForMember(dest => dest.ServiceTier, opt => opt.Ignore());

            CreateMap<EditServiceTierDTO, ServiceTier>();

            // Mapping CreateServiceDTO
            CreateMap<CreateServiceDTO, BACKEND.Models.Service>()
                .ForMember(dest => dest.ServiceID, opt => opt.Ignore())
                .ForMember(dest => dest.ServiceTier, opt => opt.Ignore());
        }
    }
}
