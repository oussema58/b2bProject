using System.ComponentModel.DataAnnotations;

namespace B2BApplication.Models
{
    public class Motif
    {
        [Key]
        public int id { get; set; }
        public string code { get; set; }
        public string intitule { get; set; }

    }
}
