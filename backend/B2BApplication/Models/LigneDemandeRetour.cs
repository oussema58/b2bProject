using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace B2BApplication.Models
{
    public class LigneDemandeRetour
    {
        [Key]
        public int id { get; set; }
        public int nbArticleRetenue { get; set; }
        public Motif motif { get; set; }
        [ForeignKey("motif")]
        public int motifId { get; set; }
        public Article article { get; set; }
        [ForeignKey("article")]
        public int articleId { get; set; }
        public string artcileIntitule { get; set; }
        public string articleCode { get; set; }
        public int nbArticleTotale { get; set; }
        public DemandeRetour demandeRetour { get; set; }
        [ForeignKey("demandeRetour")]
        public int demandeRetourId { get; set; }
        public CommandeLigne commandeLigne { get; set; }
        [ForeignKey("commandeLigne")]
        public int commandeLigneId { get; set; }
    }
}
