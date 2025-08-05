using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BACKEND.DTOs.ProfileDTO
{
    public class UpdateProfileDTO
    {
    public string FullName { get; set; } = null!;
    public string Email { get; set; } = null!;
    public string PhoneNumber { get; set; } = null!;
    public DateOnly Bdate { get; set; }
    public string? AccountName { get; set; } = null!;
    public string? AccountNo { get; set; } = null!;
    public string? BankCode { get; set; } = null!;
    }
}