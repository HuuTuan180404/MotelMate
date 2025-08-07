using Newtonsoft.Json;

namespace BACKEND.DTOs.RequestDTO
{
    public class CreateRequestDTO
    {
        public string Title { get; set; } = null!;
        public string Content { get; set; } = null!;
        public int? BuildingID { get; set; }
        public IFormFile? images { get; set; }

        public override string ToString()
        {
            return JsonConvert.SerializeObject(this, Formatting.Indented);
        }
    }

    public class RegisterRoomRequestDto
    {
        public int RoomID { get; set; }
        public DateOnly StartDate { get; set; }
        public DateOnly EndDate { get; set; }
    }

    public class RoomRegistrationContentDto
    {
        public DateOnly StartDate { get; set; }
        public DateOnly EndDate { get; set; }
    }



}
