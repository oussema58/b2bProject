using B2BApplication.Context;
using B2BApplication.DTO;
using B2BApplication.Enum;
using B2BApplication.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json;
using Security2.DTO;
using System.Net.Sockets;
using System.Security.Claims;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;

namespace B2BApplication.Controllers
{
    [Route("api")]
    [ApiController]
    public class UserController : ControllerBase
    {
        ApplicationDbContext context;
        UserManager<User> manager;
        IWebHostEnvironment environement;
        public UserController(ApplicationDbContext _context,UserManager<User> _manager,
             IWebHostEnvironment _environement) { 
        context = _context;
            manager = _manager;
            environement= _environement;
        }
        /*[HttpGet]
        [Route("{idClient}/user")]
        [Authorize(Policy = CustomPolicy.AdminClientOnly)]
        public IActionResult getUsers([FromRoute] int idClient)
        {
var client=context.client.Where(c=>c.Id==idClient).Include(c=>c.users).FirstOrDefault();
            if (client == null)
            {
                return NotFound("aucun client avec cette id");
            }
            
            foreach(var u in client.users)
            {
                {

                };
                u.client = null;
                if (u.imagePath == "" || u.imagePath == null)
                {
                    continue;
                }
                string fileExt = Path.GetFileName(u.imagePath).Split(".")[1];
                byte[] imageBytes = System.IO.File.ReadAllBytes(u.imagePath);
                var content = Convert.ToBase64String(imageBytes);
                u.imagePath = "data:image/" + fileExt + ";base64, " + content;
            }
           return Ok(client.users);
        }*/
        [HttpGet]
        [Route("{idClient}/user")]
        [Authorize(Policy = CustomPolicy.AdminClientOnly)]
        public async Task<IActionResult> getUsers([FromRoute] int idClient)
        {
            var client = context.client.Where(c => c.Id == idClient).Include(c => c.users).FirstOrDefault();
            if (client == null)
            {
                return NotFound("aucun client avec cette id");
            }
            List<UserDtoWithRole> users = new List<UserDtoWithRole>();
            foreach (var u in client.users)
            {
                var user = new UserDtoWithRole()
                {
                    creationDate = u.creationDate,
                    email=u.Email,
                    etat = u.etat,
                    name=u.Name,
                    phoneNumber=u.PhoneNumber,
                    userName=u.UserName,
                    Id=u.Id,
                    role = (await manager.GetRolesAsync(u))[0],
                    imageContent=u.imageContent
  
                };
                users.Add(user);
                /*if (u.imagePath == "" || u.imagePath == null)
                {
                    continue;
                }
                string fileExt = Path.GetFileName(u.imagePath).Split(".")[1];
                byte[] imageBytes = System.IO.File.ReadAllBytes(u.imagePath);
                var content = Convert.ToBase64String(imageBytes);
                user.imageContent = "data:image/" + fileExt + ";base64, " + content;*/
            }
            return Ok(users);
        }
        [HttpPost]
        [Route("{idClient}/user")]
        [Authorize(Policy = CustomPolicy.SuperClientOnly)]
        public async Task<IActionResult> addUser([FromRoute] int idClient,[FromForm] string user1, [FromForm] IFormFile? image)
        {
             UserDto2 user= JsonConvert.DeserializeObject<UserDto2>(user1);
            
            var usernameExists = context.Users.Any((u) => u.UserName == user.username);
            if (user.username.IsNullOrEmpty())
            {
                return BadRequest("tu dois specifier nom d'utilisateur");
            }
            if (usernameExists)
            {
                return BadRequest("nom d'utilisateur doit etre unique");
            }
            if (!user.telephone.IsNullOrEmpty() && context.Users.Any((u) => u.PhoneNumber == user.telephone))
            {
                return BadRequest("numero de telephone doit etre unique");
            }
            if (!user.email.IsNullOrEmpty() && context.Users.Any((u) => u.Email == user.email))
            {
                return BadRequest("email doit etre unique");
            }
            var client = context.client.FirstOrDefault((c) => c.Id == idClient);
            var filePath = "";
            if (image != null)
            {
                var fileName = getFileName(image.FileName,user.username);
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

            var userToStore = new User()
            {
                Email = user.email,
                PhoneNumber = user.telephone,
                UserName = user.username,
                Name = user.name,
                client = client,
                imagePath = filePath,
                etat=true
                
            };
            if (image!=null)
            {
               
            string fileExt = Path.GetFileName(userToStore.imagePath).Split(".")[1];
            byte[] imageBytes = System.IO.File.ReadAllBytes(userToStore.imagePath);
            var content = Convert.ToBase64String(imageBytes);
            userToStore.imageContent = "data:image/" + fileExt + ";base64, " + content;
            }
            await manager.CreateAsync(userToStore, user.password);
            var userStored = await manager.FindByNameAsync(user.username);
            if (!(await manager.AddToRoleAsync(userStored, "CLIENT")).Succeeded)
            {
                await manager.DeleteAsync(userStored);
                Response.StatusCode = 500;
                return Content("Une erreur s'est produite lors de l'attribution des rôles.");
            }

            context.SaveChanges();
            return Ok(new { message = "compte client crée avec succées" });

        }
        private string getFileName(string filename, string username )
        {
            var name = filename.Split('.')[0];
            var extension = filename.Split('.')[1];
            return name + "_" + User + "." + extension;
        }
        private string getFilePath(string filename)
        {
            return environement.WebRootPath.Replace("\\", "/") + "/images/User/" + filename;
        }

        /*[HttpPost]
        [Route("{idClient}/user")]
        [Authorize(Policy = CustomPolicy.SuperClientOnly)]
        public async Task<IActionResult> addUser([FromRoute] int idClient, [FromBody] UserDto2 user)
        {
            var usernameExists = context.Users.Any((u)=>u.UserName==user.username);
            if (user.username.IsNullOrEmpty())
            {
                return BadRequest("username should be added");
            }
            if (usernameExists)
            {
                return BadRequest("username should be unique");
            }
            if(!user.telephone.IsNullOrEmpty() && context.Users.Any((u) => u.PhoneNumber == user.telephone))
            {
                return BadRequest("phone number should be unique");
            }
            if (!user.email.IsNullOrEmpty() && context.Users.Any((u) => u.Email == user.email))
            {
                return BadRequest("email should be unique");
            }
            var client=context.client.FirstOrDefault((c)=>c.Id==idClient);
            var userToStore=new User() { Email = user.email,PhoneNumber=user.telephone,UserName=user.username,
            Name=user.name,client=client};
           await manager.CreateAsync(userToStore,user.password);
            var userStored = await manager.FindByNameAsync(user.username);
            if (!(await manager.AddToRoleAsync(userStored, "CLIENT")).Succeeded)
            {
                await manager.DeleteAsync(userStored);
                Response.StatusCode = 500;
                return Content("something went wrong when assigning roles");
            }

            context.SaveChanges();
            return Ok(new { message = "user added successfully" });

        }*/

        [Route("admin/update/user/{idUser}")]
        [HttpPut]
        public async Task<IActionResult> updateUserByAdmin([FromRoute ] string idUser,[FromBody]UserUpdateAdmin user)
        {
            
            var userStored = await manager.FindByIdAsync(idUser);
          
            if (userStored == null)
            {
                BadRequest("aucun client avec cette id");
            }
            if (!user.email.IsNullOrEmpty())
            {
                userStored.Email = user.email;
            }
            if (!user.telephone.IsNullOrEmpty())
            {
                userStored.PhoneNumber = user.telephone;
            }
            if (!user.name.IsNullOrEmpty())
            {
                userStored.Name = user.name;
            }
            userStored.etat=user.etat;
            await manager.UpdateAsync(userStored);
            context.SaveChanges();
            return Ok(new {message="utilisateur mise a jour fait avec succées"});

        }
        [HttpDelete]
        [Route("user/{id}")]
        [Authorize(Policy = CustomPolicy.AdminSuperClientOnly)]
        public async Task<IActionResult> deleteById([FromRoute] string id)
        {
            var user=context.Users.Where((u) => u.Id == id).FirstOrDefault();
            if (user == null)
            {
                return NotFound("aucun utilisateur avec cette id");
            }
            if (await manager.IsInRoleAsync(user, "SUPER_CLIENT"))
            {
                return BadRequest("on ne peut pas supprimer ce compte car il est compte principale");
            }
                if (await manager.IsInRoleAsync(user, "CLIENT"))
            {

            
            var commandes = context.commandes.Include((c)=>c.userCreate).Where((c) =>c.userCreate.Id  == id).ToList();
            if(commandes.Count() > 0)
            {
                return BadRequest("La présence de commandes liées à ce client empêche sa suppression");
            }
            var lignes =context.lignePaniers.Where((lp)=>lp.userId == id).ToList();
            foreach(var ligne in lignes)
            {
                context.lignePaniers.Remove(ligne);
            }
                if (System.IO.File.Exists(user.imagePath))
                {
                    System.IO.File.Delete(user.imagePath);
                }
                context.Users.Remove(user);
                context.SaveChanges();
            return Ok(new { message = "utilisateur supprimé avec succées" });
            }
            else
            {
                return BadRequest("on ne peut pas supprimer un compte admin pour le moment");
            }
        }
        [HttpGet]
        [Route("user/{id}")]
        [Authorize(Policy = CustomPolicy.AdminClientOnly)]
        public async Task<IActionResult> getUserById([FromRoute] string id)
        {
            var user = context.Users.Include((u)=>u.client).Where((u) => u.Id == id).FirstOrDefault();
            
            if (user == null)
            {
                return NotFound("aucun utilisateur avec cet id");
            }
            /* if (user.imagePath!=null && user.imagePath != "")
             {
                 string fileExt = Path.GetFileName(user.imagePath).Split(".")[1];
                 byte[] imageBytes = System.IO.File.ReadAllBytes(user.imagePath);
                 var content = Convert.ToBase64String(imageBytes);
                 user.im = "data:image/" + fileExt + ";base64, " + content;
             }
             else
             {
                 user.imagePath = "assets/images/avatar/account.png";
             }*/
            string intituleClient = null;
            if (!await manager.IsInRoleAsync(user, "ADMIN"))
            {
                intituleClient = user.client.intitule;
            }
            var userToReturn = new SingleUser()
            {
                creationDate = user.creationDate,
                email = user.Email,
                etat = user.etat,
                id = user.Id,
                idClient = user.client.Id,
                name = user.Name,
                phoneNumber = user.PhoneNumber,
                userName = user.UserName,
                imagePath = user.imagePath,
                clientIntitule= intituleClient,
                imageContent=user.imageContent
                
            };
            return Ok(userToReturn);
        }
        [HttpGet]
        [Route("user")]
        [Authorize(Policy = CustomPolicy.AdminClientOnly)]
        public async Task<IActionResult> getUser()
        {
            String username = User.FindFirst(ClaimTypes.Name)?.Value;
            var user = context.Users.Include((u) => u.client).Where((u) => u.UserName == username).FirstOrDefault();

            if (user == null)
            {
                return BadRequest("aucun utilisateur avec cet id");
            }
            /*if (user.imagePath!=null && user.imagePath != "")
            {
                string fileExt = Path.GetFileName(user.imagePath).Split(".")[1];
                byte[] imageBytes = System.IO.File.ReadAllBytes(user.imagePath);
                var content = Convert.ToBase64String(imageBytes);
                user.imagePath = "data:image/" + fileExt + ";base64, " + content;
            }*/
            int idClient = 0;
            if (!await manager.IsInRoleAsync(user, "ADMIN"))
            {
                idClient = user.client.Id;
            }
            var userToReturn = new SingleUser()
            {
                creationDate = user.creationDate,
                email = user.Email,
                etat = user.etat,
                id = user.Id,
                idClient = idClient,
                name = user.Name,
                phoneNumber = user.PhoneNumber,
                userName = user.UserName,
                imagePath = user.imagePath,
            };
            return Ok(userToReturn);
        }
        [HttpGet]
        [Route("user/dashboard")]
        [Authorize(Policy = CustomPolicy.ClientOnly)]
        public async Task<IActionResult> getUserDashboardInfo()
        {
            String username = User.FindFirst(ClaimTypes.Name)?.Value;
            var user = context.Users.Include((u) => u.client).Where((u) => u.UserName == username).FirstOrDefault();

            if (user == null)
            {
                return BadRequest("aucun utilisateur avec cet id");
            }
            if(manager.IsInRoleAsync(user,"ADMIN").Result)
            {
                return BadRequest("admin n'est pas autorisé a cet api");
            }
            var commandes=context.commandes.Include((c)=>c.userCreate).Where((c)=>c.clientId==user.client.Id).ToList();
            int nbCommandeUser = 0;
            foreach(var commande in commandes)
            {
                if (commande.userCreate.UserName == username)
                {
                    nbCommandeUser++;
                }
            }

            var demandes = context.demandesRetour.Where((dr) => dr.clientId == user.client.Id).ToList();
            int nbDemandeUser = 0;
            foreach (var demande in demandes)
            {
                if (demande.userId == user.Id)
                {
                    nbDemandeUser++;
                }
            }

            var lignesPanier=context.lignePaniers.Where((lp)=>lp.userId == user.Id).ToList();
            var lignesWishlist=context.ligneWishList.Where((lw) => lw.userId == user.Id).ToList();

            //var users = context.Users.Include((u)=>user.client).Where((u) => u.client.Id == user.client.Id).ToList();
            var client = context.client.Include((c)=>c.users).Where((c) => c.Id == user.client.Id).FirstOrDefault();
            DashboardDto dashboardDto = new DashboardDto()
            {
                nbCommandeClient = nbCommandeUser,
                nbCommandeSociete = commandes.Count,
                nbCompte = client.users.Count,
                nbPanier = lignesPanier.Count,
                nbWishlist = lignesWishlist.Count,
                nbRetourSociete = demandes.Count,
                nbRetourClient = nbDemandeUser
            };
            return Ok(dashboardDto);
        }

        [HttpGet]
        [Route("admin/dashboard")]
        [Authorize(Policy = CustomPolicy.AdminOnly)]
        public async Task<IActionResult> getAdminDashboardInfo()
        {
            String username = User.FindFirst(ClaimTypes.Name)?.Value;
            //var user = context.Users.Include((u) => u.client).Where((u) => u.UserName == username).FirstOrDefault();
            var user = context.Users.Where((u) => u.UserName == username).FirstOrDefault();
            if (user == null)
            {
                return BadRequest("aucun utilisateur avec ce nom d'utilisateur");
            }
           
            var articles = context.article.Where((a) => a.ArticleEtat).ToList();
            var nbArticles=articles.Count;
            var clients=context.client.Where((c)=>c.etat).ToList();
            var nbClients=clients.Count;
            var demandes = context.demandesRetour.ToList();
            var nbDemandesRetours = demandes.Count;
            var commandes=context.commandes.Include((c)=>c.lignes).Where((c)=>c.statutId!=1 && c.statutId!=3).ToList();
            var nbCommandes=commandes.Count;
            decimal totalRevenue = 0;
            decimal totalVente = 0;
            decimal totalPrixBaseCommande = 0;

            foreach (var commande in commandes)
            {
                totalVente = totalVente + commande.commandeTotalTtc;
                totalRevenue = totalRevenue + commande.commandeRevenue;
                
            }
            var dashboardInfo = new AdminDashboardDto()
            {
                nbArticles = nbArticles,nbClients = nbClients,nbCommandes = nbCommandes,nbRetours=nbDemandesRetours,
                totalRevenue = totalRevenue,totalVente = totalVente
            };
            return Ok(dashboardInfo);
        }

        [HttpPut]
        [Route("user/{username}/block")]
        [Authorize(Policy = CustomPolicy.AdminSuperClientOnly)]
        public async Task<IActionResult> blockUser([FromRoute] string username)
        {
            var userWhoBlocked=context.Users.FirstOrDefault((u)=>u.UserName== User.FindFirstValue(ClaimTypes.Name));
            var user = context.Users.FirstOrDefault(u => u.UserName == username);
            if (user == null)
            {
                BadRequest("compte client introuvable");
            }
            if (await manager.IsInRoleAsync(user, "ADMIN"))
            {
                BadRequest("tu ne peut pas bloquer un administrateur");
            }
            if (user.etat == false)
            {
                BadRequest("compte client deja bloqué");
            }
            user.etat = false;
            user.blockedBy = userWhoBlocked;
            context.SaveChanges();
            return Ok(new { message = "compte client bloqué avec succées" });
        }
        [HttpPut]
        [Route("user/{username}/unblock")]
        [Authorize(Policy = CustomPolicy.AdminSuperClientOnly)]
        public async Task<IActionResult> unblockUser([FromRoute] string username)
        {
            var user = context.Users.Include((u)=>u.blockedBy).FirstOrDefault(u => u.UserName == username);
            if (user == null)
            {
                BadRequest("compte client introuvable");
            }
           
            if (user.etat == true)
            {
                BadRequest("compte client deja verouillé");
            }
            user.etat = true;
            user.blockedBy = null;
            context.SaveChanges();
            return Ok(new { message = "compte client verouillé avec succées" });
        }
        [HttpPut]
        [Route("user")]
        [Authorize(Policy = CustomPolicy.AdminSuperClientOnly)]
        public async Task<IActionResult> updateUser([FromForm] string user1, [FromForm] IFormFile? image)
        {
            String username = User.FindFirst(ClaimTypes.Name)?.Value;
            var user = context.Users.FirstOrDefault(u => u.UserName == username);
            if (user == null)
            {
                return BadRequest("compte client introuvable");
            }
            UserUpdateDto userDto = JsonConvert.DeserializeObject<UserUpdateDto>(user1);
            if(!await manager.CheckPasswordAsync(user, userDto.password))
            {
                return BadRequest("mot de passe incorrect . aucun modification");
            }
            if (user.PhoneNumber!=userDto.telephone && context.Users.Any((u) => u.PhoneNumber == userDto.telephone))
            {
                return BadRequest("numero de telephone doit etre unique");
            }
            user.PhoneNumber = userDto.telephone;
            if (user.Email != userDto.email && context.Users.Any((u) => u.Email == userDto.email))
            {
                return BadRequest("email doit etre unique");
            }
            /* logic email*/
            user.Email = userDto.email;
         

            
            user.Name= userDto.name;

            if (image != null)
            {
                if (System.IO.File.Exists(user.imagePath))
                {
                    System.IO.File.Delete(user.imagePath);
                }

                var fileName = getFileName(image.FileName, user.UserName);
                var filePath = getFilePath(fileName);
                using (FileStream fs = System.IO.File.Create(filePath))
                {

                    await image.CopyToAsync(fs);
                    user.imagePath = filePath;
                }
            }
            if(image!=null)
            {
                string fileExt = Path.GetFileName(user.imagePath).Split(".")[1];
                byte[] imageBytes = System.IO.File.ReadAllBytes(user.imagePath);
                var content = Convert.ToBase64String(imageBytes);
                user.imageContent = "data:image/" + fileExt + ";base64, " + content;
            }

            context.SaveChanges();
            return Ok(new { message = "compte client modifié avec succées" });
        }

        [HttpPut]
        [Route("user/v2/{id}")]
        [Authorize(Policy = CustomPolicy.AdminSuperClientOnly)]
        public async Task<IActionResult> updateUserBySuperClient([FromRoute] string id ,[FromForm] string user1, [FromForm] IFormFile? image)
        {
            UserUpdateDto2 userDto = JsonConvert.DeserializeObject<UserUpdateDto2>(user1);

           
            var user = context.Users.FirstOrDefault(u => u.Id == id);
            if (user == null)
            {
                return BadRequest("compte client introuvable");
            }
           
           
            if (user.PhoneNumber != userDto.telephone && context.Users.Any((u) => u.PhoneNumber == userDto.telephone))
            {
                return BadRequest("numero de telephone doit etre unique");
            }
            user.PhoneNumber = userDto.telephone;
            if (user.Email != userDto.email && context.Users.Any((u) => u.Email == userDto.email))
            {
                return BadRequest("email doit etre unique");
            }
            
                /* logic email*/
               user.Email = userDto.email;
            user.Name = userDto.name;
            user.etat = userDto.etat;
            /*change username*/
           
                if (!userDto.password.IsNullOrEmpty()) { 
            await manager.RemovePasswordAsync(user);
            await manager.AddPasswordAsync(user, userDto.password);
            }

            if (image != null)
            {
                if (System.IO.File.Exists(user.imagePath))
                {
                    System.IO.File.Delete(user.imagePath);
                }

                var fileName = getFileName(image.FileName, user.UserName);
                var filePath = getFilePath(fileName);
                using (FileStream fs = System.IO.File.Create(filePath))
                {

                    await image.CopyToAsync(fs);
                    user.imagePath = filePath;
                }
            }

            if (image != null)
            {
                string fileExt = Path.GetFileName(user.imagePath).Split(".")[1];
                byte[] imageBytes = System.IO.File.ReadAllBytes(user.imagePath);
                var content = Convert.ToBase64String(imageBytes);
                user.imageContent = "data:image/" + fileExt + ";base64, " + content;
            }

            context.SaveChanges();
            return Ok(new { message = "compte client modifié avec succées" });
        }
    }

   
}
