using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Threading.Tasks;
using BACKEND.Data;
using BACKEND.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace BACKEND.Service
{
    public class EmailService : IEmailService
    {
        private readonly IOtpService _otpService;
        private readonly MotelMateDbContext _context;

        public EmailService(IOtpService otpService, MotelMateDbContext context)
        {
            _otpService = otpService;
            _context = context;
        }

        public async Task SendEmailAsync(string toEmail)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == toEmail);
            if (user == null) throw new Exception("User not found");
            var fromEmail = Environment.GetEnvironmentVariable("EMAIL_FROM");
            var fromPassword = Environment.GetEnvironmentVariable("EMAIL_PASSWORD");

            string otp = _otpService.GenerateAndSaveOtp(toEmail);

            string subject = "Motel Mate - OTP for Password Reset";

            string body = $@"
            <div style='font-family: Arial, sans-serif; font-size: 14px; color: #333;'>
                <h2 style='color: #007BFF;'>Motel Mate - Password Reset Request</h2>
                <p>Dear user,</p>
                <p>We received a request to reset your password. Please use the following One-Time Password (OTP) to proceed:</p>
                <p style='font-size: 18px; font-weight: bold; color: #d90c0cff;'>Your OTP: <strong>{otp}</strong></p>
                <p>This OTP is valid for <strong>5 minutes</strong>. Please do not share this code with anyone.</p>
                <p>If you did not request a password reset, please ignore this email or contact support immediately.</p>
                <br />
                <p>Best regards,</p>
                <p><strong>Motel Mate Team</strong></p>
                <hr />
                <p style='font-size: 12px; color: #888;'>This is an automated message. Please do not reply to this email.</p>
            </div>";
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