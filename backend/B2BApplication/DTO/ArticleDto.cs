namespace B2BApplication.DTO
{
    public class ArticleDto
    {
        public string ArticleCode { get; set; }
        public string ArticleIntitule { get; set; }
        public string description { get; set; }
        public decimal ArticlePrixHT { get; set; }
        public int TaxeId { get; set; }
        public string ArticleBarCode { get; set; }
        public bool ArticleEtat { get; set; } = true;
        public bool ArticleStatistique { get; set; } = true;
        public int CatalogueId { get; set; }
        public int FamilleId { get; set; }
    }
}
