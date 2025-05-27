namespace B2BApplication.DTO
{
    public class AdminDashboardDto
    {
        public int nbArticles { get; set; }
        public int nbClients { get; set; }
        public int nbCommandes { get; set; }
        public int nbRetours { get; set; }
        public decimal totalVente { get; set; }
        public decimal totalRevenue { get; set; }

    }
}
