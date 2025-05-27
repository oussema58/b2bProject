using B2BApplication.Models;

namespace B2BApplication.DTO
{
    public class BestClient
    {
        //public Client client { get; set; }
        public string intitule { get; set; }
        public string imagePath { get; set; }
        public decimal totalVente { get; set; }
        public decimal totalRevenue { get; set; }
        public int nbCommandes { get; set; }
        public string imageContent { get; set; }
        public List<Commande> commandes { get; set; }
    }
}
