using B2BApplication.Models;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace B2BApplication.DTO
{
    public class CommandeDto
    {
        public int clientId { get; set; }
        public string username { get; set; }
        //public List<CommandLigneDto> lignes { get; set; }
        public List<LignePanierDto> lignes { get; set; }

    }
}
