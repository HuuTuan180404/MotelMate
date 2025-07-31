using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Threading.Tasks;
using BACKEND.Interfaces;

namespace BACKEND.Service
{
    public class EmailService : IEmailService
    {
        private readonly IOtpService _otpService;

        public EmailService(IOtpService otpService)
        {
            _otpService = otpService;
        }

        public async Task SendEmailAsync(string toEmail)
        {
            var fromEmail = Environment.GetEnvironmentVariable("EMAIL_FROM");
            var fromPassword = Environment.GetEnvironmentVariable("EMAIL_PASSWORD");

            string otp = _otpService.GenerateAndSaveOtp(toEmail); 

            string subject = "Forgot Password";
            string body = $"<p>Your OTP is: <strong>{otp}</strong></p><p>This OTP is valid for 5 minutes.</p>";

            var message = new MailMessage
            {
                From = new MailAddress(fromEmail),
                Subject = subject,
                Body = body,
                IsBodyHtml = true
            };

            message.To.Add(new MailAddress(toEmail));

            using var smtp = new SmtpClient("smtp.gmail.com", 587)
            {
                Credentials = new NetworkCredential(fromEmail, fromPassword),
                EnableSsl = true
            };

            await smtp.SendMailAsync(message);
        }
    }
}