using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace B2BApplication.Models
{
    public class Client
    {
        public int Id { get; set; }
        public string email { get; set; }
        public string code { get; set; }
        [JsonIgnore]
        public string? imagePath { get; set; }
        public string? imageContent { get; set; }
        public string intitule { get; set; }
        public string matricule_Fiscale { get; set; }
        public string adresse { get; set; }
        public string? ville { get; set; }

        public string? codePostale { get; set; }
        public string telephone { get; set; }
        [ForeignKey("tarifEntete")]
        public int entTarifId { get; set; }
        public TarifEntete tarifEntete { get; set; }

        public DateTime dateCreate { get; set; } = DateTime.Now;
        public DateTime dateUpdate { get; set; }= DateTime.Now;

        //public List<User> users = new List<User>();
        public ICollection<User> users { get; set; }
        public ICollection<Commande> commandes { get; set; }
        public ICollection<DemandeRetour> demandesRetour { get; set; }
        public string userCreate { get; set; }
        public string userUpdate { get; set; }
        public string? blockedBy { get; set; }
        public bool etat { get; set; }
        /*
        public int SocieteId {  get; set; } 

        public Societe societe { get; set; }
        */
    }
}
