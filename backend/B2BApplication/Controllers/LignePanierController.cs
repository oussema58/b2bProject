using B2BApplication.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory.Database;
using System.Security.Claims;
using B2BApplication.Context;
using B2BApplication.DTO;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using B2BApplication.Enum;

namespace B2BApplication.Controllers
{
    [Route("api/panier")]
    [ApiController]
    public class LignePanierController : ControllerBase
    {
        ApplicationDbContext context;
        public LignePanierController(ApplicationDbContext _context)
        {
            this.context = _context;
        }
        [HttpPost]
        [Authorize(Policy = CustomPolicy.ClientOnly)]
        public IActionResult addLignePanier(LignePanierDto1 lignePanier)
        {
            String username = User.FindFirst(ClaimTypes.Name)?.Value;
            var user = context.Users.FirstOrDefault((u) => u.UserName == lignePanier.username);
            if (user == null)
            {
                BadRequest("une probléme est survenue");
            }
            var ligne = context.lignePaniers.FirstOrDefault((l) => l.userId == user.Id && l.articleId == lignePanier.articleId);
            var article = context.article.FirstOrDefault((a) => a.ArticleID == lignePanier.articleId);
            if (article == null)
            {
                return NotFound("aucun article avec cette id");
            }
            if (ligne != null)
            {
                ligne.ligneQuantite = ligne.ligneQuantite + lignePanier.ligneQuantite;
                
                context.SaveChanges();
                return Ok(new { message = "cette article est deja dans le panier.on a modifié le quantité seulement" });
            }
            LignePanier ligneToStore = new LignePanier()
            {
                articleId = article.ArticleID,
                ligneQuantite=lignePanier.ligneQuantite,
                userId = user.Id
            };
  
            context.lignePaniers.Add(ligneToStore);
            context.SaveChanges();
            return Ok(new { message = "article ajouté au panier" });
        }
        [HttpPost]
        [Route("all")]
        [Authorize(Policy = CustomPolicy.ClientOnly)]
        public IActionResult addAllLignePanier(List<LignePanierDto1> lignePanier)
        {
            String username = User.FindFirst(ClaimTypes.Name)?.Value;
            var user = context.Users.FirstOrDefault((u) => u.UserName == username);
            if (user == null)
            {
                BadRequest("une probléme est survenue");
            }

            var lignes = context.lignePaniers.Where((cl) => cl.userId == user.Id).ToList();
            foreach (var ligne in lignes)
            {
                context.Remove(ligne);
            }
            foreach (var item in lignePanier) {
                var article = context.article.FirstOrDefault((a) => a.ArticleID == item.articleId);
                if (article == null)
                {
                    return NotFound("aucun article avec cette id");
                }
                LignePanier ligneToStore = new LignePanier()
            {
                articleId = item.articleId,
                ligneQuantite = item.ligneQuantite,
                userId = user.Id
            };

            context.lignePaniers.Add(ligneToStore);
            }
            context.SaveChanges();
            return Ok(new { message = "ligne panier mise a jour" });
        }
        [HttpGet]
        [Route("user/{username}")]
        [Authorize(Policy = CustomPolicy.ClientOnly)]
        public IActionResult getPanierLignesByUser([FromRoute] String username)
        {
            var user = context.Users.Include((u)=>u.client).FirstOrDefault((u) => u.UserName == username);
            if (user == null)
            {
                BadRequest("une probléme est survenue");
            }
            var panierLignes = context.lignePaniers.Include((pl)=>pl.article).Where((pl) => pl.userId == user.Id).ToList();
            var lignesPaniertoShowList=new List<LignePanierDto>();
            var articlesInStores = context.articleInStores.Where((ais) => ais.tarifEnteteId == user.client.entTarifId).ToList();
            foreach(var p in panierLignes)
            {
                var lignesPaniertoShow=new LignePanierDto();
                var articleInStore=articlesInStores.Find((ais) => ais.articleID == p.articleId);
                if(articleInStore != null) {
                    lignesPaniertoShow.id = p.id;
                    lignesPaniertoShow.tarif = articleInStore.tarifPrix;
                    lignesPaniertoShow.tva = Math.Round(lignesPaniertoShow.tarif * (articleInStore.taxeTaux / 100),3);
                    lignesPaniertoShow.tarifttc = lignesPaniertoShow.tva + lignesPaniertoShow.tarif;
                    lignesPaniertoShow.ligneQuantite = p.ligneQuantite;
                    lignesPaniertoShow.ligneTotalHt = lignesPaniertoShow.tarif * lignesPaniertoShow.ligneQuantite;
                    lignesPaniertoShow.ligneTotalTaxes = lignesPaniertoShow.tva* lignesPaniertoShow.ligneQuantite;
                    lignesPaniertoShow.ligneTotalTtc = lignesPaniertoShow.ligneTotalHt + lignesPaniertoShow.ligneTotalTaxes;
                    lignesPaniertoShow.articleIntitule = p.article.ArticleIntitule;
                    lignesPaniertoShow.articleCode= p.article.ArticleCode;
                    lignesPaniertoShow.articleId= p.articleId;

                    string fileExt = Path.GetFileName(articleInStore.imagePath).Split(".")[1];
                    byte[] imageBytes = System.IO.File.ReadAllBytes(articleInStore.imagePath);
                    var content = Convert.ToBase64String(imageBytes);
                    lignesPaniertoShow.articleImage = "data:image/" + fileExt + ";base64, " + content;
                    lignesPaniertoShowList.Add(lignesPaniertoShow);
                }
            }
            return Ok(lignesPaniertoShowList);
        }

        [HttpPut]
        [Route("{idLigne}")]
        [Authorize(Policy = CustomPolicy.ClientOnly)]
        public IActionResult updatePanierLignesById([FromRoute] int idLigne, [FromQuery] int quantity)
        {
            var ligne = context.lignePaniers.Where((pl => pl.id == idLigne)).FirstOrDefault();
            if (ligne == null)
            {
                return NotFound("aucun ligne de panier avec cette id");
            }
            
            ligne.ligneQuantite = quantity;
            context.SaveChanges();
            return Ok(ligne);
        }
        [HttpDelete]
        [Route("user/{username}")]
        [Authorize(Policy = CustomPolicy.ClientOnly)]
        public IActionResult deleteAllLignes([FromRoute] string username)
        {
            var user = context.Users.Where((u) => u.UserName == username).FirstOrDefault();
            if (user == null)
            {
                return NotFound("aucun utilisateur avec ce nom");
            }
            var lignes = context.lignePaniers.Where((cl) => cl.userId == user.Id).ToList();
            foreach (var ligne in lignes)
            {
                context.Remove(ligne);
            }
            context.SaveChanges();
            return Ok(new { message = "tous les articles de panier sont supprimées" });
        }
        [HttpDelete]
        [Route("{idLigne}")]
        [Authorize(Policy = CustomPolicy.ClientOnly)]
        public IActionResult deleteLigneById([FromRoute] int idLigne)
        {
            var ligne = context.lignePaniers.Where((pl) => pl.id == idLigne).FirstOrDefault();
            if (ligne == null)
            {
                return NotFound("aucun article avec cette id");
            }
            context.lignePaniers.Remove(ligne);
            context.SaveChanges();
            return Ok(new { message = "l'article specifie est supprimé avec succées" });
        }
    }
}
