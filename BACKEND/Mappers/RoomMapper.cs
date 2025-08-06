using AutoMapper;
using BACKEND.Models;
using BACKEND.Enums;
using BACKEND.RoomDTO.DTOs;
using BACKEND.DTOs.RoomDTO;
namespace BACKEND.Mappers
{
    public class RoomMapper : Profile
    {
        public RoomMapper()
        {
            CreateMap<Room, ReadRoomDTO>()
                .ForMember(t => t.Status, opt => opt.MapFrom(src => src.Status.ToString()))
                .ForMember(dest => dest.BuildingName, opt => opt.MapFrom(src => src.Building.Name))
                .ForMember(dest => dest.BuildingAddress, opt => opt.MapFrom(src => src.Building.Address))
                .ForMember(dest => dest.RoomImageUrl, opt => opt.MapFrom(src => src.RoomImages != null && src.RoomImages.Any() ? src.RoomImages.First().ImageURL : null))
                .ForMember(r => r.UrlAvatars, opt => opt.MapFrom(src => src.Contracts
                                                                            .Where(c => c.Status != EContractStatus.Terminated) // chỉ hợp đồng Active
                                                                            .SelectMany(c => c.ContractDetail)
                                                                            .Where(cd => cd.Tenant != null)
                                                                            .Select(cd => cd.Tenant.URLAvatar != null && cd.Tenant.URLAvatar.Length >= 5 ? cd.Tenant.URLAvatar : "null")
                                                                            .ToList()));

            CreateMap<Room, ReadRoomDetailDTO>()
                .ForMember(t => t.Status, opt => opt.MapFrom(src => src.Status.ToString()))
                .ForMember(dest => dest.UrlRoomImages,
                                    opt => opt.MapFrom(src => src.RoomImages
                                                                    .Select(img => img.ImageURL)
                                                                    .Distinct()
                                                                    .ToList()))
                .ForMember(r => r.Members, opt => opt.MapFrom(src => src.Contracts
                                                                            .Where(c => c.Status != EContractStatus.Terminated) // chỉ hợp đồng Active
                                                                            .SelectMany(c => c.ContractDetail)
                                                                            .Select(cd => cd.Tenant)
                                                                            .Distinct()
                                                                            .ToList()))
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Building.Owner.Id))
                .ForMember(dest => dest.OwnerFullName, opt => opt.MapFrom(src => src.Building.Owner.FullName))
                .ForMember(dest => dest.OwnerPhoneNumber, opt => opt.MapFrom(src => src.Building.Owner.PhoneNumber))

                .ForMember(dest => dest.AssetData, opt => opt.MapFrom(src => src.RoomAssets.Select(ra => new
                {
                    AssetID = ra.AssetID,
                    AssetName = ra.Asset.Name,
                    Quantity = ra.Quantity
                })));

            CreateMap<CreateRoomDTO, Room>()
                .ForMember(t => t.Status, opt => opt.MapFrom(src => ERoomStatus.Available));
        }
    }
}
