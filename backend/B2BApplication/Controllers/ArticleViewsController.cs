using B2BApplication.Context;
using B2BApplication.Enum;
using B2BApplication.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace B2BApplication.Controllers
{
    [Route("api/articleView")]
    [ApiController]
    public class ArticleViewsController : ControllerBase
    {
        ApplicationDbContext context;
        UserManager<User> userManager;
        IWebHostEnvironment environement;
        public ArticleViewsController(ApplicationDbContext _context, UserManager<User> _userManager, IWebHostEnvironment _environement)
        {
            context = _context;
            userManager = _userManager;
            this.environement = _environement;
        }
        [HttpPost]
        [Authorize(Policy = CustomPolicy.ClientOnly)]
        public IActionResult addViewToArticle([FromForm] string idArticle2)
        {
            var user = context.Users.FirstOrDefault((u) => u.UserName == User.FindFirstValue(ClaimTypes.Name));
            if(user == null)
            {
                return BadRequest("il y a un problém avec utilisateur actuelle");
            }
            var idArticle=Convert.ToInt32(idArticle2);
            var article=context.article.FirstOrDefault((a)=>a.ArticleID==idArticle);
            if(article == null)
            {
                return BadRequest("article est introuvable");
            }
            if (context.articlesViews.Any((av)=>av.idArt == idArticle2 && av.userId==user.Id))
            {
                return Ok();
            }
            ArticleViews articleViews = new ArticleViews() { articleId=idArticle,userId=user.Id,idArt=idArticle2};
            context.articlesViews.Add(articleViews);
            context.SaveChanges();
            return Ok();
        }
    
}
}

