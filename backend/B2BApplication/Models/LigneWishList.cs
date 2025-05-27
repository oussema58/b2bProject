using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace B2BApplication.Models
{
    public class LigneWishlist
    {
        [Key]
        public int id { get; set; }
        public int articleId { get; set; }
        public Article article { get; set; }
        public DateTime dateCreate { get; set; } = DateTime.Now;
        public User userCreate { get; set; }
        [ForeignKey("userCreate")]
        public string userId { get; set; }
    }
}
