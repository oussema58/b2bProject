using System.ComponentModel.DataAnnotations;

namespace B2BApplication.Models
{
    public class Statut
    {
        [Key]
        public int statusId { get; set; }
        public string statusCode { get; set; }
        public string statustIntitule { get; set; }
        public ICollection<Commande> commandes { get; set; }
    }
}
