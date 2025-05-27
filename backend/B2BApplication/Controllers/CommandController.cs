using B2BApplication.Context;
using B2BApplication.DTO;
using B2BApplication.Enum;
using B2BApplication.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using System.Net.Http;
using System.Security.Claims;

namespace B2BApplication.Controllers
{
    [Route("api")]
    [ApiController]
    public class CommandController : ControllerBase
    {
        ApplicationDbContext context;
        HttpClient httpClient;
        public CommandController(ApplicationDbContext _context) { 
            context = _context;
            httpClient = new HttpClient();
        }
        [HttpGet]
        [Authorize(Policy = CustomPolicy.ClientOnly)]
        [Route("command/user/{clientId}")]
        public IActionResult getAllCommandByClient([FromRoute] int clientId)
        {
            var commandes=context.commandes
                .Include((c)=>c.statut)
                .Include((c) => c.userCreate)
                .Where((c)=> c.clientId == clientId).OrderByDescending((c) => c.commandeDate).ToList();
            foreach(var command in commandes)
            {
                command.statut.commandes = null;
                command.demandeRetour = context.demandesRetour.Where((dr) => dr.commandeId == command.commandeId).FirstOrDefault();
                if(command.demandeRetour != null)
                {
                    command.demandeRetour.client = null;
                    command.demandeRetour.admin = null;
                    command.demandeRetour.commande = null;
                    command.userCreate.PasswordHash = null;
                    

                }

            }
            return Ok(commandes);
        }
       /* [HttpGet]
        [Authorize(Policy = CustomPolicy.AdminOnly)]
        [Route("command/v2")]
        public IActionResult getCommandByCategory()
        {
            var lignesCommandes = context.commandeLignes
                .Include((cl) => cl.article);
            var catalogues=context.catalogue.Where((c)=>c.CatalogueNiveau==3).ToList();
            List<LigneCommandeDto2> lignes=new List<LigneCommandeDto2>();
            foreach(var cat in catalogues)
            {
                if(!context.article.Any((a) => a.CatalogueId == cat.CatalogueId))
                
                {
                    continue;
                }
                decimal totalVente = 0;
                decimal totalRevenue = 0;

                LigneCommandeDto2 commandeDto2 = new LigneCommandeDto2() { catalogue = cat.CatalogueIntitule };
                commandeDto2.lignes = new List<CommandeLigne>();
                foreach(var ligne in lignesCommandes)
                {
                    if (ligne.article.Catalogue.CatalogueIntitule == commandeDto2.catalogue)
                    {
                        commandeDto2.lignes.Add(ligne);
                        totalVente= totalVente+ligne.ligneTotalTtc;
                        totalRevenue = totalRevenue + ligne.ligneRevenue;
                    }
                }
                commandeDto2.totalRevenue = totalRevenue;
                commandeDto2 .totalVente = totalVente;
                lignes.Add(commandeDto2);
            }
               
                
           
            return Ok(lignes);
        }*/
        [HttpGet]
        [Authorize(Policy = CustomPolicy.AdminOnly)]
        [Route("command/v2")]
        public IActionResult getCommandByCategory()
        {
            var commandes= context.commandes.Where((c)=>c.statutId!=1 && c.statutId!=3)
                .Include((c) => c.lignes).ToList();
            var lignesCommandes = new List<CommandeLigne>();
            foreach (var command in commandes)
            {
                var list=context.commandeLignes.Include((cl)=>cl.article).Where((cl)=>cl.commandeId==command.commandeId).ToList();  
                lignesCommandes.AddRange(list);
            }
            foreach (var ligne in lignesCommandes)
            {
                ligne.commande = null;
            }
            
            var catalogues=context.catalogue.Where((c)=>c.CatalogueNiveau==3).ToList();
            List<LigneCommandeDto2> lignes=new List<LigneCommandeDto2>();
            foreach(var cat in catalogues)
            {
                if(!context.article.Any((a) => a.CatalogueId == cat.CatalogueId))
               
                {
                    continue;
                }
                decimal totalVente = 0;
                decimal totalRevenue = 0;

                LigneCommandeDto2 commandeDto2 = new LigneCommandeDto2() { catalogue = cat.CatalogueIntitule };
                commandeDto2.lignes = new List<CommandeLigne>();
                foreach(var ligne in lignesCommandes)
                {
                    if (ligne.article.Catalogue.CatalogueIntitule == commandeDto2.catalogue)
                    {
                        commandeDto2.lignes.Add(ligne);
                        totalVente= totalVente+ligne.ligneTotalTtc;
                        totalRevenue = totalRevenue + ligne.ligneRevenue;
                    }
                }
                commandeDto2.totalRevenue = totalRevenue;
                commandeDto2 .totalVente = totalVente;
                lignes.Add(commandeDto2);
            }
             
                
           
            return Ok(lignes);
        }

