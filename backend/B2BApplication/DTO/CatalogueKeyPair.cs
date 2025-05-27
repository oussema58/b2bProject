namespace B2BApplication.DTO
{
    public class CatalogueKeyPair
    {
        public int id { get; set; }
        public string name { get; set; }
        //public string? parent { get; set; }
        public int? parentId { get; set; }

       public int niveau { get; set; }
        public int nbArticle { get; set; }
        public List<CatalogueKeyPair> value { get; set; } = null;
         
    }
}
