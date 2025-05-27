using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace B2BApplication.Models
{
    public class LignePanier
    {
        [Key]
        public int id { get; set; }
        public int articleId { get; set; }
        public Article article { get; set; }
        public int ligneQuantite { get; set; }
        public DateTime dateCreate { get; set; } = DateTime.Now;
        public User userCreate { get; set; }
        [ForeignKey("userCreate")]
        public string userId { get; set; }

    }
}
