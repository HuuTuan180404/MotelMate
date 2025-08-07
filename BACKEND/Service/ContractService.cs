using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using BACKEND.Data;
using BACKEND.DTOs;
using BACKEND.DTOs.ContractDTO;
using BACKEND.Enums;
using BACKEND.Interfaces;
using BACKEND.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BACKEND.Service
{
    public class ContractService : IContractService
    {
        private readonly MotelMateDbContext _context;
        private readonly IMapper _mapper;

        public ContractService(MotelMateDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<List<ContractDTOs>> GetAllContractsAsync()
        {
            var contracts = await _context.Contract
                .Include(c => c.ContractDetail)
                    .ThenInclude(cd => cd.Tenant)
                .Include(c => c.Room)
                    .ThenInclude(r => r.Building)
                .ToListAsync();

            return _mapper.Map<List<ContractDTOs>>(contracts);
        }

        public async Task<IActionResult> CreateContractAsync(CreateContractDTO request)
        {
            var room = await _context.Room
                .Include(r => r.Building)
                .FirstOrDefaultAsync(r => r.RoomNumber == request.RoomNumber && r.Building.BuildingID == request.BuildingID);

            if (room == null)
                return new NotFoundObjectResult(new { message = "room not found" });

            if (room.Status != ERoomStatus.Available)
                return new BadRequestObjectResult(new { message = "room is not available" });

            var tenant = await _context.Tenant
                .FirstOrDefaultAsync(t => t.CCCD == request.CCCD);

            if (tenant == null)
                return new NotFoundObjectResult(new { message = "tenant not found" });

            var isInAnotherRoom = await _context.ContractDetail
                .FirstOrDefaultAsync(cd => cd.EndDate == null && cd.TenantID == tenant.Id);

            if (isInAnotherRoom != null)
                return new BadRequestObjectResult(new { message = "tenant is in another room" });

            var contract = new Contract
            {
                Deposit = request.Deposit,
                Price = request.Price,
                StartDate = request.StartDate,
                EndDate = request.EndDate,
                Status = EContractStatus.Unsigned,
                RoomID = room.RoomID,
                Description = null,
                ContractCode = "C" + room.RoomNumber + DateTime.Now.ToString("yyyyMMddHHmmss")
            };

            _context.Contract.Add(contract);
            await _context.SaveChangesAsync();

            var contractDetail = new ContractDetail
            {
                ContractID = contract.ContractID,
                TenantID = tenant.Id,
                StartDate = request.StartDate,
                IsRoomRepresentative = true
            };

            _context.ContractDetail.Add(contractDetail);
            room.Status = ERoomStatus.Occupied;
            await _context.SaveChangesAsync();

            return new OkObjectResult(new
            {
                message = "Contract created successfully.",
                ContractID = contract.ContractID
            });
        }

        public async Task<IActionResult> TerminateContractByRoomAsync(int roomID)
        {
            var contract = await _context.Contract
                .Include(c => c.ContractDetail)
                .Include(c => c.Room)
                .Where(c => c.RoomID == roomID && c.Status != EContractStatus.Terminated)
                .FirstOrDefaultAsync();

            if (contract == null)
            {
                return new NotFoundObjectResult(new { Message = "Không tìm thấy hợp đồng đang hoạt động cho phòng này." });
            }

            contract.Room.Status = ERoomStatus.Available;
            contract.Status = EContractStatus.Terminated;
            contract.EndDate = DateOnly.FromDateTime(DateTime.Now);

            foreach (var detail in contract.ContractDetail)
            {
                if (detail.EndDate == null)
                {
                    detail.EndDate = DateOnly.FromDateTime(DateTime.Now);
                }
            }

            await _context.SaveChangesAsync();

            return new OkObjectResult(new
            {
                Message = "The contract has been successfully terminated.",
                ContractID = contract.ContractID,
                RoomID = roomID
            });
        }
        public async Task<IActionResult> GetContractUnsignedByRoomID(int roomID)
        {
            var contract = await _context.Contract
                .Where(c => c.RoomID == roomID && c.Status == EContractStatus.Unsigned)
                .FirstOrDefaultAsync();

            if (contract == null)
            {
                return new NotFoundObjectResult(new { Message = "contract not found" });
            }

            return new OkObjectResult(new { Message = "contract found" });
        }
        public async Task<IActionResult> SignContractAsync()
        {
            var contract = await _context.Contract
                .Where(c => c.Status == EContractStatus.Unsigned)
                .FirstOrDefaultAsync();

            if (contract == null)
            {
                return new NotFoundObjectResult(new { Message = "contract not found" });
            }

            contract.Status = EContractStatus.Active;
            await _context.SaveChangesAsync();

            return new OkObjectResult(new { Message = "contract signed" });
        }
    }
}