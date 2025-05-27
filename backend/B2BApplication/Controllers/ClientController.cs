using B2BApplication.Context;
using B2BApplication.DTO;
using B2BApplication.Enum;
using B2BApplication.Models;
using Mailjet.Client.Resources;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json;
using Security2.DTO;
using System;
using System.Runtime.Intrinsics.X86;
using System.Security.Claims;

namespace B2BApplication.Controllers
{
    
    [Route("api/client")]
    [ApiController]
    public class ClientController : ControllerBase
    {
        ApplicationDbContext context;
        UserManager<Models.User> manager;
        IWebHostEnvironment environement;
        public ClientController(ApplicationDbContext _context, UserManager<Models.User> _manager, IWebHostEnvironment _environement)
        { 
        context = _context;
        manager = _manager;
        environement = _environement;
        }
        [Authorize(Policy = CustomPolicy.AdminOnly)]
        [HttpPost]
        [Route("signup")]
        public async Task<IActionResult> signup([FromForm] string societe, [FromForm] IFormFile? image)
        {

            SignupDto signupDto = JsonConvert.DeserializeObject<SignupDto>(societe);
            if (context.client.Any(c => c.intitule == signupDto.intituleClient))
            {
                return BadRequest("intitule client doit etre unique");
            }
            if (context.client.Any(c => c.code == signupDto.codeClient))
            {
                return BadRequest("code client doit etre unique");
            }
            if (context.client.Any(c => c.telephone == signupDto.telephoneClient))
            {
                return BadRequest("telephone client doit etre unique");
            }
            if (context.client.Any(c => c.matricule_Fiscale == signupDto.matricule_Fiscale))
            {
                return BadRequest("matricule fiscale client doit etre unique");
            }
            var te = context.TarifEntete.Where((te) => te.TarifEnteteId == signupDto.entTarifId);
            if (te == null)
            {
                return BadRequest("aucun tarif avec cette id");
            }
            var filePath = "";
            if (image != null)
            {
                var fileName = getFileName(image.FileName, signupDto.codeClient);
                filePath = getFilePath(fileName);
                if (System.IO.File.Exists(filePath))
                {
                    System.IO.File.Delete(filePath);
                }
                using (FileStream fs = System.IO.File.Create(filePath))
                {
                    await image.CopyToAsync(fs);
                }

            }

            Client client = new Client()
            {
                adresse = signupDto.adresseClient,
                email = signupDto.emailClient,
                code = signupDto.codeClient,
                codePostale = signupDto.codePostale,
                intitule = signupDto.intituleClient,
                telephone = signupDto.telephoneClient,
                matricule_Fiscale = signupDto.matricule_Fiscale,
                ville = signupDto.ville
                ,
                entTarifId = signupDto.entTarifId,
                imagePath = filePath
            };
            if(image != null) { 
            string fileExt = Path.GetFileName(client.imagePath).Split(".")[1];
            byte[] imageBytes = System.IO.File.ReadAllBytes(client.imagePath);
            var content = Convert.ToBase64String(imageBytes);
            client.imageContent = "data:image/" + fileExt + ";base64, " + content;
            }
            String username = User.FindFirst(ClaimTypes.Name)?.Value;
            if (username == null)
            {
                username = "check username";
            }
            B2BApplication.Models.User userStored = null;
            var user = await manager.FindByNameAsync(signupDto.username);
            if (user == null)
            {
                user = new B2BApplication.Models.User()
                {
                    Email = signupDto.emailClient,
                    UserName = signupDto.username,
                    Name = signupDto.name,
                    PhoneNumber = signupDto.telephoneClient
                ,
                    etat = true,
                };
            }
            else
            {
                return BadRequest("nom utilisateur existe deja ");
            }
            var result = await manager.CreateAsync(user, signupDto.password);
            if (!result.Succeeded)
            {
                return BadRequest();
            }
            else
            {
                userStored = await manager.FindByNameAsync(signupDto.username);
                /*if (!(await userManager.AddToRoleAsync(user, "CLIENT")).Succeeded)
                {
                    await userManager.DeleteAsync(userStored);
                    Response.StatusCode = 500;
                    return Content("something went wrong when assigning roles");
                }*/
                if (!(await manager.AddToRoleAsync(user, "SUPER_CLIENT")).Succeeded)
                {
                    await manager.DeleteAsync(userStored);
                    Response.StatusCode = 500;
                    return Content("probleme au niveau les roles des utilisateur");
                }

                client.userCreate = username;
                client.userUpdate = username;
                userStored.client = client;
                await context.client.AddAsync(client);
                context.SaveChanges();
            }
            return Ok(new { message = "société crée avec succées" });
        }

     
        private string getFileName(string filename, string societeCode)
        {
            var name = filename.Split('.')[0];
            var extension = filename.Split('.')[1];
            return name + "_" + societeCode + "." + extension;
        }
        private string getFilePath(string filename)
        {
            return environement.WebRootPath.Replace("\\", "/") + "/images/Societe/" + filename;
        }
        [Authorize(Roles = "ADMIN")]
        [HttpGet]
        public IActionResult getAllClients()
        {
            var clients = this.context.client.ToList();
            /*foreach (Client client in clients)
            {
                if (client.imagePath == "" || client.imagePath==null)
                {
                    continue;
                }

                string fileExt = Path.GetFileName(client.imagePath).Split(".")[1];
                byte[] imageBytes = System.IO.File.ReadAllBytes(client.imagePath);
                var content = Convert.ToBase64String(imageBytes);
                client.imagePath = "data:image/" + fileExt + ";base64, " + content;
            }*/
            return Ok(clients);
        }
        [Authorize()]
        [HttpGet]
        [Route("{id}")]
        public IActionResult getClientById([FromRoute] int id)
        {
           var client= context.client.Where(c=>c.Id==id).FirstOrDefault();
            if (client == null)
            {
                return NotFound(new { message = "aucun societe avec cette id" });
            }
            else
            {
                /*if (client.imagePath != "" && client.imagePath != null)
                {
                    string fileExt = Path.GetFileName(client.imagePath).Split(".")[1];
                    byte[] imageBytes = System.IO.File.ReadAllBytes(client.imagePath);
                    var content = Convert.ToBase64String(imageBytes);
                    client.imagePath = "data:image/" + fileExt + ";base64, " + content;
                }
                else
                {
                    client.imagePath = "assets/images/avatar/societe.jpg";
                }*/
                return Ok(client);  
            }
        }
        [HttpPut]
        [Route("{id}")]
        [Authorize(Policy = CustomPolicy.ClientOnly)]
        public async  Task<IActionResult> updateClientById([FromRoute] int id,[FromForm] string societe1,[FromForm]IFormFile? image)
        {
           
            
            var clientStored = context.client.Where(c => c.Id == id).FirstOrDefault();
            ClientDto client = JsonConvert.DeserializeObject<ClientDto>(societe1);
            if (client == null)
            {
                return NotFound(new { message = "aucun societe avec cette id" });
            }
            String username = User.FindFirst(ClaimTypes.Name)?.Value;
            var user=context.Users.FirstOrDefault((u)=>u.UserName == username);
            if (user == null)
            {
                return NotFound(new { message = "utilisateur n'est pas trouvé" });
            }
            if (!await manager.CheckPasswordAsync(user, client.password))
            {
                return BadRequest("mot de passe incorrect . aucun modification");
            }
            if (client.intitule!=clientStored.intitule && context.client.Any((c)=>c.intitule==client.intitule))
            {
                return BadRequest("l'intitule doit etre unique");
            }

            if (!client.email.IsNullOrEmpty() && client.email != clientStored.email && context.client.Any((c) => c.email == client.email))
            {
                return BadRequest("email doit etre unique");
            }
         
            if (!client.telephone.IsNullOrEmpty() && client.telephone != clientStored.telephone && context.client.Any((c) => c.telephone == client.telephone))
            {
                return BadRequest("telephone doit etre unique");
            }
            
                clientStored.adresse = client.adresse;
            clientStored.intitule = client.intitule;
            clientStored.email = client.email;
            
            clientStored.telephone = client.telephone;
            clientStored.codePostale=client.codePostale;
            clientStored.ville=client.ville;
           
            clientStored.userUpdate = username;
            clientStored.dateUpdate = DateTime.UtcNow;

            if (image != null)
            {
                if (System.IO.File.Exists(clientStored.imagePath))
                {
                    System.IO.File.Delete(clientStored.imagePath);
                }

                var fileName = getFileName(image.FileName, clientStored.code);
                var filePath = getFilePath(fileName);
                using (FileStream fs = System.IO.File.Create(filePath))
                {

                    await image.CopyToAsync(fs);
                    clientStored.imagePath = filePath;
                }
            }

            if (image != null)
            {
                string fileExt = Path.GetFileName(clientStored.imagePath).Split(".")[1];
                byte[] imageBytes = System.IO.File.ReadAllBytes(clientStored.imagePath);
                var content = Convert.ToBase64String(imageBytes);
                clientStored.imageContent = "data:image/" + fileExt + ";base64, " + content;
            }

            context.SaveChanges();
            return Ok(new {message="mise a jour fait avec succées"});
        }

        

