using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace B2BApplication.Models
{
    public class Commande
    {
        [Key]
        public int commandeId { get; set; }
        public string commandeNumero { get; set; }
        public DateTime? commandeDate { get; set; } = DateTime.Now;
        public decimal commandeTotalHt { get; set; }
        public decimal commandeTotalTtc { get; set; }
        public decimal commandeTotalTaxes { get; set; }
        public decimal commandeRevenue { get; set; }
        public int commandesNbrArticles { get; set; }
        public Client client { get; set; }
        [ForeignKey("client")]
        public int clientId { get; set; }
        public string clientIntitule { get; set; }
        public string clientCode { get; set; }
        //added by admin when validate
        public DateTime? commandeDateLivraisonPrevue { get; set; }
        public DateTime dateCreate { get; set; }=DateTime.Now;
        public User userCreate { get; set; }
        [ForeignKey("userCreate")]
        public string userCreateId { get; set; }
        public Statut statut { get; set; }
        [ForeignKey("statut")]
        public int statutId { get; set; }
        public ICollection<CommandeLigne> lignes { get; set; }
        public DemandeRetour demandeRetour { get; set; }


    }
}
