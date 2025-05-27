using Microsoft.AspNetCore.Identity;
using System.Text.Json.Serialization;

namespace B2BApplication.Models
{
    public class User:IdentityUser
    {
        public string Name { get; set; }
        public bool etat { get; set; }
        
        public string? imagePath { get; set; }
        public string? imageContent { get; set; }
        public DateTime creationDate { get; set; }= DateTime.Now;

        public Client? client { get; set; }
        public User? blockedBy { get; set; }

        public ICollection<ArticleViews> viewedArticles { get; set; }

    }
}
