using B2BApplication.Context;
using B2BApplication.DTO;
using B2BApplication.Enum;
using B2BApplication.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace B2BApplication.Controllers
{
    [Route("api/demandeRetour")]
    [ApiController]
    public class DemandeRetourController : ControllerBase
    {
        ApplicationDbContext context;
        public DemandeRetourController(ApplicationDbContext _context)
        {
            context = _context;
        }
        [HttpPost]
        [Authorize(Policy = CustomPolicy.ClientOnly)]
        public IActionResult addDemandeRetour([FromBody] DemandeRetourDto demande )
        {
            var commande=context.commandes.Include((c)=>c.demandeRetour).Where((c)=>c.commandeId==demande.commandId).FirstOrDefault();
            if (commande==null)
            {
                return BadRequest("aucun commande avec cette id");
            }
            if (commande.demandeRetour != null)
            {
                return BadRequest("vous avez deja envoye un demande de retour");
            }
            var user=context.Users.Include((u)=>u.client).FirstOrDefault((u) => u.UserName == demande.username);
            if (user==null)
            {
                return BadRequest("aucun utilisateur avec ce nom");
            }
            var demandeToStore = new DemandeRetour() { userId = user.Id, clientId = user.client.Id, commandeId = commande.commandeId };
            demandeToStore.lignes = new List<LigneDemandeRetour>();

            foreach(var ligne in demande.lignes)
            {
                var ligneCommande=context.commandeLignes.Include((lc)=>lc.article).Where((c)=>c.ligneId==ligne.commandeLigneId).FirstOrDefault();
                if (ligneCommande == null)
                {
                    return BadRequest("le commande ne contient pas cet article");
                }
                if (ligne.nbArticleRetenue > ligneCommande.ligneQuantite)
                {
                    return BadRequest("le nombre d article retenue de " + ligneCommande.articleIntitule + " depasse le nombre dans le commande");
                }
                var ligneRetour = new LigneDemandeRetour()
                {
                    artcileIntitule = ligneCommande.articleIntitule,
                    articleCode = ligneCommande.articleCode,
                    articleId = ligneCommande.articleId,
                    article = ligneCommande.article,
                    commandeLigneId = ligneCommande.ligneId,
                    motifId = ligne.motidId,
                    nbArticleRetenue = ligne.nbArticleRetenue,
                    nbArticleTotale = ligneCommande.ligneQuantite
                };
                demandeToStore.nbArtcileRetenue = demandeToStore.nbArtcileRetenue + ligne.nbArticleRetenue;
                demandeToStore.lignes.Add(ligneRetour);
            }
            context.demandesRetour.Add(demandeToStore);
            context.SaveChanges();
            return Ok(new { message = "demande retour envoyée avec succées" });
        }
        [HttpGet]
        [Authorize(Policy = CustomPolicy.AdminClientOnly)]
        public IActionResult getAllDemandeRetour()
        
        {
            var demandesRetour=context.demandesRetour
                .Include((d)=>d.client)
                .Include((d)=>d.admin)
                .Include((d) => d.userCreatedBy)
                .Include((d)=>d.commande)
                .ToList();
            foreach (var demande in demandesRetour)
            {
                demande.client.demandesRetour = null;
                demande.client.commandes = null;
                demande.commande.demandeRetour = null;
                demande.userCreatedBy.client = null;

            }
            return Ok(demandesRetour);
        }
        [HttpGet]
        [Route("client/{idClient}")]
        [Authorize(Policy = CustomPolicy.AdminClientOnly)]
        public IActionResult getAllDemandeRetourByClient([FromRoute] int idClient)
        {
            var demandesRetour = context.demandesRetour
                .Include((d) => d.client)
                .Include((d) => d.admin)
                .Include((d) => d.commande)
                .Include((d)=>d.userCreatedBy)
                .Where((d)=>d.clientId==idClient)
                .ToList();
            foreach(var demande in demandesRetour)
            {
                demande.client.demandesRetour = null;
                demande.client.users = null;
                demande.client.users = null;
                demande.client.commandes = null;
                demande.commande.demandeRetour = null;
                demande.commande.client = null;
                demande.commande.userCreate = null;
                demande.userCreatedBy.client = null;
                if (demande.admin!=null)
                {
                    demande.admin.PasswordHash = null;
                }
               
                demande.userCreatedBy.PasswordHash = null;
                
            }
            return Ok(demandesRetour);
        }
        [HttpGet]
        [Route("{id}")]
        [Authorize(Policy = CustomPolicy.AdminClientOnly)]
        public IActionResult getDemandeRetourById([FromRoute] int id)
        {
            var demandeRetour = context.demandesRetour
                .Include((d) => d.client)
                .Include((d) => d.admin)
                .Include((d) => d.commande)
                .Include((d) => d.userCreatedBy)
                .Include((d)=>d.lignes)
                .Where((d)=>d.Id == id)
                .FirstOrDefault();
            if (demandeRetour == null)
            {
                return BadRequest("aucun demande avec cette id");
            }
            demandeRetour.client.demandesRetour = null;
            demandeRetour.client.users = null;
            demandeRetour.client.users = null;
            demandeRetour.client.commandes = null;
            demandeRetour.commande.demandeRetour = null;
            demandeRetour.commande.client = null;
            demandeRetour.commande.userCreate = null;
            demandeRetour.userCreatedBy.client = null;
           
            foreach (var ligne in demandeRetour.lignes)
            {
                ligne.motif = context.motifs.FirstOrDefault((m) => m.id == ligne.motifId);
                ligne.demandeRetour = null;
            }
            return Ok(demandeRetour);
        }

    }
}
