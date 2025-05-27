using static System.Runtime.InteropServices.JavaScript.JSType;

namespace B2BApplication.DTO
{
    public class UserDto
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public bool etat { get; set; }
        public Date creationDate { get; set; }
        public string UserName { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
        public string password { get; set; }

    }
}
