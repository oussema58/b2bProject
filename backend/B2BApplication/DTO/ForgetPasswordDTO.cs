
using System.ComponentModel.DataAnnotations;

namespace B2BApplication.DTO
{

    public class ForgetPasswordDTO
    {
        [Required]
        public string username { get; set; }
        [Required]
        public string  oldPassword { get; set; }
        [Required]
        [MaxLength(15)]
        [MinLength(6)]
        public string newPassword { get; set; }
    }
}