        [HttpPut]
        [Route("{id}/block")]
        [Authorize(Policy = CustomPolicy.AdminOnly)]
        public IActionResult blockArticle([FromRoute] int id)
        {
            
            var client = context.client.FirstOrDefault(c => c.Id==id );
            if (client == null)
            {
                BadRequest("societe introuvable");
            }
            if (client.etat == false)
            {
                BadRequest("societe deja bloqué");
            }
            client.etat = false;
            client.blockedBy = User.FindFirstValue(ClaimTypes.Name);
            context.SaveChanges();
            return Ok(new { message = "société bloqué" });
        }
        [HttpPut]
        [Route("{id}/unblock")]
        [Authorize(Policy = CustomPolicy.AdminOnly)]
        public IActionResult unblockArticle([FromRoute] int id)
        {
            var client = context.client.FirstOrDefault(c => c.Id == id);
            if (client == null)
            {
                BadRequest("societe introuvable");
            }
            if (client.etat == true)
            {
                BadRequest("societe deja n'est pas bloqué");
            }
            client.etat = true;
            client.blockedBy = null;
            context.SaveChanges();
            return Ok(new { message = "société debloqué" });
        }

        [HttpDelete]
        [Route("{id}")]
        [Authorize(Policy = CustomPolicy.AdminOnly)]
        public IActionResult deleteClient(int id)
        {
            var client=context.client.FirstOrDefault((c)=>c.Id==id);
            if (client == null)
            {
                return BadRequest("aucun client avec cette id");
            }
            var commands=context.commandes.Where((c) => c.clientId == id).ToList();
            if (commands.Count > 0)
            {
                return BadRequest("Des commandes étant liées à cette société, sa suppression est impossible.");
            }
            var users=context.Users.Include((u)=>u.client).Where((u)=>u.client.Id==id).ToList();
            foreach (var user in users)
            {
                if (System.IO.File.Exists(user.imagePath))
                {
                    System.IO.File.Delete(user.imagePath);
                }
                context.Users.Remove(user);
               
            }

            if (System.IO.File.Exists(client.imagePath))
            {
                System.IO.File.Delete(client.imagePath);
            }

            context.client.Remove(client);
            context.SaveChanges();
            return Ok(new {message="société supprimée avec succées"});
        }
        [Authorize(Policy=CustomPolicy.AdminOnly)]
        [HttpGet]
        [Route("meilleur")]
        public IActionResult meilleurClients()
        {
            
            var clients = context.client.Include((c)=>c.commandes).ToList();
            var clientsToReturn=new List<BestClient>();

            foreach (var client in clients)
            {
                /*if (!(client.imagePath == "") && !(client.imagePath == null))
                {
                   
                    string fileExt = Path.GetFileName(client.imagePath).Split(".")[1];
                    byte[] imageBytes = System.IO.File.ReadAllBytes(client.imagePath);
                    var content = Convert.ToBase64String(imageBytes);
                    client.imagePath = "data:image/" + fileExt + ";base64, " + content;
                }*/

                BestClient bestClient = new BestClient() { imageContent=client.imageContent};
                decimal commanadesRevenue = 0;
                decimal commanadesVente = 0;
                List<Commande> commandesValide=new List<Commande>();
                foreach (var commande in client.commandes)
                {
                    if(commande.statutId!=1 && commande.statutId != 3)
                    {
                        commandesValide.Add(commande);
                    }
                }
                client.commandes = commandesValide;
                
                foreach (var commande in client.commandes)
                {
                    commande.client = null;
                    commanadesRevenue = commanadesRevenue + commande.commandeRevenue;
                    commanadesVente = commanadesVente + commande.commandeTotalTtc;
                }
                bestClient.totalVente = commanadesVente;
                bestClient.totalRevenue = commanadesRevenue;
                bestClient.nbCommandes=client.commandes.Count();
                bestClient.intitule = client.intitule;
                bestClient.imagePath = client.imagePath;
                bestClient.commandes = client.commandes.ToList();
                clientsToReturn.Add(bestClient);
            }
            clientsToReturn.Sort((c1, c2) => decimal.ToInt32(c2.totalRevenue - c1.totalRevenue));
            return Ok(clientsToReturn);
            }
        }
    }
    


