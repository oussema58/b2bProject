namespace B2BApplication.DTO
{
    public class DemandeRetourDto
    {
        public List<LigneDemandeRetourDto> lignes { get; set; }
        
        public String  username { get; set; }
        public int commandId { get; set; }
    }
}
