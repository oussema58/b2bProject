using B2BApplication.Context;
using B2BApplication.DTO;
using B2BApplication.Enum;
using B2BApplication.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json;
using System.Security.Claims;

namespace B2BApplication.Controllers
{
    [Route("api/article")]
    [ApiController]
   
    public class ArticleController : ControllerBase
    {
        ApplicationDbContext context;
        UserManager<User> userManager;
        IWebHostEnvironment environement;
        public ArticleController(ApplicationDbContext _context, UserManager<User> _userManager,IWebHostEnvironment _environement) {
        context = _context;
        userManager = _userManager;
        this.environement = _environement;
        }
       /* [HttpPost]
        [Authorize(Policy =CustomPolicy.AdminOnly)]
        public async Task<IActionResult> addArticle(ArticleDto articleDto)
        {
            if (articleDto.ArticleIntitule.IsNullOrEmpty()) {
                return BadRequest("article name can t be null");
            }
            if (articleIntituleExists(articleDto.ArticleIntitule)){
                return BadRequest("article name should be unique");
            }
            if (articleDto.ArticleCode.IsNullOrEmpty())
            {
                return BadRequest("article code should be specified");
            }
            if (context.article.Any((a=>a.ArticleCode==articleDto.ArticleCode)))
            {
                return BadRequest("article code should be unique");
            }
            if (articleDto.ArticleBarCode.IsNullOrEmpty())
            {
                return BadRequest("article bar code should be specified");
            }
            if (context.article.Any((a) =>a.ArticleBarCode==articleDto.ArticleBarCode))
            {
                return BadRequest("article bar code should be unique");
            }
            if (articleDto.ArticlePrixHT==0)
            {
                return BadRequest("article price should be specified");
            }
            var catalogue=context.catalogue.FirstOrDefault(c=>c.CatalogueId==articleDto.CatalogueId);
            if (catalogue==null)
            {
                return BadRequest("article catalogue should be specified");
            }
            else
            {
                if (catalogue.CatalogueNiveau != 3)
                {
                    return BadRequest("article should be under catalogue of level 3");
                }
            }
            
            var taxe=context.taxe.FirstOrDefault(t=>t.Id==articleDto.TaxeId);
            if (taxe==null)
            {
                return BadRequest("article tax bracket should be specified");
            }
            var family=context.famille.FirstOrDefault(f=>f.FamilleId==articleDto.FamilleId);
            if (family==null)
            {
                return BadRequest("article family should be specified");
            }
            String username = User.FindFirst(ClaimTypes.Email)?.Value;
            var user=await userManager.FindByEmailAsync(username);
            Article article =new Article() { ArticleIntitule = articleDto.ArticleIntitule,ArticleEtat=articleDto.ArticleEtat,ArticleStatistique=articleDto.ArticleStatistique,
            ArticleCode=articleDto.ArticleCode,ArticleBarCode=articleDto.ArticleBarCode,ArticlePrixHT=articleDto.ArticlePrixHT,Taxe=taxe,Famille=family,Catalogue=catalogue
            ,UserCreated=user,UserModified=user};
            context.article.Add(article);

            //insertion d article dans tout tarifs
            var articleStored = context.article.FirstOrDefault((a) => a.ArticleCode==article.ArticleCode);
            var tarifs=context.TarifEntete.ToList();
            foreach(TarifEntete tarif in tarifs)
            {
                Tarif tarifLigne = new Tarif() { article = article, TarifPrix = 0 ,tarifEnteteId=tarif.TarifEnteteId};
                context.tarifs.Add(tarifLigne);
            }
            context.SaveChanges();
            return Ok(new { message = "article created successfully" });       
        }*/

        
        [HttpPost]
        [Authorize(Policy = CustomPolicy.AdminOnly)]
        