        [HttpGet]
        [Authorize(Policy = CustomPolicy.AdminOnly)]
        [Route("command")]
        public IActionResult getAllCommand()
        {
            var commandes = context.commandes
                .Include((c) => c.userCreate)
                .Include((c) => c.statut).ToList();

            foreach (var command in commandes)
            {
                command.statut.commandes = null;

            }
            return Ok(commandes);
        }

        [HttpGet]
        [Authorize()]
        [Route("command/{orderId}")]
        public IActionResult getCommandById([FromRoute] int orderId)
        {
            //added demande to check it this command ha alreafy demande retour
            var commande = context.commandes.Where((c)=>c.commandeId==orderId)
                .Include((c)=>c.lignes)
                .Include((c) => c.statut).
                Include((c) => c.demandeRetour).
                FirstOrDefault();
                
            if (commande == null)
            {
                return NotFound("aucun commande avec cette id");
            }
            commande.statut.commandes = null;
            if (commande.demandeRetour != null) { 
            commande.demandeRetour.client = null;
            commande.demandeRetour.admin = null;
            commande.demandeRetour.commande = null;
            }
            foreach (var ligne in commande.lignes)
            {
                ligne.article = null;
                ligne.commande = null;
                ligne.userCreate = null;
                
                
            }
            return Ok(commande);
        }
        [HttpPut]
        [Authorize(Policy = CustomPolicy.AdminOnly)]
        [Route("command/{idCommand}")]
        public IActionResult updateCommandStatus([FromRoute] int idCommand, [FromBody] UpdateCommandeDto updateDto)
        {
            var command = context.commandes.Where((c) => c.commandeId == idCommand).FirstOrDefault();
            if (command == null)
            {
                return NotFound("aucun commande avec cette id");
            }
            var statut = context.statusCommandes.Where((s) => s.statustIntitule == updateDto.status).FirstOrDefault();
            if (statut == null)
            {
                return NotFound("aucun statut avec cete intitule");
            }
            if(statut.statusId == 2) {
                command.commandeDateLivraisonPrevue = updateDto.datePrevue;
            }
            command.statutId = statut.statusId;
            
            context.SaveChanges();
            return Ok(new { message = "La mise à jour du statut de la commande a été effectuée avec succès." });
        }



        [HttpPut]
        [Authorize(Policy = CustomPolicy.AdminOnly)]
        [Route("command/{idCommand}/status/{status}")]
        public IActionResult updateCommandStatus([FromRoute] int idCommand, [FromRoute] string status) {
            var command=context.commandes.Where((c)=>c.commandeId == idCommand).FirstOrDefault();
            if (command == null)
            {
                return NotFound("aucun commande avec cette id");
            }
            var statut=context.statusCommandes.Where((s)=>s.statustIntitule == status).FirstOrDefault();
            if(statut == null)
            {
                return NotFound("aucun statut avec cete intitule");
            }

            command.statutId = statut.statusId;
            context.SaveChanges();
            return Ok(new {message= "La mise à jour du statut de la commande a été effectuée avec succès." });
                }





