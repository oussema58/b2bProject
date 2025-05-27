using System.ComponentModel.DataAnnotations.Schema;

namespace B2BApplication.Models
{
    public class Tarif
    {
        public int TarifId { get; set; }
        public decimal TarifPrix { get; set; }
        [ForeignKey("articleId")]
        public Article article { get; set; }

        public int articleId { get; set; }
        [ForeignKey("tarifEnteteId")]
        public TarifEntete tarifEntete { get; set; }
        public int tarifEnteteId { get; set; }

        public bool enVente { get; set; }
    }
}
