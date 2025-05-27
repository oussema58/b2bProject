namespace B2BApplication.DTO
{
    public class CatalogueKeyPair2
    {
        public int id { get; set; }
        public string name { get; set; }
        //public string? parent { get; set; }

        //public int niveau { get; set; }
        public int nbArticle { get; set; }
        public List<CatalogueKeyPair2> value { get; set; } = null;

        public bool isExpendable { get; set; } = false;
    }
}
