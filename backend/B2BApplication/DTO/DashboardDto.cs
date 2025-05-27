namespace B2BApplication.DTO
{
    public class DashboardDto
    {
        public int nbCommandeClient { get; set; }
        public int nbCommandeSociete { get; set; }
        public int nbRetourClient { get; set; }
        public int nbRetourSociete { get; set; }
        public int nbPanier { get; set; }

        public int nbWishlist { get; set; }
        public int nbCompte { get; set; }
    }
}
