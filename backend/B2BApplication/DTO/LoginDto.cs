using System.ComponentModel.DataAnnotations;

namespace Security2.DTO
{
    public class LoginDto
    {
        [Required]
        public string username { get; set; }
        [Required]
        public string password { get; set; }
    }
}
