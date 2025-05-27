using B2BApplication.Context;
using B2BApplication.DTO;
using B2BApplication.Enum;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;

namespace B2BApplication.Controllers
{
    [Route("api/taxe")]
    [ApiController]
    public class TaxeController : ControllerBase
    {
        ApplicationDbContext context;
        public TaxeController(ApplicationDbContext _context)
        {
            context = _context;
        }

        [HttpPost]
        [Authorize(Policy = CustomPolicy.AdminOnly)]
        public IActionResult addTaxe(TaxeDto taxeDto)
        {
            if (taxeDto.TaxeCode.IsNullOrEmpty())
            {
                return BadRequest("tu dois specifier un code pour l'impot");
            }
            if (context.taxe.Any((t => t.TaxeCode == taxeDto.TaxeCode)))
            {
                return BadRequest("code impot doit etre unique");
            }
            if (taxeDto.TaxeIntitule.IsNullOrEmpty()) {
                return BadRequest("tu dois specifier un intitule pour l'impot");
            }
            if (taxeExists(taxeDto.TaxeIntitule))
            {
                return BadRequest("intitule impot doit etre unique");
            }
           
            

            context.taxe.Add(new Models.Taxe() { TaxeCode = taxeDto.TaxeCode, TaxeTaux = taxeDto.TaxeTaux, TaxeIntitule = taxeDto.TaxeIntitule });
            context.SaveChanges();
            Response.StatusCode = 201;
            return new JsonResult(new { mesage = "impot crée avec succées" });
        }
        private bool taxeExists(string name)
        {
            return context.taxe.Any(t => t.TaxeIntitule == name);
        }
        [HttpGet]
        [Authorize(Policy = CustomPolicy.AdminClientOnly)]
        public IActionResult getTaxe()
        {
            return Ok(context.taxe.ToList());
        }
        [HttpPut]
        [Route("{id}")]
        [Authorize(Policy = CustomPolicy.AdminOnly)]
        public IActionResult updateTaxe([FromRoute] long id, TaxeDto taxeDto)
        {
            var taxe=context.taxe.FirstOrDefault(t => t.Id == id);
            if (taxe == null)
            {
                return BadRequest("impot est introuvable");
            }
            if(!taxeDto.TaxeIntitule.IsNullOrEmpty() && !taxeDto.TaxeIntitule.Equals(taxe.TaxeIntitule) && taxeExists(taxeDto.TaxeIntitule))
            {
                return BadRequest("intitule impot doit etre unique");
            }
            if (!taxeDto.TaxeIntitule.IsNullOrEmpty())
            {
                taxe.TaxeIntitule=taxeDto.TaxeIntitule;
            }
            /*if (!taxeDto.TaxeCode.IsNullOrEmpty() && !taxeDto.TaxeCode.Equals(taxe.TaxeCode) && context.taxe.Any((t=>t.TaxeCode==taxeDto.TaxeCode)))
            {
                return BadRequest("taxe bracket code should be unique");
            }
            if (!taxeDto.TaxeCode.IsNullOrEmpty())
            {
                taxe.TaxeCode = taxeDto.TaxeCode;
            }*/
          
            context.SaveChanges();
            return Ok(new { message = "impot mise a jour fait avec succées" });
        }
        [HttpDelete]
        [Route("{id}")]
        [Authorize(Policy = CustomPolicy.AdminOnly)]
        public IActionResult deleteTaxe([FromRoute] int id){ 
        var  taxe=context.taxe.FirstOrDefault(tax => tax.Id == id);
            if (taxe == null)
            {
                return BadRequest("impot est introuvable");
            }
            if (!context.article.Any((a)=>a.TaxeId==id)) { 
            context.taxe.Remove(taxe);
            context.SaveChanges();
            }
            else
            {
                return BadRequest("il y a des articles qui utilisent cette impot. changer leur impots ou supprimer ces articles pour pouvoir supprimer cette impot");
            }
            return Ok(new { message = "impot est supprimé avec succées" });
        }
    }
}
