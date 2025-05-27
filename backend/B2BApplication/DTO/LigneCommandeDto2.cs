using B2BApplication.Models;

namespace B2BApplication.DTO
{
    public class LigneCommandeDto2
    {
        public string catalogue { get; set; }
        public List<CommandeLigne> lignes { get; set; }
        public decimal totalVente { get; set; }
        public decimal totalRevenue { get; set; }
    }
}
