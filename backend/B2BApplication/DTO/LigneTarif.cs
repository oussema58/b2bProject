namespace B2BApplication.DTO
{
    public class LigneTarif
    {
        public int? tarifId  { get; set; }
        public decimal tarifPrix { get; set; }
        public string? articleIntitule { get; set; }
        public bool enVente { get; set; }
    }
}
