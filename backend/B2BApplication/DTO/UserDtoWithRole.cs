namespace B2BApplication.DTO
{
    public class UserDtoWithRole
    {
        public string Id { get; set; }
        public string name { get; set; }
        public bool etat { get; set; }
        public DateTime creationDate { get; set; }
        public string userName { get; set; }
        public string email { get; set; }
        public string phoneNumber { get; set; }
        public string role { get; set; }
        public string? imageContent { get; set; }

    }
}
