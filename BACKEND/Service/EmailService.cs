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
        public async Task SendEmailAsync(string toEmail)
        {
            var fromEmail = Environment.GetEnvironmentVariable("EMAIL_FROM");
            var fromPassword = Environment.GetEnvironmentVariable("EMAIL_PASSWORD");
            string subject = "Forgot Password";
            string otp = GenerateOtp();
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
        private string GenerateOtp(int length = 6)
        {
            var random = new Random();
            return new string(Enumerable.Range(0, length)
                .Select(_ => (char)('0' + random.Next(0, 10)))
                .ToArray());
        }
    }
}