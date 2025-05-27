using B2BApplication.Models;
using System.ComponentModel.DataAnnotations.Schema;

namespace B2BApplication.DTO
{
    public class LignePanierDto1
    {
        public int id { get; set; }
        public int articleId { get; set; }
        public int ligneQuantite { get; set; }
        public DateTime dateCreate { get; set; } = DateTime.Now;
        public string username { get; set; }
    }
}
