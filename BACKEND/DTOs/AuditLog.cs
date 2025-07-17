using BACKEND.Enums;

namespace BACKEND.DTOs
{
    public class AuditLog
    {
        public int AuditLogID { get; set; }

        public DateTime Timestamp { get; set; } = DateTime.Now;

        public int Id { get; set; }

        public EAuditLogAction Action { get; set; }

        public string TableName { get; set; }

        public string OldValue { get; set; }

        public string NewValue { get; set; }

        public virtual Account Account { get; set; }
    }
}