        public async Task<IActionResult> addArticleTest([FromForm]string article1, [FromForm] IFormFile image)
        {
            

            ArticleDto articleDto = JsonConvert.DeserializeObject<ArticleDto>(article1);

            if (articleDto.ArticleIntitule.IsNullOrEmpty())
            {
                return BadRequest("article nom ne doit pas etre null");
            }
            if (articleIntituleExists(articleDto.ArticleIntitule))
            {
                return BadRequest("article nom ne doit pas etre null");
            }
            if (articleDto.ArticleCode.IsNullOrEmpty())
            {
                return BadRequest("article code doit etre specifié");
            }
            if (context.article.Any((a => a.ArticleCode == articleDto.ArticleCode)))
            {
                return BadRequest("article code doit etre unique");
            }
            if (articleDto.ArticleBarCode.IsNullOrEmpty())
            {
                return BadRequest("article code a barre doit etre specifié");
            }
            if (context.article.Any((a) => a.ArticleBarCode == articleDto.ArticleBarCode))
            {
                return BadRequest("article code a barre doit etre unique");
            }
            if (articleDto.ArticlePrixHT == 0)
            {
                return BadRequest("article prix doit etre specifié");
            }
            var catalogue = context.catalogue.FirstOrDefault(c => c.CatalogueId == articleDto.CatalogueId);
            if (catalogue == null)
            {
                return BadRequest("article catalogue doit etre specifié");
            }
            else
            {
                if (catalogue.CatalogueNiveau != 3)
                {
                    return BadRequest("article catalogue doit etre de niveau 3");
                }
            }

            var taxe = context.taxe.FirstOrDefault(t => t.Id == articleDto.TaxeId);
            if (taxe == null)
            {
                return BadRequest("article taux d'impot doit etre specifié");
            }
            var family = context.famille.FirstOrDefault(f => f.FamilleId == articleDto.FamilleId);
            if (family == null)
            {
                return BadRequest("article family should be specified");
            }
            String username = User.FindFirst(ClaimTypes.Name)?.Value;
            var user = await userManager.FindByNameAsync(username);

            var fileName = getFileName(image.FileName,articleDto.ArticleCode);
            var filePath = getFilePath(fileName);
            if (System.IO.File.Exists(filePath))
            {
                System.IO.File.Delete(filePath);
            }
            using (FileStream fs = System.IO.File.Create(filePath)) {
                await image.CopyToAsync(fs);
            }


           

            Article article = new Article()
            {
                ArticleIntitule = articleDto.ArticleIntitule,
                ArticleEtat = articleDto.ArticleEtat,
                ArticleStatistique = articleDto.ArticleStatistique,
                ArticleCode = articleDto.ArticleCode,
                ArticleBarCode = articleDto.ArticleBarCode,
                ArticlePrixHT = articleDto.ArticlePrixHT,
                description = articleDto.description,
                imagePath= filePath,
                Taxe = taxe,
                Famille = family,
                Catalogue = catalogue
            ,
                UserCreated = user,
                UserModified = user
            };
            string fileExt = Path.GetFileName(article.imagePath).Split(".")[1];
            byte[] imageBytes = System.IO.File.ReadAllBytes(article.imagePath);
            var content = Convert.ToBase64String(imageBytes);
            article.imageContent = "data:image/" + fileExt + ";base64, " + content;
            context.article.Add(article);

            //insertion d article dans tout tarifs
            var articleStored = context.article.FirstOrDefault((a) => a.ArticleCode == article.ArticleCode);
            var tarifs = context.TarifEntete.ToList();
            foreach (TarifEntete tarif in tarifs)
            {
                Tarif tarifLigne = new Tarif() { article = article, TarifPrix = 0, tarifEnteteId = tarif.TarifEnteteId,enVente=false };
                context.tarifs.Add(tarifLigne);
            }
            context.SaveChanges();
            return Ok(new { message = "article crée avec succées" });
        }
        private string getFileName(string filename,string articleCode)
        {
            var name = filename.Split('.')[0];
            var extension = filename.Split('.')[1];
            return name + "_" + articleCode + "." + extension;
        }
        private string getFilePath(string filename)
        {
            return environement.WebRootPath.Replace("\\","/") + "/images/Article/"+filename;
        }
        private bool articleIntituleExists(string name)
        {
            return context.article.Any(a=>a.ArticleIntitule == name);
        }
        [HttpGet]
        [Authorize(Policy =CustomPolicy.AdminOnly)]
        public IActionResult getArticles() {
          var articles=context.article
                .Include(a => a.UserCreated)
                .Include(a => a.Catalogue)
                .Include(a => a.Famille)
                .Include(a => a.Taxe)
                .ToList();
           /* foreach(Article article in articles)
            {
                if (article.imagePath == "" || article.imagePath==null)
                {
                    continue;
                }
              
                string fileExt = Path.GetFileName(article.imagePath).Split(".")[1];
                byte[] imageBytes = System.IO.File.ReadAllBytes(article.imagePath);
                var content=Convert.ToBase64String(imageBytes);
                article.imagePath = "data:image/" + fileExt + ";base64, " + content;
            }*/
            return Ok(context.article.ToList());

        }
        
