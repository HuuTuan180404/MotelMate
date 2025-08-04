using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BACKEND.DTOs.AuthDTO
{
    public class ChangePassDTO
    {
        public required string OldPassword { get; set; }
        public required string NewPassword { get; set; }
    }
}