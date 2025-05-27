using B2BApplication.Context;
using B2BApplication.DTO;
using B2BApplication.Enum;
using B2BApplication.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace B2BApplication.Controllers
{
    [Route("api/tarif")]
    [ApiController]
    public class TarifController : ControllerBase
    {
        ApplicationDbContext context;
        public TarifController(ApplicationDbContext _context) { 
        context = _context;
        }

        [HttpGet]
        [Route("")]
        [Authorize(Policy = CustomPolicy.AdminOnly)]
        //for admin only
        //define other route for normal user if tarif equals 0 or not in store should not appear 
        public IActionResult getTarifEntete()
        {
            var tarifEntent=context.TarifEntete.Include(te=>te.tarifs).ToList();
            foreach(var ent in tarifEntent)
            {
                foreach(var tarif in ent.tarifs)
                {
                    
                    if (tarif.article!=null)
                    {
                        tarif.article.tarifs = null;
                    }
                    tarif.tarifEntete = null;
                    

                }
            }
            return Ok(tarifEntent);
        }
        [HttpGet]
        [Route("{id}")]
        [Authorize(Policy = CustomPolicy.AdminOnly)]
        //for admin only
        //define other route for normal user if tarif equals 0 or not in store should not appear 
        public IActionResult getTarifEnteteById([FromRoute] int id)
        {
            var tarifEntent = context.TarifEntete.Include(te => te.tarifs).FirstOrDefault((te) => te.TarifEnteteId == id);
            if(tarifEntent == null)
            {
                return NotFound("aucun tarif avec cette id");
            }
            foreach (var tarif in tarifEntent.tarifs)
            {
                var article = context.article.FirstOrDefault((a) => a.ArticleID == tarif.articleId);
                tarif.article = article;
                if (tarif.article != null)
                {
                    tarif.article.tarifs = null;
                }
                tarif.tarifEntete = null;


            }
            return Ok(tarifEntent);
        }

        [HttpPost]
        [Authorize(Policy = CustomPolicy.AdminOnly)]
        public IActionResult addTarifEntete(TarifDto tarifEntete)
        {
            TarifEntete te = new TarifEntete();
            if (tarifEntete.Tarif_Entete_intitule.IsNullOrEmpty())
            {
                return BadRequest("tu dois specifier un intitule pour le tarif");
            }
            if (TarifIntituleExists(tarifEntete.Tarif_Entete_intitule))
            {
                return BadRequest("intitule tarif doit etre unique");
            }
            if(tarifEntete.Tarif_Entete_Code.IsNullOrEmpty())
            {
                return BadRequest("tu dois specifier un code pour le tarif");
            }
            if (context.TarifEntete.Any(te=>te.Tarif_Entete_Code==tarifEntete.Tarif_Entete_Code))
            {
                return BadRequest("code tarif doit etre unique");
            }
            if (tarifEntete.tarif_Entete_DateFin.CompareTo(DateTime.Now)==-1)
            {
                return BadRequest("La date de fin de validité ne peut pas être antérieure à la date du jour");
            }

            var tarifEnteteToStore = new TarifEntete()
            { Tarif_Entete_intitule = tarifEntete.Tarif_Entete_intitule, Tarif_Entete_Code = tarifEntete.Tarif_Entete_Code, Tarif_Entete_DateFin = tarifEntete.tarif_Entete_DateFin,tarifs=new List<Tarif>() };

            foreach (var p  in tarifEntete.tarifs)
            {
                Tarif tarif = new Tarif();
                var article = context.article.FirstOrDefault(a => a.ArticleIntitule == p.articleIntitule);
                if (article == null)
                {
                    return BadRequest("article avec intitule " + p.articleIntitule + " est introuvable");
                }
                tarif.article = article;
                if (p.tarifPrix < 0)
                {
                    return BadRequest("articl avec intitule " + p.articleIntitule + " est introuvable");
                }
                tarif.TarifPrix = p.tarifPrix;
                tarif.enVente = p.enVente;
                tarifEnteteToStore.tarifs.Add(tarif);
            }
            context.TarifEntete.Add(tarifEnteteToStore);
            context.SaveChanges();
            return Ok(new { message = "le tarif est crée avec succées" });
            
        }
        [HttpPut]
        [Route("{id}")]
        public IActionResult updateTarifEntete([FromRoute] int id, [FromBody] TarifDto? tarifEntete)
        {
            TarifEntete tarifEnteteStored = context.TarifEntete.FirstOrDefault((te) => te.TarifEnteteId == id);
            if (tarifEnteteStored == null)
            {
                return NotFound("aucun tarif avec cette id");
            }
            if (!tarifEntete.Tarif_Entete_intitule.IsNullOrEmpty() && tarifEnteteStored.Tarif_Entete_intitule != tarifEntete.Tarif_Entete_intitule
                && TarifIntituleExists(tarifEntete.Tarif_Entete_intitule))
            {
                return BadRequest("intitule tarif doit etre unique");
            }
            if (!tarifEntete.Tarif_Entete_intitule.IsNullOrEmpty())
            {
                tarifEnteteStored.Tarif_Entete_intitule = tarifEntete.Tarif_Entete_intitule;
            }
            if (tarifEntete.tarif_Entete_DateFin.CompareTo(DateTime.Now) == -1)
            {
                return BadRequest("La date de fin de validité ne peut pas être antérieure à la date du jour");
            }
            else
            {
                tarifEnteteStored.Tarif_Entete_DateFin = tarifEntete.tarif_Entete_DateFin;
            }
           
            foreach (var ligneTarif in tarifEntete.tarifs)
            {
                var tarif = context.tarifs.FirstOrDefault((t) => t.TarifId == ligneTarif.tarifId);
                if (ligneTarif.tarifPrix < 0)
                {
                    return BadRequest("article ne peut pas avoir un prix negative");
                }
                if (ligneTarif.enVente && ligneTarif.tarifPrix==0)
                {
                    return BadRequest("l'article exposées au vente ne peut pas etre gratuit");
                }
                tarif.TarifPrix = ligneTarif.tarifPrix;
                tarif.enVente = ligneTarif.enVente;
            }
            context.SaveChanges();
            return Ok(new { message = "tarif mise a jour fait avec succées" });
        }
            private bool TarifIntituleExists(String name)
        {
            return context.TarifEntete.Any(te =>te.Tarif_Entete_intitule==name);
        }
        [HttpDelete]
        [Route("{id}")]
        [Authorize(Policy = CustomPolicy.AdminOnly)]
        public ActionResult TarifDelete([FromRoute] int id) { 
        var tarif=context.TarifEntete.Include((te)=>te.tarifs).FirstOrDefault((te)=>te.TarifEnteteId==id);
            if (tarif == null)
            {
                return BadRequest("aucun tarif avec cette id");
            }
            var clients = context.client.Where((c)=>c.entTarifId==id).ToList();
            if (clients.Count > 0)
            {
               return BadRequest("Certains clients utilisent ce tarif. Pour supprimer ce tarif, vous pouvez soit associer les clients à de nouveaux tarifs, soit les supprimer définitivement.");
            }
           foreach(var ligne in tarif.tarifs)
            {
                context.tarifs.Remove(ligne);
            }
           context.TarifEntete.Remove(tarif);
            context.SaveChanges();
            return Ok(new { message = "tarif est supprimées avec succées" });
        }
    }

}
