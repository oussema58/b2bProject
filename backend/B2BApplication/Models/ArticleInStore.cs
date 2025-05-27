using System.Text.Json.Serialization;

namespace B2BApplication.Models
{
    public class ArticleInStore
    {
        public string articleCode { get; set; }
        public string articleIntitule { get; set; }
        public decimal tarifPrix { get; set; }
        public int articleID { get; set; }
        /*public bool articleEtat { get; set; }*/
        public bool enVente { get; set; }
        [JsonIgnore]
        public string imagePath { get; set; }
        public string imageContent { get; set; }
        public string description { get; set; }
        public int tarifEnteteId { get; set; }
        public int catalogueId { get; set; }
        public string catalogueIntitule { get; set; }
        public int catalogueParentId { get; set; }
        public int nbArticleSold { get; set; }
        public int taxeId { get; set; }
        public decimal taxeTaux { get; set; }
        public DateTime DateCreate { get; set; }
    }
}
