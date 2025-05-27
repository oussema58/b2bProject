namespace B2BApplication.Models
{
    public class TarifEntete
    {
        public int TarifEnteteId { get; set; }
        public string Tarif_Entete_intitule { get; set; }
        public string Tarif_Entete_Code { get; set; }
        public DateTime Tarif_Entete_DateFin { get; set; }
        public List<Tarif> tarifs{ get; set; }
    }
}
