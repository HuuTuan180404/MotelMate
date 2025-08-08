using BACKEND.Data;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using System.Threading.Tasks;

namespace BACKEND.Service
{
    public class NotificationHub : Hub
    {
        public async Task JoinUserGroup()
        {
            // BE tự lấy user ID từ token đã được authenticate
            var userIdClaim = Context.User?.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim != null && int.TryParse(userIdClaim.Value, out var userId))
            {
                await Groups.AddToGroupAsync(Context.ConnectionId, $"tenant_{userId}");
                Console.WriteLine($"User {userId} joined notification group");
            }
        }

        public override async Task OnDisconnectedAsync(Exception exception)
        {
            var userIdClaim = Context.User?.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim != null && int.TryParse(userIdClaim.Value, out var userId))
            {
                await Groups.RemoveFromGroupAsync(Context.ConnectionId, $"tenant_{userId}");
                Console.WriteLine($"User {userId} left notification group");
            }
            await base.OnDisconnectedAsync(exception);
        }
    }


    public class NotificationService
    {
        private readonly IHubContext<NotificationHub> _hubContext;
        private readonly MotelMateDbContext _context;

        public NotificationService(IHubContext<NotificationHub> hubContext, MotelMateDbContext context)
        {
            _hubContext = hubContext;
            _context = context;
        }

        public async Task UpdateHasNewNotification(int tenantId)
        {
            bool hasNew = await _context.NotiRecipient.AnyAsync(n => n.TenantID == tenantId && !n.IsRead);

            await _hubContext.Clients.Group($"tenant_{tenantId}")
                .SendAsync("NewNotification", new { hasNewNotification = hasNew });
        }
    }
}