        /*[HttpPut]
        [Authorize(Policy = CustomPolicy.AdminOnly)]
        [Route("command/{idCommand}/status/{status}")]
        public async Task<IActionResult> updateCommandStatus([FromRoute] int idCommand, [FromRoute] string status)
        {
            var command = context.commandes.Where((c) => c.commandeId == idCommand).FirstOrDefault();
            if (command == null)
            {
                return NotFound("aucun commande avec cette id");
            }
            var statut = context.statusCommandes.Where((s) => s.statustIntitule == status).FirstOrDefault();
            if (statut == null)
            {
                return NotFound("aucun statut avec cete intitule");
            }
            var body = new ValidateCommandeDto() { id = command.commandeNumero };
            if(statut.statusId== 2)
            {
                string value = JsonConvert.SerializeObject(body);

                var content = new StringContent(value);

                var api = "http://172.16.1.23:90/api/Factures/ValidationDocument/"+command.commandeNumero;

                // Make a POST request to the API endpoint with the request body
                HttpResponseMessage response = await httpClient.GetAsync(api);

                // Check if the request was successful
                if (response.IsSuccessStatusCode)
                {
                    //command.statutId = statut.statusId;
                    
                    // Read the response content as string
                    string responseData = await response.Content.ReadAsStringAsync();
                    //context.SaveChanges();
                    return Ok(responseData);
                }
                else
                {
                    // Handle non-success status code
                    Console.WriteLine($"API request failed with status code: {response.StatusCode}");
                    return BadRequest();
                }

            }else if (statut.statusId== 3)
            {
                /*command.statutId = statut.statusId;
                context.SaveChanges();
                return Ok(new { message = "La mise à jour du statut de la commande a été effectuée avec succès." });
            }
            return BadRequest("La mise à jour du statut de la commande a terminé avec erreur.");
        }*/