        [HttpGet]
        [Route("active")]
        [Authorize(Policy = CustomPolicy.AdminOnly)]
        public IActionResult getActiveArticles()
        {
            var articles = context.article
                  .Include(a => a.UserCreated)
                  .Include(a => a.Catalogue)
                  .Include(a => a.Famille)
                  .Include(a => a.Taxe)
                  .Where(a=>a.ArticleEtat)
                  .ToList();
            /* foreach(Article article in articles)
             {
                 if (article.imagePath == "" || article.imagePath==null)
                 {
                     continue;
                 }

                 string fileExt = Path.GetFileName(article.imagePath).Split(".")[1];
                 byte[] imageBytes = System.IO.File.ReadAllBytes(article.imagePath);
                 var content=Convert.ToBase64String(imageBytes);
                 article.imagePath = "data:image/" + fileExt + ";base64, " + content;
             }
            return Ok(context.article);*/
            return Ok(articles);

        }
        [HttpGet]
        [Route("store/category/{categoryLvl3Name}")]
        [Authorize(Policy = CustomPolicy.ClientOnly)]
        public IActionResult getArticlesInStore([FromRoute] string categoryLvl3Name) {
            var username = HttpContext.User.FindFirstValue(ClaimTypes.Name);
        var user=context.Users.Include((u)=>u.client).Where((u)=>u.UserName == username).FirstOrDefault();
            if (user == null)
            {
                BadRequest("aucun utilisateur avec ce nom");
            }

            /*var articlesInStores = context.articleInStores.Where((a) => a.tarifEnteteId == user.client.entTarifId && a.catalogueIntitule == categoryLvl3Name && a.articleEtat==true && a.tarifPrix!=0).ToList();*/
            var articlesInStores = context.articleInStores.Where((a) => a.tarifEnteteId == user.client.entTarifId && a.catalogueIntitule == categoryLvl3Name && a.enVente).ToList();
            if (articlesInStores.Count ==0) {
                return NotFound("aucun produit trouvé");
            }
           /* foreach (ArticleInStore article in articlesInStores)
            {

                string fileExt = Path.GetFileName(article.imagePath).Split(".")[1];
                byte[] imageBytes = System.IO.File.ReadAllBytes(article.imagePath);
                var content = Convert.ToBase64String(imageBytes);
                article.imagePath = "data:image/" + fileExt + ";base64, " + content;
            }*/
            return Ok(articlesInStores);
        }
        [HttpGet]
        [Route("store/recent")]
        [Authorize(Policy = CustomPolicy.AdminClientOnly)]
        public IActionResult getRecentArticlesInStore()
        {
            var username = HttpContext.User.FindFirstValue(ClaimTypes.Name);
            var user = context.Users.Include((u) => u.client).Where((u) => u.UserName == username).FirstOrDefault();
            if (user == null)
            {
                NotFound("aucun utilisateur avec ce nom");
            }
            /*var articlesInStores = context.articleInStores.Where((a) => a.tarifEnteteId == user.client.entTarifId && a.articleEtat == true && a.tarifPrix != 0).OrderBy(a => a.DateCreate).ToList();*/
            var articlesInStores = context.articleInStores.Where((a) => a.tarifEnteteId == user.client.entTarifId && a.enVente).OrderBy(a => a.DateCreate).ToList();

            /*foreach (ArticleInStore article in articlesInStores)
            {

                string fileExt = Path.GetFileName(article.imagePath).Split(".")[1];
                byte[] imageBytes = System.IO.File.ReadAllBytes(article.imagePath);
                var content = Convert.ToBase64String(imageBytes);
                article.imagePath = "data:image/" + fileExt + ";base64, " + content;
            }*/

            return Ok(articlesInStores);
        }
        [HttpGet]
        [Route("store/bestSelling")]
        [Authorize(Policy = CustomPolicy.AdminClientOnly)]
        public IActionResult getBestSellingArticlesInStore()
        {
            var username = HttpContext.User.FindFirstValue(ClaimTypes.Name);
            var user = context.Users.Include((u) => u.client).Where((u) => u.UserName == username).FirstOrDefault();
            if (user == null)
            {
                BadRequest("aucun utilisateur avec ce nom");
            }
            var articlesInStores = context.articleInStores
                /*.Where((a) => a.tarifEnteteId == user.client.entTarifId && a.articleEtat == true && a.tarifPrix != 0)*/
                .Where((a) => a.tarifEnteteId == user.client.entTarifId && a.enVente)
                .OrderByDescending(a=>a.nbArticleSold).ToList();


            /*foreach (ArticleInStore article in articlesInStores)
            {

                string fileExt = Path.GetFileName(article.imagePath).Split(".")[1];
                byte[] imageBytes = System.IO.File.ReadAllBytes(article.imagePath);
                var content = Convert.ToBase64String(imageBytes);
                article.imagePath = "data:image/" + fileExt + ";base64, " + content;
            }*/
            return Ok(articlesInStores);
        }
        [HttpGet]
        [Route("store/bestConsulted")]
        [Authorize(Policy = CustomPolicy.ClientOnly)]
        public IActionResult getBestConsultedArticlesInStore()
        {
            var user = context.Users.Include((u)=>u.client).FirstOrDefault((u) => u.UserName == User.FindFirstValue(ClaimTypes.Name));
            if (user == null)
            {
                return BadRequest("aucun utilisateur disponible");
            }
            var articles=context.article.Include(a=>a.ViewedBy).ToList();
            List<ArticleDto3>articleDto3s = new List<ArticleDto3>();
            foreach(var article in articles)
            {
                //articleDto3s.Add(new ArticleDto3 { Id=article.ArticleID,number=article.viewedBy.Count()});
                articleDto3s.Add(new ArticleDto3 { Id = article.ArticleID, number = article.ViewedBy.Count() });
            }
            articleDto3s
    .Sort((a,b) =>b.number-a.number);
            var listToReturn=new List<ArticleInStore>();
            foreach (var article in articleDto3s)
            {
                /*if (article.number == 0)
                {
                    continue;
                }*/


                /*var ais = context.articleInStores.FirstOrDefault((a) => a.articleID == article.Id && a.tarifEnteteId == user.client.entTarifId && a.tarifPrix!=0 && a.articleEtat);*/
                var ais = context.articleInStores.FirstOrDefault((a) => a.articleID == article.Id && a.tarifEnteteId == user.client.entTarifId && a.enVente);

                if (ais != null)
                {
                    listToReturn.Add(ais);
                }
            }
           /* foreach (var article in listToReturn) {
                string fileExt = Path.GetFileName(article.imagePath).Split(".")[1];
                byte[] imageBytes = System.IO.File.ReadAllBytes(article.imagePath);
                var content = Convert.ToBase64String(imageBytes);
                article.imagePath = "data:image/" + fileExt + ";base64, " + content;
            }*/
            
            return Ok(listToReturn);
        }
        [HttpGet]
        [Route("store/featured")]
        [Authorize(Policy = CustomPolicy.AdminClientOnly)]
        public IActionResult getFeaturedArticlesInStore()
        {
            var username = HttpContext.User.FindFirstValue(ClaimTypes.Name);
            var user = context.Users.Include((u) => u.client).Where((u) => u.UserName == username).FirstOrDefault();
            if (user == null)
            {
                BadRequest("aucun utilisateur avec ce nom");
            }
            var articlesInStores = context.articleInStores
                /*.Where((a) => a.tarifEnteteId == user.client.entTarifId && a.articleEtat == true && a.tarifPrix != 0)*/
                .Where((a) => a.tarifEnteteId == user.client.entTarifId && a.enVente)
                .ToList();


            /*foreach (ArticleInStore article in articlesInStores)
            {

                string fileExt = Path.GetFileName(article.imagePath).Split(".")[1];
                byte[] imageBytes = System.IO.File.ReadAllBytes(article.imagePath);
                var content = Convert.ToBase64String(imageBytes);
                article.imagePath = "data:image/" + fileExt + ";base64, " + content;
            }*/

            return Ok(articlesInStores);
        }
        /*[HttpGet]
        [Authorize(Roles = "CLIENT")]
        [Route("store/{entTarifId}")]
        public IActionResult getArticlesOfStore([FromRoute] int entTarifId)
        {
            var entete = context.TarifEntete.Where((te) => te.TarifEnteteId == entId).FirstOrDefault();   
            if(entId == null)
            {
                return BadRequest("non entete tarif avec cet id");
            }
        }
        */
        [HttpGet]
        [Authorize(Policy = CustomPolicy.ClientOnly)]
        [Route("category/{id}")]
        public IActionResult getArticles([FromRoute] int id)
        {
            var articles = context.article.Where((a)=>a.ArticleEtat==true)
                  .Include(a => a.UserCreated)
                  .Include(a => a.Catalogue)
                  .Include(a => a.Famille)
                  .Include(a => a.Taxe)
                  .ToList();
            var articles2=new List<Article>();
            foreach(var article in articles) { 
                if(article.Catalogue.CatalogueParentId==id) { articles2.Add(article);}
            }
            //return Ok(context.article.ToList());
            return Ok(articles2);
        }

