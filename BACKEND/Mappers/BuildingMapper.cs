using AutoMapper;
using BACKEND.Models;
using BACKEND.DTOs.BuildingDTO;
using BACKEND.Enums;

namespace BACKEND.Mappers
{
    public class BuildingMappingProfile : Profile
    {
        public BuildingMappingProfile()
        {
            CreateMap<Building, ReadBuildingDTO>()
                .ForMember(dest => dest.TotalRooms, opt => opt.MapFrom(src => src.Rooms.Count()))
                .ForMember(dest => dest.AvailableRooms, opt => opt.MapFrom(src => src.Rooms.Count(r => r.Status == ERoomStatus.Available)))
                .ForMember(dest => dest.OccupiedRooms, opt => opt.MapFrom(src => src.Rooms.Count(r => r.Status == ERoomStatus.Occupied)))
                .ForMember(dest => dest.MaintenanceRooms, opt => opt.MapFrom(src => src.Rooms.Count(r => r.Status == ERoomStatus.Maintenance)))
                .ForMember(dest => dest.TotalTenants, opt => opt.MapFrom(src =>
                    src.Rooms
                        .SelectMany(r => r.Contracts)
                        .Where(c => c.Status == EContractStatus.Active)
                        .SelectMany(c => c.ContractDetail)
                        .Select(cd => cd.TenantID)
                        .Distinct()
                        .Count()
                ));
            CreateMap<UpdateBuildingDTO, Building>()
                .ForAllMembers(opt => opt.Condition((src, dest, srcMember) => srcMember != null));

            CreateMap<CreateBuildingDTO, Building>();

        }
    }
}