        [HttpPost]
        [Authorize(Policy = CustomPolicy.ClientOnly)]
        [Route("command")]
        public async Task<IActionResult> addCommand([FromBody(EmptyBodyBehavior = EmptyBodyBehavior.Allow)] CommandeDto? commande)
        {
            if (commande == null)
            {
                return BadRequest("remplir panier avant de passer commande");
            }
            if (commande.lignes.Count == 0)
            {
                return BadRequest("remplir panier avant de passer commande");
            }
            var user = context.Users.Where((u) => u.UserName == commande.username).FirstOrDefault();
            if (user == null)
            {
                return NotFound("aucun utilisateur avec ce nom");
            }
            var client = context.client.Where((c) => c.Id == commande.clientId).FirstOrDefault();
            if (client == null)
            {
                return NotFound("aucun société avec cette id");
            }
            var nbArtcile = 0;
            decimal totalHt = 0;
            decimal totalTva = 0;
            decimal totalTtc = 0;
            decimal revenue = 0;
            Commande commande1 = new Commande();
            commande1.lignes = new List<CommandeLigne>();
            foreach (var ligne in commande.lignes)
            {
                var ligneToStore = new CommandeLigne()
                {
                    articleId = ligne.articleId,
                    articleCode = ligne.articleCode,
                    articleIntitule = ligne.articleIntitule,
                    articlePrixHt = ligne.tarif,
                    ligneQuantite = ligne.ligneQuantite,
                    ligneTotalHt = ligne.ligneTotalHt,
                    ligneTotalTaxes = ligne.ligneTotalTaxes,
                    ligneTotalTtc = ligne.ligneTotalTtc,
                    articleTauxTva = ligne.tva,
                    articlePrixTtc = (ligne.tva + ligne.tarif),
                    userId = user.Id
                };
                var article = context.article.FirstOrDefault((a) => a.ArticleID == ligne.articleId);
                if (article == null)
                {
                    return BadRequest("Un problème est survenu.");
                }
                article.nbArticleSold = article.nbArticleSold + ligne.ligneQuantite;
              
                ligneToStore.ligneRevenue = ligne.ligneTotalHt - article.ArticlePrixHT * ligne.ligneQuantite;
                revenue = revenue + ligneToStore.ligneRevenue;
                nbArtcile = nbArtcile + ligne.ligneQuantite;

                totalHt = totalHt + ligne.ligneTotalHt;
                totalTva = totalTva + ligne.ligneTotalTaxes;
                totalTtc = totalTtc + ligne.ligneTotalTtc;
                commande1.lignes.Add(ligneToStore);
            }
            Statut status = context.statusCommandes.Where((s) => s.statustIntitule == "Cree").FirstOrDefault();

            if (status == null)
            {
                NotFound("aucun statut avec cette intitule");
            }
           
            commande1.client = client;
            commande1.clientCode = client.code;
            commande1.clientIntitule = client.intitule;
            commande1.userCreate = user;
            commande1.commandesNbrArticles = nbArtcile;
            commande1.commandeTotalHt = totalHt;
            commande1.commandeTotalTaxes = totalTva;
            commande1.commandeTotalTtc = totalTtc;
            commande1.statutId = status.statusId;
            commande1.commandeNumero = generateCommandNum();
            commande1.commandeDateLivraisonPrevue = DateTime.Now.AddDays(2);


            
            commande1.commandeRevenue = revenue;
            context.commandes.Add(commande1);
          


            context.SaveChanges();
            return Ok(new { messaage = "commande en cour d'evaluation" });
        }
       /* [HttpGet]
        [Authorize(Policy = CustomPolicy.AdminOnly)]
        [Route("facture")]
        public async Task<IActionResult> getFacture([FromQuery] string id)
        {
       
            var api = "http://172.16.1.23:90/api/Factures/AddDocument";

            // Make a POST request to the API endpoint with the request body
            HttpResponseMessage response = await httpClient.PostAsync(api, content);

            // Check if the request was successful
            if (response.IsSuccessStatusCode)
            {
                context.commandes.Add(commande1);
                // Read the response content as string
                string responseData = await response.Content.ReadAsStringAsync();
                context.SaveChanges();
                return Ok(responseData);
            }
            else
            {
                // Handle non-success status code
                Console.WriteLine($"API request failed with status code: {response.StatusCode}");
                return null;
            }
        }*/
       

