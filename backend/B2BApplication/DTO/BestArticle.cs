using B2BApplication.Models;

namespace B2BApplication.DTO
{
    public class BestArticle
    {
        public Article article { get; set; }
        public decimal totalVente { get; set; }
        public decimal totalRevenue { get; set; }
        public List<CommandeLigne> lignes { get; set; }
        public string imageContent { get; set; }
    }
}