        [HttpGet]
        [Route("{id}")]
        [Authorize(Policy = CustomPolicy.AdminClientOnly)]
        public async Task<IActionResult> getArticle([FromRoute]int id)
        {
            var article = context.article.Include(a=>a.UserModified).
                Include(a=>a.Catalogue).
                Include(a=>a.Taxe).
                Include(a=>a.Famille).
                FirstOrDefault((a) => a.ArticleID == id);
            if(article == null)
            {
                return NotFound("aucun produit avec ce nom");
            }
            var username = HttpContext.User.FindFirstValue(ClaimTypes.Name);
            var user = context.Users.Include((u) => u.client).Where((u) => u.UserName == username).FirstOrDefault();
            if (user == null)
            {
                return NotFound("aucun utilisateur avec ce nom");
            }
            if (!await userManager.IsInRoleAsync(user, "ADMIN"))
            {
                var articleInStore=context.articleInStores.FirstOrDefault((ais)=>ais.articleID==id && ais.tarifEnteteId==user.client.entTarifId);
                if(articleInStore != null)
                {
                    article.ArticlePrixHT = articleInStore.tarifPrix;
                }
            }
            /*
            string fileExt = Path.GetFileName(article.imagePath).Split(".")[1];
            byte[] imageBytes = System.IO.File.ReadAllBytes(article.imagePath);
            var content = Convert.ToBase64String(imageBytes);
            article.imagePath = "data:image/" + fileExt + ";base64, " + content;*/

            return Ok(article);

        }

