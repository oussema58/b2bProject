using B2BApplication.Context;
using B2BApplication.DTO;
using B2BApplication.Enum;
using B2BApplication.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;

namespace B2BApplication.Controllers
{
    [Route("api/motif")]
    [ApiController]
    public class MotifController : ControllerBase
    {
        ApplicationDbContext context;
        public MotifController(ApplicationDbContext _context) {
        context = _context;
        }
        [HttpPost]
        [Authorize(Policy = CustomPolicy.AdminOnly)]
        public IActionResult addMotif([FromBody] MotifDto motifDto)
        {
            var codeExist=context.motifs.Any((m)=>m.code==motifDto.code);
            if(!motifDto.code.IsNullOrEmpty() && codeExist) {
                return BadRequest("code de motif doit etre non null et unique");
            }
            var motif=new Motif();
            if (!motifDto.code.IsNullOrEmpty())
            {
                motif.code=motifDto.code;
            }
            var intituleExists=context.motifs.Any((m)=>m.intitule==motifDto.intitule);
            if(!motifDto.intitule.IsNullOrEmpty() && intituleExists)
            {
                return BadRequest("motif intitule doit etre non null et unique");
            }
            if (!motifDto.intitule.IsNullOrEmpty())
            {
                motif.intitule = motifDto.intitule;
            }
            context.motifs.Add(motif);
            context.SaveChanges();
            return Ok(new { message = "motif crée avec succées" });
        }
        [HttpGet]
        [Authorize(Policy = CustomPolicy.AdminClientOnly)]
        public IActionResult getMotifs()
        {
            return Ok(context.motifs.ToList());
        }
        [HttpDelete]
        [Route("{id}")]
        [Authorize(Policy = CustomPolicy.AdminOnly)]
        public IActionResult deleteMotifs([FromRoute()] int id)
        {
            var motif = context.motifs.FirstOrDefault((m) => m.id == id);
            if (motif == null)
            {
                return BadRequest("aucun motif avec cette id");
            }
            var ligneDemandeRetour=context.lignedemandesRetour.Where((ldr)=>ldr.motifId==id);
            if(ligneDemandeRetour.Count() > 0)
            {
                return BadRequest("La suppression de ce motif est impossible car il est utilisé dans des demandes de retour");
            }
            context.motifs.Remove(motif);
            context.SaveChanges();
            return Ok(new { message = "motif est supprime avec succées" });
        }

    }
}
