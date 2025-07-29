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
                        : string.Empty));

            // created by Tuan
            CreateMap<ContractDetail, ContractDetailDTO>();
        }
    }
}