        [HttpGet]
        [Route("store/{id}")]
        [Authorize(Policy = CustomPolicy.ClientOnly)]
        public async Task<IActionResult> getArticleInStoreById([FromRoute] int id)
        {
            var art=context.articleInStores.FirstOrDefault((ais) => ais.articleID == id);
            if(art == null)
            {
                return NotFound("aucun produit avec cette id");
            }
           /* string fileExt = Path.GetFileName(art.imagePath).Split(".")[1];
            byte[] imageBytes = System.IO.File.ReadAllBytes(art.imagePath);
            var content = Convert.ToBase64String(imageBytes);
            art.imagePath = "data:image/" + fileExt + ";base64, " + content;*/
            return Ok(art);
        }
        [HttpPut]
        [Route("{id}")]
        [Authorize(Policy = CustomPolicy.AdminOnly)]
        public async Task<IActionResult> updateArticle([FromRoute] long id, [FromForm] string article1, [FromForm] IFormFile? image)
        {

            bool update = false;
            var article = context.article.FirstOrDefault(a => a.ArticleID == id);
            if (article == null)
            {
                BadRequest("article  introuvable");
            }
            ArticleDto articleDto = JsonConvert.DeserializeObject<ArticleDto>(article1);

            if (!articleDto.ArticleIntitule.IsNullOrEmpty() && !article.ArticleIntitule.Equals(articleDto.ArticleIntitule) && articleIntituleExists(articleDto.ArticleIntitule))
            {
                return BadRequest("article intitule doit etre unique");
            }
            if (!articleDto.ArticleIntitule.IsNullOrEmpty())
            {
                update = true;
                article.ArticleIntitule = articleDto.ArticleIntitule;
            }
            if (!articleDto.description.IsNullOrEmpty())
            {
                update = true;
                article.description = articleDto.description;
            }
            if (articleDto.ArticlePrixHT != 0)
            {
                article.ArticlePrixHT = articleDto.ArticlePrixHT;
                update = true;
            }
            if (articleDto.CatalogueId != 0)
            {
                var catalogue = context.catalogue.FirstOrDefault(c => c.CatalogueId == articleDto.CatalogueId);
                if (catalogue == null)
                {
                    return BadRequest("article catalogue doit etre specifié");
                }
                article.Catalogue = catalogue;
                update = true;
            }
            if (articleDto.TaxeId != 0)
            {
                var taxe = context.taxe.FirstOrDefault(t => t.Id == articleDto.TaxeId);
                if (taxe == null)
                {
                    return BadRequest("article taux d'impot doit etre specifié");
                }
                article.Taxe = taxe;
                update = true;
            }
            if (articleDto.FamilleId != 0)
            {
                var family = context.famille.FirstOrDefault(f => f.FamilleId == articleDto.FamilleId);
                if (family == null)
                {
                    return BadRequest("article famille doit etre specifié");
                }
                article.Famille = family;
                update = true;
            }
            if (article.ArticleEtat == true && articleDto.ArticleEtat == false)
            {
                var lignes = context.lignePaniers.Where((lp) => lp.articleId == id).ToList();
                foreach (var ligne in lignes)
                {
                    context.lignePaniers.Remove(ligne);
                }
            }
            article.ArticleEtat = articleDto.ArticleEtat;

            article.ArticleStatistique = articleDto.ArticleStatistique;

            if (image != null)
            {
                update = true;
                if (System.IO.File.Exists(article.imagePath))
                {
                    System.IO.File.Delete(article.imagePath);
                }

                var fileName = getFileName(image.FileName, article.ArticleCode);
                var filePath = getFilePath(fileName);
                
                using (FileStream fs = System.IO.File.Create(filePath))
                {

                    await image.CopyToAsync(fs);
                    article.imagePath=filePath;
                }
                string fileExt = Path.GetFileName(article.imagePath).Split(".")[1];
                byte[] imageBytes = System.IO.File.ReadAllBytes(article.imagePath);
                var content = Convert.ToBase64String(imageBytes);
                article.imageContent = "data:image/" + fileExt + ";base64, " + content;
            }
            

            String username = User.FindFirst(ClaimTypes.Email)?.Value;
            var user = await userManager.FindByEmailAsync(username);



            if (update)
            {
                article.DateUpdate = DateTime.Now;
                article.UserModified = user;
            }
            context.SaveChanges();
            return Ok(new { message = "article mise a jour avec succées" });
        }

