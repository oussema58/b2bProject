using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace B2BApplication.Models
{
    public class DemandeRetour
    {
        [Key]
    public int Id { get; set; }
        public int nbArtcileRetenue { get; set; }
        public User userCreatedBy { get; set; }
        [ForeignKey("userCreatedBy")]
        public string userId { get; set; }
        public Client client { get; set; }
        [ForeignKey("client")]
        public int clientId { get; set; }
        public DateTime dateCreated { get; set; }= DateTime.Now;
        
        public User? admin { get; set; }
        [ForeignKey("admin")]
        public string? adminId { get; set; }
       
        public ICollection<LigneDemandeRetour> lignes { get; set; }
        public Commande commande { get; set; }
        public int commandeId { get; set; }

    }
}
