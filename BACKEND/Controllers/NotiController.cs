using System.Security.Claims;
using AutoMapper;
using BACKEND.Data;
using BACKEND.DTOs.RoomDTO;
using BACKEND.Enums;
using BACKEND.Models;
using BACKEND.RoomDTO.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BACKEND.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NotiController : ControllerBase
    {
        private readonly MotelMateDbContext _context;
        private readonly IMapper _mapper;

        public NotiController(MotelMateDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }
    }
}
