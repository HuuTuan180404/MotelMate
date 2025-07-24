using AutoMapper;
using BACKEND.Models;
using BACKEND.DTOs;

namespace BACKEND.Mappers
{
    public class ServiceMappingProfile : Profile
    {
        public ServiceMappingProfile()
        {
            CreateMap<Service, ReadServiceDTO>();
            CreateMap<ServiceTier, ReadServiceTierDTO>();

             // Edit Mapping (Update)
            CreateMap<EditServiceDTO, Service>()
                .ForMember(dest => dest.ServiceID, opt => opt.Ignore())  // Không map ID (Controller handle)
                .ForMember(dest => dest.IsTiered, opt => opt.Ignore())   // Không cho sửa IsTiered
                .ForMember(dest => dest.ServiceTier, opt => opt.Ignore()); // ServiceTier handle manual update

            CreateMap<EditServiceTierDTO, ServiceTier>();
        }
    }
}
