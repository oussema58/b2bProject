using System.Text.Json.Serialization;

namespace B2BApplication.DTO
{
    public class SingleUser
    {
        public string id { get; set; }
        public string name { get; set; }
        public bool etat { get; set; }
        public DateTime creationDate { get; set; }
        public string userName { get; set; }
        public string email { get; set; }
        public string phoneNumber { get; set; }
        public int idClient { get; set; }
        [JsonIgnore]
        public string imagePath { get; set; }
        public string imageContent { get; set; }
        public string clientIntitule { get; set; }
    }
}
