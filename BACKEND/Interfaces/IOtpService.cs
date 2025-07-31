using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BACKEND.Interfaces
{
    public interface IOtpService
    {
        string GenerateAndSaveOtp(string email);
        bool VerifyOtp(string email, string inputOtp);
    }
}