        [HttpPut]
        [Route("{id}/block")]
        [Authorize(Policy = CustomPolicy.AdminOnly)]
        public  IActionResult blockArticle([FromRoute] int id)
        {
            var article = context.article.FirstOrDefault(a => a.ArticleID == id);
            if (article == null)
            {
                BadRequest("article  introuvable");
            }
            if (article.ArticleEtat == false)
            {
                BadRequest("article deja bloqué");
            }
            article.ArticleEtat = false;
            /* when blocking the article it should be no longer in vente for all tarifs*/
            var tarifs=context.tarifs.Where((t)=>t.articleId==id).ToList();
            foreach (var tar in tarifs)
            {
                tar.enVente = false;
            }
            context.SaveChanges();
            return Ok(new { message = "article n'est plus dans le vente" });
        }
        [HttpPut]
        [Route("{id}/unblock")]
        [Authorize(Policy = CustomPolicy.AdminOnly)]
        public IActionResult unblockArticle([FromRoute] int id)
        {
            var article = context.article.FirstOrDefault(a => a.ArticleID == id);
            if (article == null)
            {
                BadRequest("article  introuvable");
            }
            if (article.ArticleEtat == true)
            {
                BadRequest("article deja en vente");
            }
            article.ArticleEtat = true;
            /*when article is unblocked we should search for tarifs that doesn t include this article because it is possible taht the tarif was created when article is blocked*/
            var tarifsEntete = context.TarifEntete.Include(t => t.tarifs).ToList();
            foreach(var te in tarifsEntete)
            {
                var found = false;
                foreach(var t in te.tarifs)
                {
                    if(t.articleId == id)
                    {
                        found = true;
                        break;
                    }
                }
                if (!found)
                {
                    Tarif t = new Tarif() { articleId=id,enVente=false,TarifPrix=0,tarifEnteteId=te.TarifEnteteId};
                    context.tarifs.Add(t);
                }

            }
            context.SaveChanges();
            return Ok(new {message="article est de noveau en vente"});
        }

