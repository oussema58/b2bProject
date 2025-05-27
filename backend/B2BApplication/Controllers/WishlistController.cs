using B2BApplication.Context;
using B2BApplication.DTO;
using B2BApplication.Enum;
using B2BApplication.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace B2BApplication.Controllers
{
    [Route("api/wishlist")]
    [ApiController]
    public class WishlistController : ControllerBase
    {
        ApplicationDbContext context;
        public WishlistController(ApplicationDbContext _context)
        {
            this.context = _context;
        }
        [HttpPost]
        [Authorize(Policy = CustomPolicy.ClientOnly)]
        public IActionResult addLigneWishlist(LigneWishlistDto1 ligneWishlist)
        {
            String username = User.FindFirst(ClaimTypes.Name)?.Value;
            var user = context.Users.FirstOrDefault((u) => u.UserName == username);
            if (user == null)
            {
                BadRequest("une probléme est survenue");
            }
            var ligne = context.ligneWishList.FirstOrDefault((l) => l.userId == user.Id && l.articleId == ligneWishlist.articleId);
            if (ligne!=null)
            {
                return BadRequest("ce article existe deja dans la liste des souhaits");
            }
            var article = context.article.FirstOrDefault((a) => a.ArticleID == ligneWishlist.articleId);
            if (article == null)
            {
                return NotFound("aucun article avec cette id");
            }
            
            LigneWishlist ligneToStore = new LigneWishlist()
            {
                articleId = article.ArticleID,
                userId = user.Id
            };

            context.ligneWishList.Add(ligneToStore);
            context.SaveChanges();
            return Ok(new { message = "l'article est ajouté dans liste de souhait" });
        }
        [HttpGet]
       
        [Authorize(Policy = CustomPolicy.ClientOnly)]
        public IActionResult getlignesWishlistByUser()
        {
            var username= User.FindFirst(ClaimTypes.Name)?.Value;
            var user = context.Users.Include((u) => u.client).FirstOrDefault((u) => u.UserName == username);
            if (user == null)
            {
                BadRequest("une probléme est survenue");
            }
            var ligneWishlist = context.ligneWishList.Include((wl) => wl.article).Where((wl) => wl.userId == user.Id).ToList();
            var lignesWishlistToShowList = new List<LigneWishlistDto>();
            var articlesInStores = context.articleInStores.Where((ais) => ais.tarifEnteteId == user.client.entTarifId).ToList();
            foreach (var wl in ligneWishlist)
            {
                var lignesWishlisttoShow = new LigneWishlistDto();
                var articleInStore = articlesInStores.Find((ais) => ais.articleID == wl.articleId);
                if (articleInStore != null)
                {
                    lignesWishlisttoShow.id = wl.id;
                    lignesWishlisttoShow.tarif = articleInStore.tarifPrix;
                    lignesWishlisttoShow.tva = lignesWishlisttoShow.tarif * (articleInStore.taxeTaux / 100);
                    
                    lignesWishlisttoShow.tarifttc = lignesWishlisttoShow.tva + lignesWishlisttoShow.tarif;
                    if (articleInStore.imagePath == "" || articleInStore.imagePath == null)
                    {
                        continue;
                    }

                    string fileExt = Path.GetFileName(articleInStore.imagePath).Split(".")[1];
                    byte[] imageBytes = System.IO.File.ReadAllBytes(articleInStore.imagePath);
                    var content = Convert.ToBase64String(imageBytes);
                    lignesWishlisttoShow.articleImage = "data:image/" + fileExt + ";base64, " + content;


                    lignesWishlisttoShow.articleIntitule = wl.article.ArticleIntitule;
                    lignesWishlisttoShow.articleCode = wl.article.ArticleCode;
                    lignesWishlisttoShow.articleId = wl.articleId;
                    lignesWishlistToShowList.Add(lignesWishlisttoShow);
                }
            }
            return Ok(lignesWishlistToShowList);
        }
        [HttpDelete]
        [Route("{idLigne}")]
        [Authorize(Policy = CustomPolicy.ClientOnly)]
        public IActionResult deleteLigneById([FromRoute] int idLigne)
        {
            var ligne = context.ligneWishList.Where((wl) => wl.id == idLigne).FirstOrDefault();
            if (ligne == null)
            {
                return NotFound("aucun ligne avec cette id");
            }
            context.ligneWishList.Remove(ligne);
            context.SaveChanges();
            return Ok(new { message = "l'article specifié est supprime de la liste des souhaits" });
        }
    }
}

