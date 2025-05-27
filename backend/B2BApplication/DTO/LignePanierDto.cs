using B2BApplication.Models;

namespace B2BApplication.DTO
{
    public class LignePanierDto
    {
        public int id { get; set; }
        public int articleId { get; set; }
        public decimal tarifttc { get; set; }
        public string articleIntitule { get; set; }
        public string articleCode { get; set; }
        public string articleImage { get; set; }
        public decimal tarif { get; set; }
        public decimal tva { get; set; }
        public int ligneQuantite { get; set; }
        public decimal ligneTotalHt { get; set; }
        public decimal ligneTotalTtc { get; set; }
        public decimal ligneTotalTaxes { get; set; }
        public DateTime dateCreate { get; set; } = DateTime.Now;
        public string? userId { get; set; }
    }
}
