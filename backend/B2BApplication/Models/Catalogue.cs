using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations.Schema;

namespace B2BApplication.Models
{
    public class Catalogue
    {
        public int CatalogueId { get; set; }
        public string CatalogueIntitule { get; set; }
        public int CatalogueNiveau { get; set; }
       
        public Catalogue? CatalogueParent { get; set; }
        [ForeignKey("CatalogueParent")]
        public int? CatalogueParentId  { get; set; }
    }
}