        [HttpDelete]
        [Route("{id}")]
        [Authorize(Policy = CustomPolicy.AdminOnly)]
        public IActionResult deleteArticle([FromRoute]long id) {
        var article=context.article.FirstOrDefault(a=>a.ArticleID == id);
        if (article == null)
            {
                return BadRequest("article introuvable");
            }
        var ligneCommands=context.commandeLignes.Where((lc)=>lc.articleId==id).ToList();
            if (ligneCommands.Count() > 0)
            {
                return BadRequest("On ne peut pas supprimer un article qui est déjà inclus dans des commandes. Vous pouvez le rendre inactif si vous souhaitez le retirer de la boutique.");
            }
            var lignePanier=context.lignePaniers.Where((lp)=>lp.articleId==id).ToList();
            foreach(var lp in lignePanier)
            {
                context.lignePaniers.Remove(lp);
            }
            var ligneWishlist=context.ligneWishList.Where((wl)=>wl.articleId==id).ToList();
            foreach (var wl in lignePanier)
            {
                context.lignePaniers.Remove(wl);
            }
            var tarifs=context.tarifs.Where((t)=>t.articleId==id).ToList();
            foreach (var t in tarifs)
            {
                context.tarifs.Remove(t);
            }
            if (System.IO.File.Exists(article.imagePath))
            {
                System.IO.File.Delete(article.imagePath);
            }
            context.article.Remove(article);
            context.SaveChanges();
            return Ok(new { message = "article supprimé avec succées" });
        }
        [Authorize(Policy = CustomPolicy.AdminOnly)]
        [HttpGet]
        [Route("meilleur")]
        public IActionResult meilleurArticles()
        {

            var articles  = context.article.ToList();
            var articlesToReturn = new List<BestArticle>();

            foreach (var article in articles)
            {
                /*if (!(article.imagePath == "") && !(article.imagePath == null))
                {
                    
                
                string fileExt = Path.GetFileName(article.imagePath).Split(".")[1];
                byte[] imageBytes = System.IO.File.ReadAllBytes(article.imagePath);
                var content = Convert.ToBase64String(imageBytes);
                    article.imagePath = "data:image/" + fileExt + ";base64, " + content;
                 }*/
                BestArticle bestArticle = new BestArticle() { article = article,imageContent=article.imageContent };
                decimal revenue = 0;
                decimal vente = 0;
                /*var commande=context.commandes.Where((c)=>c.statutId!=1 && c.statutId!=3).ToList();
                List<Commande>commandesValides = new List<Commande>();
                foreach (var c in commande)
                {
                    if(c.statutId!=1 && c.statutId!=3) { 
                        commandesValides.Add(c);
                    }
                }*/


                var commandesLignes = context.commandeLignes.Include((cl)=>cl.commande).Where((cl) => cl.articleId == article.ArticleID && cl.commande.statutId!=1 && cl.commande.statutId != 3).ToList();
                foreach (var ligne in commandesLignes)
                {
                    revenue = revenue + ligne.ligneRevenue;
                    vente = vente + ligne.ligneTotalHt;
                    ligne.commande = null;
                }
                bestArticle.totalVente = vente;
                bestArticle.totalRevenue = revenue;
                bestArticle.lignes = commandesLignes.ToList();
                
                articlesToReturn.Add(bestArticle);
            }
            articlesToReturn.Sort((a1, a2) => decimal.ToInt32(a2.totalRevenue - a1.totalRevenue));
            return Ok(articlesToReturn);
        }
    }
}
