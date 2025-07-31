using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using BACKEND.Interfaces;
using Microsoft.Extensions.Caching.Memory;

namespace BACKEND.Service
{
    public class OtpService : IOtpService
    {
        private readonly IMemoryCache _cache;

        public OtpService(IMemoryCache cache)
        {
            _cache = cache;
        }

        public string GenerateAndSaveOtp(string email)
        {
            var otp = GenerateOtp();
            _cache.Set(email, otp, TimeSpan.FromMinutes(5));
            return otp;
        }

        public bool VerifyOtp(string email, string inputOtp)
        {
            return _cache.TryGetValue(email, out string? cachedOtp) && cachedOtp == inputOtp;
        }

        private string GenerateOtp(int length = 6)
        {
            var random = new Random();
            return new string(Enumerable.Range(0, length)
                .Select(_ => (char)('0' + random.Next(0, 10)))
                .ToArray());
        }
    }
}