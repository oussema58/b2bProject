using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace B2BApplication.Models
{
    public class Article
    {
        [Key]
        public int ArticleID { get; set; }
        public string ArticleCode { get; set; }
        public string ArticleIntitule { get; set; }
        public decimal ArticlePrixHT { get; set; }
        [JsonIgnore]
        public string imagePath { get; set; }
        public string imageContent {  get; set; }
        public string description { get; set; }
        //decimal
        public Taxe? Taxe { get; set; }
      
        public int? TaxeId { get; set; }
        public string ArticleBarCode { get; set;}
        public bool ArticleEtat { get; set; } = true;
        public bool ArticleStatistique { get; set; } = true;
        public Catalogue Catalogue { get; set; }
        public int CatalogueId { get; set; }
        public Famille Famille { get; set; }
        public int FamilleId { get; set; }
        public DateTime DateCreate { get; set; } = DateTime.Now;
        public DateTime DateUpdate { get; set; } = DateTime.Now;
        public User UserCreated { get; set; }
        public User UserModified { get; set; }
        public List<Tarif> tarifs {  get; set; }
        public int nbArticleSold { get; set; }
        public List<ArticleViews> ViewedBy { get; set; }
    }
}