        /*[HttpPost]
        [Authorize(Policy = CustomPolicy.ClientOnly)]
        [Route("command")]
        public async Task<IActionResult> addCommand([FromBody(EmptyBodyBehavior = EmptyBodyBehavior.Allow)] CommandeDto? commande)
        {
            if(commande == null)
            {
                return BadRequest("remplir panier avant de passer commande");
            }
            if(commande.lignes.Count == 0)
            {
                return BadRequest("remplir panier avant de passer commande");
            }
            var user = context.Users.Where((u) => u.UserName==commande.username).FirstOrDefault();
            if (user == null)
            {
                return NotFound("aucun utilisateur avec ce nom");
            }
            var client = context.client.Where((c) => c.Id == commande.clientId).FirstOrDefault();
            if (client == null)
            {
                return NotFound("aucun société avec cette id");
            }
            var nbArtcile = 0;
            decimal totalHt = 0;
            decimal totalTva = 0;
            decimal totalTtc = 0;
            decimal revenue = 0;
            Commande commande1 = new Commande();
            commande1.lignes = new List<CommandeLigne>();
            foreach (var ligne in commande.lignes) {
                var ligneToStore=new CommandeLigne() { articleId=ligne.articleId,articleCode=ligne.articleCode,articleIntitule=ligne.articleIntitule,
                articlePrixHt=ligne.tarif,ligneQuantite=ligne.ligneQuantite,ligneTotalHt=ligne.ligneTotalHt,ligneTotalTaxes=ligne.ligneTotalTaxes,
                ligneTotalTtc=ligne.ligneTotalTtc,articleTauxTva=ligne.tva,articlePrixTtc= (ligne.tva+ligne.tarif),userId=user.Id};
                var article = context.article.FirstOrDefault((a) => a.ArticleID == ligne.articleId);
                if (article == null) {
                    return BadRequest("Un problème est survenu.");
                }
                article.nbArticleSold = article.nbArticleSold+ligne.ligneQuantite;
                /*zidtha taw 
                ligneToStore.ligneRevenue = ligne.ligneTotalHt - article.ArticlePrixHT * ligne.ligneQuantite;
                    revenue = revenue + ligneToStore.ligneRevenue;
                nbArtcile = nbArtcile + ligne.ligneQuantite ;
                
                totalHt = totalHt + ligne.ligneTotalHt;
                totalTva = totalTva + ligne.ligneTotalTaxes;
                totalTtc = totalTtc + ligne.ligneTotalTtc;
                commande1.lignes.Add(ligneToStore);
            }
            Statut status = context.statusCommandes.Where((s) => s.statustIntitule == "Cree").FirstOrDefault();
            
            if(status == null)
            {
                NotFound("aucun statut avec cette intitule");
            }
            /* commande1 = new Commande() {client=client,clientCode=client.code,clientIntitule=client.intitule,userCreate=user,
             commandesNbrArticles=nbArtcile,commandeTotalHt=totalHt,commandeTotalTaxes=totalTva,commandeTotalTtc=totalTtc,statutId=status.statusId,
                 commandeNumero = generateCommandNum()};
            commande1.clientId = client.Id;
            commande1.clientCode=client.code;
            commande1.clientIntitule=client.intitule;
            

            commande1.userCreateId = user.Id;

            commande1.commandesNbrArticles = nbArtcile;
            commande1.commandeTotalHt = totalHt;
            commande1.commandeTotalTaxes=totalTva;
            commande1.commandeTotalTtc= totalTtc;
            commande1.statutId = status.statusId;
            commande1.commandeNumero=generateCommandNum();
            commande1.commandeDateLivraisonPrevue=DateTime.Now.AddDays(2);
           

            /*zidtha taw 
            commande1.commandeRevenue = revenue;
            
            string value=JsonConvert.SerializeObject(commande1);

            var content = new StringContent(value);

            var api = "http://172.16.1.23:90/api/Factures/AddDocument";

            // Make a POST request to the API endpoint with the request body
            HttpResponseMessage response = await httpClient.PostAsync(api, content);

            // Check if the request was successful
            if (response.IsSuccessStatusCode)
            {
                context.commandes.Add(commande1);
                // Read the response content as string
                string responseData = await response.Content.ReadAsStringAsync();
                context.SaveChanges();
                return Ok(responseData);
            }
            else
            {
                // Handle non-success status code
                Console.WriteLine($"API request failed with status code: {response.StatusCode}");
                return null;
            }

            /*context.SaveChanges();
            return Ok(new { messaage = "commande en cour d'evaluation" });
        }*/
        private String generateCommandNum()
        {
            var command=context.commandes.OrderByDescending(c => c.commandeId).FirstOrDefault();
            DateTime now = DateTime.Now;
            string month = now.Month < 10 ? "0" + now.Month : now.Month.ToString();
            var day = now.Day < 10 ? "0" + now.Day : now.Day.ToString();
            var num = "";
            if (command == null)
            {
                num="C"+now.Year+month+day+"-"+1.ToString("D5");
                return num;
            }
            else
            {
                int compt = int.Parse(command.commandeNumero.Split('-')[1]);
                compt = compt + 1;
                 num = "C" + now.Year + month + day + "-" + compt.ToString("D5");
                return num;
            }
        }
        /*
         [HttpPost]
        [Authorize(Roles = "CLIENT")]
        [Route("command/")]
        public IActionResult addCommand([FromBody] CommandeDto commande)
        {
            var user = context.Users.Where((u) => u.UserName==commande.username).FirstOrDefault();
            if (user == null)
            {
                return NotFound("aucun utilisateur avec ce nom d'utilisateur");
            }
            var client = context.client.Where((c) => c.Id == commande.clientId).FirstOrDefault();
            if (client == null)
            {
                return NotFound("aucun client avec cet id");
            }
            var nbArtcile = 0;
            decimal totalHt = 0;
            decimal totalTva = 0;
            decimal totalTtc = 0;
            Commande commande1 = new Commande();
            commande1.lignes = new List<CommandeLigne>();
            foreach (var ligne in commande.lignes) {
                var ligneStored=context.commandeLignes.Where((cl)=>cl.ligneId==ligne.ligneId).FirstOrDefault();
                if (ligne == null)
                {
                    return NotFound("ligne avec cet id n' existe pas");
                }
                nbArtcile = nbArtcile + ligne.ligneQuantite ;
                totalHt = totalHt + ligne.ligneTotalHt;
                totalTva = totalTva + ligne.ligneTotalTaxes;
                totalTtc = totalTtc + ligne.ligneTotalTtc;
                commande1.lignes.Add(ligneStored);
            }
            Statut status = context.statusCommandes.Where((s) => s.statustIntitule == "Cree").FirstOrDefault();
            
            if(status == null)
            {
                NotFound("ne peut pas trouver status");
            }
            commande1 = new Commande() {client=client,clientCode=client.code,clientIntitule=client.intitule,userCreate=user,
            commandesNbrArticles=nbArtcile,commandeTotalHt=totalHt,commandeTotalTaxes=totalTva,commandeTotalTtc=totalTtc,statutId=status.statusId,
                commandeNumero = generateCommandNum()};*
        commande1.client = client;
            commande1.clientCode=client.code;
            commande1.clientIntitule=client.intitule;
            commande1.userCreate=user;
            commande1.commandesNbrArticles = nbArtcile;
            commande1.commandeTotalHt = totalHt;
            commande1.commandeTotalTaxes=totalTva;
            commande1.commandeTotalTtc= totalTtc;
            commande1.statutId = status.statusId;
            commande1.commandeNumero=generateCommandNum();
        context.commandes.Add(commande1);
            context.SaveChanges();
            return Ok(new { messaage = "commande en cour d evaluation" });
        }
[HttpPost]
        [Authorize(Roles ="CLIENT")]
        [Route("ligneCommand")]
        public IActionResult addCommandLigne([FromBody] CommandLigneDto command)
        {
            String username = User.FindFirst(ClaimTypes.Name)?.Value;
            var user=context.Users.FirstOrDefault((u)=>u.UserName == command.username);
            if(user==null)
            {
                BadRequest("a problem occured");
            }
            var ligne = context.commandeLignes.FirstOrDefault((l) =>l.userId==user.Id && l.articleId == command.articleId && l.commande==null);
            var article = context.article.Include((a)=>a.Taxe).FirstOrDefault((a) => a.ArticleID == command.articleId);
            if (article == null)
            {
                return NotFound("article not found with this id");
            }
            if(ligne != null) { 
            ligne.ligneQuantite = ligne.ligneQuantite+1;
                ligne.ligneTotalHt = ligne.ligneQuantite * command.articlePrixHt;
            ligne.ligneTotalTaxes= ligne.ligneTotalHt*((Decimal)(ligne.articleTauxTva/100));
            ligne.ligneTotalTtc = ligne.ligneTotalHt + ligne.ligneTotalTaxes;
            context.SaveChanges();
            return Ok(new { message = "it already exists we added quantity" });
            }
            CommandeLigne ligneToStore = new CommandeLigne() { articleId = article.ArticleID, articleCode = article.ArticleCode, articleIntitule = article.ArticleIntitule
             , userId = user.Id };
            ,articlePrixTtc = command.articlePrixTtc,articleTauxTva = command.articleTauxTva,ligneQuantite = command.ligneQuantite,
            ligneTotalHt = command.ligneTotalHt,ligneTotalTaxes = command.ligneTotalTaxes,ligneTotalTtc = command.ligneTotalTtc
                li

            ligneToStore.ligneQuantite = 1;
            ligneToStore.articlePrixHt = command.articlePrixHt;
            ligneToStore.articleTauxTva =(double)command.articlePrixHt * (article.Taxe.TaxeTaux/100);
            ligneToStore.articlePrixTtc = ligneToStore.articlePrixHt + (decimal)ligneToStore.articleTauxTva;

            ligneToStore.ligneTotalHt = ligneToStore.articlePrixHt;
            ligneToStore.ligneTotalTaxes = (decimal)ligneToStore.articleTauxTva;
            ligneToStore.ligneTotalTtc = ligneToStore.articlePrixTtc;

            context.commandeLignes.Add(ligneToStore);
            context.SaveChanges();
            return Ok(new { message = "ligne commande added" });
            
        }
        [HttpGet]
        [Route("ligneCommand/user/{username}")]

        [Authorize(Roles ="CLIENT")]
        public IActionResult getCommandsLignesByUser([FromRoute] String username)
        {
            //String username = User.FindFirst(ClaimTypes.Name)?.Value;
            var user = context.Users.FirstOrDefault((u) => u.UserName == username);
            if (user == null)
            {
                BadRequest("a problem occured");
            }
            var commandLignes=context.commandeLignes.Where((cl)=>cl.userId==user.Id && cl.commande==null).ToList();
            return Ok(commandLignes);
        }
         
        [HttpPut]
        [Route("ligneCommand/{idLigne}")]
        [Authorize(Roles = "CLIENT")]
        public IActionResult updateCommandsLignesById([FromRoute] int idLigne, [FromQuery] int quantity)
        {
            var ligne = context.commandeLignes.Where((cl=>cl.ligneId==idLigne)).Include(cl => cl.article).FirstOrDefault();
            if(ligne== null)
            {
                return NotFound("no loigne with such id");
            }
           ligne.ligneQuantite = quantity;
            ligne.ligneTotalTaxes = ((decimal)(quantity * (ligne.articleTauxTva/100)))*ligne.article.ArticlePrixHT;
            ligne.ligneTotalHt = quantity * ligne.article.ArticlePrixHT;
            ligne.ligneTotalTtc = ligne.ligneTotalHt + ligne.ligneTotalTaxes;
            context.SaveChanges();
            return Ok(ligne);
        }
        [HttpDelete]
        [Route("ligneCommand/user/{username}")]
        [Authorize(Roles = "CLIENT")]
        public IActionResult deleteAllLignes([FromRoute] string username)
        {
            var user=context.Users.Where((u)=>u.UserName==username).FirstOrDefault();
            if (user == null)
            {
                return NotFound("no user with this username");
            }
            var lignes = context.commandeLignes.Where((cl) => cl.userId == user.Id && cl.commandeId == null).ToList();
            foreach(var ligne in lignes)
            {
                context.Remove(ligne);
            }
            context.SaveChanges();
            return Ok(new {message="tous les articles de panier est supprimées"});
        }
        [HttpDelete]
        [Route("ligneCommand/{idLigne}")]
        [Authorize(Roles = "CLIENT")]
        public IActionResult deleteAllLignes([FromRoute]int idLigne)
        {
            var ligne = context.commandeLignes.Include((l)=>l.commande).Where((cl) => cl.ligneId==idLigne).FirstOrDefault();
            if(ligne == null)
            {
                return NotFound("no such ligne with this id");
            }
            if (ligne.commande != null)
            {
                return BadRequest("on ne peut supprimer ligne d une commande");
            }
            context.commandeLignes.Remove(ligne);
            context.SaveChanges();
            return Ok(new { message = "l article specifie est supprime" });
        }*/
    }
}
