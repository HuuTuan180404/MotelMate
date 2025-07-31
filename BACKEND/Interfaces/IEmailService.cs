using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BACKEND.Interfaces
{
    public interface IEmailService
    {
         Task SendEmailAsync(string toEmail);
    }
}