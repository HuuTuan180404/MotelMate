using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using BACKEND.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace BACKEND.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EmailController : ControllerBase
    {
        private readonly IEmailService _emailService;

        public EmailController(IEmailService emailService)
        {
            _emailService = emailService;
        }

        [HttpPost("send/{toEmail}")]
        public async Task<IActionResult> SendEmail(string toEmail)
        {
            await _emailService.SendEmailAsync(toEmail);
            return Ok("Email sent successfully");
        }
    }
}