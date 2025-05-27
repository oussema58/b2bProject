using System.ComponentModel.DataAnnotations;

namespace Security2.DTO
{
    public class SignupDto
    {
        [Required(ErrorMessage ="the name field is needed")]
        public string name { get; set; }
        [Required]
  
        public string username { get; set; }
        public string password { get; set; }

        public int entTarifId { get; set; }

        //                                                        Societe client                                 // 
        [RegularExpression("^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$")]
        public string? emailClient { get; set; }
        public string codeClient { get; set; }
        public string intituleClient { get; set; }
        public string matricule_Fiscale { get; set; }
        public string adresseClient { get; set; }
        public string? ville { get; set; }

        public string? codePostale { get; set; }
        public string telephoneClient { get; set; }
    }
}
