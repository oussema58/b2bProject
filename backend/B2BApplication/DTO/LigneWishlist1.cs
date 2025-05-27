namespace B2BApplication.DTO
{
    public class LigneWishlistDto1
    {
        public int id { get; set; }
        public int articleId { get; set; }
        public DateTime dateCreate { get; set; } = DateTime.Now;
    }
}
