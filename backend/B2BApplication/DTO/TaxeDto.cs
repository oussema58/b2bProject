using System.ComponentModel.DataAnnotations;

namespace B2BApplication.DTO
{
    public class TaxeDto
    {
        public string TaxeCode { get; set; }
        public string TaxeIntitule { get; set; }
        [Required]
        [Range(0,100)]
        public decimal TaxeTaux { get; set; }
    }
}
