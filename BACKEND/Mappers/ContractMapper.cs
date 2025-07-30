using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using BACKEND.DTOs;
using BACKEND.Models;
using AutoMapper;

namespace BACKEND.Mappers
{

    public class ContractMapper : Profile
    {
        public ContractMapper()
        {
            CreateMap<Contract, ContractDTO>()
                .ForMember(dest => dest.ContractHolder, opt => opt.MapFrom(src =>
                    src.ContractDetail != null
                        ? src.ContractDetail
                            .Where(cd => cd.IsRoomRepresentative == true && cd.Tenant != null)
                            .Select(cd => cd.Tenant.FullName)
                            .FirstOrDefault() ?? string.Empty
                        : string.Empty))
                .ForMember(dest => dest.BuildingName, opt => opt.MapFrom(src =>
                    src.Room != null && src.Room.Building != null
                        ? src.Room.Building.Name
                        : string.Empty))
                .ForMember(dest => dest.RoomNumber, opt => opt.MapFrom(src =>
                    src.Room != null
                        ? src.Room.RoomNumber
                        : string.Empty))
                .ForMember(t => t.Status, opt => opt.MapFrom(src
                        => src.Status.ToString()));
            CreateMap<ContractDetail, ContractDetailDTO>();
        }
    }
}
