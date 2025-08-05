using AutoMapper;
using BACKEND.Enums;
using BACKEND.Models;
using BACKEND.RoomDTO.DTOs;

namespace BACKEND.Mappers
{
    public class AssetMapper : Profile
    {
        public AssetMapper()
        {
            CreateMap<Asset, ReadAssetDTO>()
                .ForMember(t => t.Type, opt => opt.MapFrom(src => src.Type.ToString()))
                .ForMember(t => t.Quantity, opt => opt.MapFrom(src => src.RoomAsset.Count()));

            CreateMap<ReadAssetDTO, Asset>()
                .ForMember(t => t.Type, opt => opt.MapFrom(src => Enum.Parse<EAssetType>(src.Type)));
        }
    }
}
