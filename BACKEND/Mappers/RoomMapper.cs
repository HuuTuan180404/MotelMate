using AutoMapper;
using BACKEND.Models;
using BACKEND.DTOs.RoomDTO;
using BACKEND.Enums;
using BACKEND.RoomDTO.DTOs;

namespace BACKEND.Mappers
{
    public class RoomMapper : Profile
    {
        public RoomMapper()
        {
            CreateMap<Room, ReadRoomDTO>()
                .ForMember(t => t.Status, opt => opt.MapFrom(src => src.Status.ToString()))
                .ForMember(dest => dest.BuildingName, opt => opt.MapFrom(src => src.Building.Name))
                .ForMember(dest => dest.RoomImageUrl, opt => opt.MapFrom(src => src.RoomImages != null && src.RoomImages.Any() ? src.RoomImages.First().ImageURL : null));

            // CreateMap<ReadRoomDTO, Room>()
            //     .ForMember(dest => dest.Status, opt => opt.MapFrom(src => Enum.Parse<EAccountStatus>(src.Status, true)));
        }
    }
}
