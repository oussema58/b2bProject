using System.ComponentModel.DataAnnotations;

namespace B2BApplication.DTO
{
    public class TarifDto
    {
        public string? Tarif_Entete_intitule { get; set; }
        public string? Tarif_Entete_Code { get; set; }
        [Required]
        
        public DateTime tarif_Entete_DateFin { get; set; }
        public List<LigneTarif>? tarifs { get; set; }
    }
}
