namespace B2BApplication.DTO
{
    public class LigneWishlistDto
    {
        public int id { get; set; }
        public int articleId { get; set; }
        public decimal tarifttc { get; set; }
        public string articleIntitule { get; set; }
        public string articleCode { get; set; }
        public decimal tarif { get; set; }
        public decimal tva { get; set; }
        
        public string articleImage { get; set; }

        public DateTime dateCreate { get; set; } = DateTime.Now;
        public string? userId { get; set; }
    }
}
