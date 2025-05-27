using B2BApplication.Models;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace B2BApplication.DTO
{
    public class CommandLigneDto
    {
        public int ligneId { get; set; }
        public int articleId { get; set; }
        public decimal articlePrixHt { get; set; }
        public decimal articlePrixTtc { get; set; }
        public double articleTauxTva { get; set; }
        public int ligneQuantite { get; set; }
        public decimal ligneTotalHt { get; set; }
        public decimal ligneTotalTtc { get; set; }
        public decimal ligneTotalTaxes { get; set; }
        public string? username { get; set; }
    }
}
