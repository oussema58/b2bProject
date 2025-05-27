using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace B2BApplication.Models
{
    public class CommandeLigne
    {
     
        [Key]
        public int ligneId { get; set; }
        public Commande? commande { get; set; }
        [ForeignKey("commande")]
        public int? commandeId { get; set; }
        [ForeignKey("article")]
        public int articleId { get; set; }
        public Article article { get; set; }
        public string articleCode { get; set; }
        public string articleIntitule { get; set; }
        public decimal articlePrixHt { get; set; }
        public decimal articlePrixTtc { get; set; }
        public decimal articleTauxTva { get; set; }
        public int ligneQuantite { get; set; }
        public decimal ligneTotalHt { get; set; }
        public decimal ligneTotalTtc { get; set; }
        public decimal ligneTotalTaxes { get; set; }
        public decimal ligneRevenue { get; set; }
        public DateTime dateCreate { get; set; }= DateTime.Now;
        public User userCreate { get; set; }
        [ForeignKey("userCreate")]
        public string userId{ get; set; }

        public LigneDemandeRetour ligneRetour { get; set; }
    }
}
