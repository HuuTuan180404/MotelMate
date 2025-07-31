using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace BACKEND.DTOs.AuthDTO
{
    public class RegisterDTO
    {
        [Required]
        [StringLength(100)]
        public string UserName { get; set; } = null!;

        [Required]
        [EmailAddress]
        public string Email { get; set; } = null!;

        [Required]
        [MinLength(6)]
        [DataType(DataType.Password)]
        public string Password { get; set; } = null!;

        [Required]
        [RegularExpression(@"^\d{12}$", ErrorMessage = "CCCD must be 12 digits.")]
        public string CCCD { get; set; } = null!;

        [Required]
        [StringLength(100)]
        public string FullName { get; set; } = null!;

        [Required]
        public DateOnly Bdate { get; set; }
        
        [Required]
        [RegularExpression(@"^\d{10}$", ErrorMessage = "Phone number must be 10 digits.")]
        public string PhoneNumber { get; set; } = null!;
        public string? URLAvatar { get; set; }

        // Thông tin ngân hàng
        public long AccountNo { get; set; }

        public string? AccountName { get; set; } = null!;

        public int BankCode { get; set; }
    }
}