using B2BApplication.Models;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace B2BApplication.DTO
{
    public class CatalogueDto
    {
        public string CatalogueIntitule { get; set; }
        [Range(1, 3)]
        public int CatalogueNiveau { get; set; }
        public int CatalogueParentId { get; set; }
    }
}
