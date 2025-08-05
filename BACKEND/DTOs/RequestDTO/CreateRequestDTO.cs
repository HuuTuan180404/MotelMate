namespace BACKEND.DTOs.RequestDTO
{
    public class CreateRequestDTO
    {
        public string Title { get; set; } = null!;
        public string Content { get; set; } = null!;
        public string? Image { get; set; }
    }
}
