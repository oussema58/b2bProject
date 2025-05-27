using B2BApplication.Context;
using B2BApplication.DTO;
using B2BApplication.Enum;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.Reflection.Metadata.Ecma335;

namespace B2BApplication.Controllers
{
    [Route("api/famille")]
    [ApiController]
    public class FamilleController : ControllerBase
    {
        ApplicationDbContext context;
        public FamilleController(ApplicationDbContext _context) { 
        context = _context;
        }
        [HttpPost]
        [Authorize(Policy = CustomPolicy.AdminOnly)]
        public IActionResult addFamille(FamilleDto familleDto)
        {
            if (familleDto.FamilleCode.IsNullOrEmpty())
            {
                return BadRequest("tu dois spécifier un code pour la famille de produit");
            }
            if (context.famille.Any((f => f.FamilleCode == familleDto.FamilleCode)))
            {
                return BadRequest("code famille de produit doit etre unique");
            }
            if (familleDto.FamilleIntitule.IsNullOrEmpty())
            {
                return BadRequest("tu dois spécifier un intitule pour la famille de produit");
            }
            if(familyExists(familleDto.FamilleIntitule)){
                return BadRequest("intitule famille de produit doit etre unique");
            }
            
            
            context.famille.Add(new Models.Famille() { FamilleIntitule = familleDto.FamilleIntitule,FamilleCode=familleDto.FamilleCode });
            context.SaveChanges();
            Response.StatusCode = 201;
            return new JsonResult(new { message = "famille de produit crée avec succées" });
        }
        private bool familyExists(string name)
        {
            return context.famille.Any(f => f.FamilleIntitule == name);
        }
        [HttpGet]
        [Authorize(Policy = CustomPolicy.AdminOnly)]
        public IActionResult getFamily()
        {
            return Ok(context.famille.ToList());
        }
        [HttpPut]
        [Route("{id}")]
        [Authorize(Policy = CustomPolicy.AdminOnly)]
        public IActionResult updateFamily([FromRoute] long id, FamilleDto familleDto)
        {
            var famille = context.famille.FirstOrDefault(f=> f.FamilleId == id);
            if (famille == null)
            {
                return BadRequest("famille de produit introuvable");
            }
            if (!familleDto.FamilleIntitule.IsNullOrEmpty() && familleDto.FamilleIntitule!=famille.FamilleIntitule && familyExists(familleDto.FamilleIntitule))
            {
                return BadRequest("intitule famille de famille doit etre unique");
            }
            if (!familleDto.FamilleIntitule.IsNullOrEmpty())
            {
                famille.FamilleIntitule = familleDto.FamilleIntitule;
            }
           /* if (!familleDto.FamilleCode.IsNullOrEmpty())
            {
                famille.FamilleCode = familleDto.FamilleCode;
            }*/

            context.SaveChanges();
            return Ok(new { message = "mise a jour fait avec succées" });
        }
        [HttpDelete]
        [Route("{id}")]
        [Authorize(Policy = CustomPolicy.AdminOnly)]
        public IActionResult deleteFamily([FromRoute] long id)
        {
            var famille = context.famille.FirstOrDefault(f => f.FamilleId == id);
            if (famille == null)
            {
                return BadRequest("famille de produit introuvable");
            }
            var articlesToDelete = context.article.Where(a => a.FamilleId ==id).ToList();
            if (articlesToDelete.Count > 0)
            {
                return BadRequest("La suppression de cette famille de produits est impossible car des articles lui sont rattachés. Supprimez ces articles ou modifiez leur famille avant de supprimer la famille de produits");
            }
            context.famille.Remove(famille);

            context.SaveChanges();
            return Ok(new { message = "famille de produit supprimée avec succées" });
        }
    }
}
