namespace B2BApplication.DTO
{
    public class ArticleUpdateDto
    {
        public string ArticleIntitule { get; set; }
        public decimal ArticlePrixHT { get; set; }
        public int TaxeId { get; set; }
        public bool ArticleEtat { get; set; } = true;
        public bool ArticleStatistique { get; set; } = true;
        public int CatalogueId { get; set; }
        public int FamilleId { get; set; }
    }
}
