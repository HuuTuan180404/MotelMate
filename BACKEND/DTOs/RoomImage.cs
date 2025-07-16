namespace BACKEND.DTOs
{
    using System;

    public partial class RoomImage
    {
        public Nullable<int> RoomID { get; set; }
        public required string ImageURL { get; set; }
    }
}
