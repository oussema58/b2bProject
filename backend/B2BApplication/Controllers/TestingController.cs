using B2BApplication.Context;
using B2BApplication.DTO;
using B2BApplication.Models;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using System.Net.Http;

namespace B2BApplication.Controllers
{
    [Route("api/testing")]
    [ApiController]
    public class TestingController : ControllerBase
    {
        ApplicationDbContext context;
        UserManager<User> userManager;
        IWebHostEnvironment environement;
        public TestingController(ApplicationDbContext _context, UserManager<User> _userManager, IWebHostEnvironment _environement)
        {
            context = _context;
            userManager = _userManager;
            this.environement = _environement;
        }

        [HttpPut]
        public IActionResult update() { 
        var commandes=context.commandes.Include((c)=>c.lignes).ToList();
            foreach(var com in commandes)
            {
                foreach(var ligne in com.lignes)
                {
                    ligne.dateCreate=com.dateCreate;
                }
            }
            context.SaveChanges();
            return Ok(new { message = "ok" });
        }
        [HttpPost]
        public async Task<IActionResult> addFamille()
        {
            
        string value = JsonConvert.SerializeObject(new FamilleDto() { FamilleCode="code0.15",FamilleIntitule="bb"});

        var content = new StringContent(value);

        var api = "http://localhost:5083/api/famille";
            var httpClient = new HttpClient();

        // Make a POST request to the API endpoint with the request body
        HttpResponseMessage response = await httpClient.PostAsync(api, content);

            // Check if the request was successful
            if (response.IsSuccessStatusCode)
            {
                // Read the response content as string
                string responseData = await response.Content.ReadAsStringAsync();
                return Ok(responseData);
    }
            else
            {
                // Handle non-success status code
                Console.WriteLine($"API request failed with status code: {response.StatusCode}");
                return null;
            }
        }
        [HttpPut]
        [Route("images")]
        public IActionResult updateImages()
        {
            var users = context.Users.ToList();
            foreach (var user in users)
            {
                if(user.imagePath==null || user.imagePath == "")
                {
                    continue;
                }
                string fileExt = Path.GetFileName(user.imagePath).Split(".")[1];
                byte[] imageBytes = System.IO.File.ReadAllBytes(user.imagePath);
                var content = Convert.ToBase64String(imageBytes);
                user.imageContent = "data:image/" + fileExt + ";base64, " + content;
                
            }
            var clients = context.client.ToList();
            foreach (var client in clients)
            {
                if (client.imagePath == null || client.imagePath == "")
                {
                    continue;
                }
                string fileExt = Path.GetFileName(client.imagePath).Split(".")[1];
                byte[] imageBytes = System.IO.File.ReadAllBytes(client.imagePath);
                var content = Convert.ToBase64String(imageBytes);
                client.imageContent = "data:image/" + fileExt + ";base64, " + content;

            }
            var articles = context.article.ToList();
            foreach (var art in articles)
            {
                if (art.imagePath == null || art.imagePath == "")
                {
                    continue;
                }
                string fileExt = Path.GetFileName(art.imagePath).Split(".")[1];
                byte[] imageBytes = System.IO.File.ReadAllBytes(art.imagePath);
                var content = Convert.ToBase64String(imageBytes);
                art.imageContent = "data:image/" + fileExt + ";base64, " + content;

            }
            context.SaveChanges();
            return Ok(new { message = "ok" });
        }
    }
}
