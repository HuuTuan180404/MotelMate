using AutoMapper;
using BACKEND.Data;
using BACKEND.DTOs.RoomDTO;
using BACKEND.Enums;
using BACKEND.RoomDTO.DTOs;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BACKEND.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EnumController : ControllerBase
    {
        [HttpGet("request-types")]
        public ActionResult<IEnumerable<EnumDTO>> GetERequestType()
        {
            var values = Enum.GetValues(typeof(ERequestType))
                                .Cast<ERequestType>()
                                .Select(e => new EnumDTO
                                {
                                    Name = e.ToString(),
                                    Value = (int)e
                                }).ToList();
            return Ok(values);
        }
        
        [HttpGet("contract-statuses")]
        public ActionResult<IEnumerable<EnumDTO>> GetEContractStatus()
        {
            var values = Enum.GetValues(typeof(EContractStatus))
                                .Cast<EContractStatus>()
                                .Select(e => new EnumDTO
                                {
                                    Name = e.ToString(),
                                    Value = (int)e
                                }).ToList();
            return Ok(values);
        }
    }

    public class EnumDTO
    {
        public string Name { get; set; }
        public int Value { get; set; }
    }
}
