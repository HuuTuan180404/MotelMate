using Newtonsoft.Json;

namespace BACKEND.DTOs.RequestDTO
{
    public class CreateRequestDTO
    {
        public string Title { get; set; } = null!;
        public string Content { get; set; } = null!;
        public string Type { get; set; } = null!;
        public int? BuildingID { get; set; }

        public override string ToString()
        {
            return JsonConvert.SerializeObject(this, Formatting.Indented);
        }
    }
}
