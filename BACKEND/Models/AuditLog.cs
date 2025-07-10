using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using BACKEND.Enums;

namespace BACKEND.Models
{
    public class AuditLog
    {
        [Key]
        public int AuditLogID { get; set; }

        public DateTime Timestamp { get; set; } = DateTime.Now;

        [ForeignKey(nameof(Account))]
        public int Id { get; set; }

        [Required]
        public EAuditLogAction Action { get; set; }

        [Required]
        public string TableName { get; set; }

        public string OldValue { get; set; }

        public string NewValue { get; set; }

        public virtual Account Account { get; set; }
    }
}
