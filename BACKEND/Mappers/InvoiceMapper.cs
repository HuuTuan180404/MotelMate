using AutoMapper;
using BACKEND.Models;
using BACKEND.DTOs.InvoiceDTO;

namespace BACKEND.Mappers
{
    public class InvoiceMappingProfile : Profile
    {
        public InvoiceMappingProfile()
        {
            CreateMap<Invoice, ReadInvoiceDTO>()
                .ForMember(dest => dest.Building, opt => opt.MapFrom(src => src.Contract.Room.Building.Name))
                .ForMember(dest => dest.Room, opt => opt.MapFrom(src => src.Contract.Room.RoomNumber))
                .ForMember(dest => dest.Month, opt => opt.MapFrom(src => src.PeriodStart.ToString("yyyy-MM")))
                .ForMember(dest => dest.Due, opt => opt.MapFrom(src => src.DueDate))
                .ForMember(dest => dest.Total, opt => opt.MapFrom(src => src.TotalAmount))
                .ForMember(dest => dest.Status, opt => opt.MapFrom(src => src.Status.ToString()));

            CreateMap<Invoice, ReadInvoiceDetailDTO>()
                .ForMember(dest => dest.InvoiceID, opt => opt.MapFrom(src => src.InvoiceID)) 
                .ForMember(dest => dest.Building, opt => opt.MapFrom(src => src.Contract.Room.Building.Name))
                .ForMember(dest => dest.Room, opt => opt.MapFrom(src => src.Contract.Room.RoomNumber))
                .ForMember(dest => dest.Month, opt => opt.MapFrom(src => src.PeriodStart.ToString("yyyy-MM")))
                .ForMember(dest => dest.PeriodStart, opt => opt.MapFrom(src => src.PeriodStart.ToString("yyyy-MM-dd")))
                .ForMember(dest => dest.PeriodEnd, opt => opt.MapFrom(src => src.PeriodEnd.ToString("yyyy-MM-dd")))
                .ForMember(dest => dest.Due, opt => opt.MapFrom(src => src.DueDate.ToString("yyyy-MM-dd")))
                .ForMember(dest => dest.CreateAt, opt => opt.MapFrom(src => src.CreateAt.ToString("yyyy-MM-dd HH:mm:ss")))
                .ForMember(dest => dest.Total, opt => opt.MapFrom(src => src.TotalAmount))
                .ForMember(dest => dest.TotalInitialAmount, opt => opt.MapFrom(src => src.TotalInitialAmount))
                .ForMember(dest => dest.Status, opt => opt.MapFrom(src => src.Status.ToString()))
                .ForMember(dest => dest.ExtraCosts, opt => opt.MapFrom(src => src.ExtraCosts))
                .ForMember(dest => dest.Services, opt => opt.MapFrom(src => src.InvoiceDetail));

            CreateMap<ExtraCost, ExtraCostDTO>()
                .ForMember(dest => dest.ExtraCostID, opt => opt.MapFrom(src => src.ExtraCostID));

            CreateMap<InvoiceDetail, ServiceDetailDTO>()
                .ForMember(dest => dest.ServiceID, opt => opt.MapFrom(src => src.ServiceID))
                .ForMember(dest => dest.Name, opt => opt.MapFrom(src => src.Service.Name))
                .ForMember(dest => dest.Unit, opt => opt.MapFrom(src => src.Service.Unit))
                .ForMember(dest => dest.Quantity, opt => opt.MapFrom(src => src.Quantity))
                .ForMember(dest => dest.InitialPrice, opt => opt.MapFrom(src => src.InitialPrice))
                .ForMember(dest => dest.Price, opt => opt.MapFrom(src => src.Price));               

            
        }
        
    }
}
