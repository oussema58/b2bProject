using B2BApplication.Context;
using B2BApplication.DTO;
using B2BApplication.Enum;
using B2BApplication.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.ComponentModel;
using System.Security.Claims;

namespace B2BApplication.Controllers
{
    [Route("api/catalogue")]
    [ApiController]
    public class CatalogueController : ControllerBase
    {
        ApplicationDbContext context;
        public CatalogueController(ApplicationDbContext _context)
        {
            context = _context;
        }

        [HttpPost]
        [Authorize(Policy = CustomPolicy.AdminOnly)]
        public async Task<IActionResult> addCategory(CatalogueDto categoryDto)
        {
            Catalogue catalogue = new Catalogue();
            if (categoryDto.CatalogueIntitule.IsNullOrEmpty()) {
                return BadRequest("spécifier nom pour catalogue");
            }
            if (categoryNameExists(categoryDto.CatalogueIntitule))
            {
                return BadRequest("le nom de catalogue doit etre unique");
            }
            catalogue.CatalogueIntitule = categoryDto.CatalogueIntitule;
            catalogue.CatalogueNiveau = categoryDto.CatalogueNiveau;
            if (categoryDto.CatalogueNiveau == 1 && categoryDto.CatalogueParentId != 0)
            {
                return BadRequest("le catalogue racine ne peut pas avoir un parent");
            }
            else
            {
                context.catalogue.Add(catalogue);
            }
            Catalogue catalogueParent = null;
            if (categoryDto.CatalogueNiveau != 1) {
                catalogueParent = context.catalogue.FirstOrDefault(cp => cp.CatalogueId == categoryDto.CatalogueParentId);
                if (catalogueParent == null)
                {
                    return BadRequest("aucun catalogue avec cette id");
                }
                if (catalogueParent.CatalogueNiveau + 1 != categoryDto.CatalogueNiveau)
                {
                    return BadRequest("respecter l'hiearchy des catalogues");
                }
                catalogue.CatalogueParentId = categoryDto.CatalogueParentId;
            }
            context.SaveChanges();
            Response.StatusCode = 201;
            var value = catalogueParent == null ? "" : $" and nom du parent {catalogueParent.CatalogueIntitule}";
            return new JsonResult(new { message = $"category intitule {categoryDto.CatalogueIntitule} , niveau {categoryDto.CatalogueNiveau}" + value + " est crée avec succées" });
        }
        private bool categoryNameExists(string name)
        {
            return context.catalogue.Any(c => c.CatalogueIntitule == name);
        }
        [HttpGet]
        [Route("{id}")]
        [Authorize(Policy = CustomPolicy.AdminClientOnly)]
        public IActionResult getCategoryLevel2([FromRoute]int id)
        {
            var categoryLvl2 = context.catalogue.FirstOrDefault((c) => c.CatalogueId == id);
            if(categoryLvl2 == null) { return NotFound(); }
            else
            {
                var level2 = new CatalogueKeyPair() { id = categoryLvl2.CatalogueId, name = categoryLvl2.CatalogueIntitule, value = new List<CatalogueKeyPair>() };
                var cataloguesLevel3 = context.catalogue.Where((c) => c.CatalogueParentId == categoryLvl2.CatalogueId).ToList();
                if (cataloguesLevel3.Count == 0)
                {
                    return BadRequest("catalogue de niveau 3 ne contient pas des sous catalogues");
                }
                foreach (var cat3 in cataloguesLevel3)
                {
                    if (context.article.Any((a) => a.CatalogueId == cat3.CatalogueId)) { 
                    var level3 = new CatalogueKeyPair() { id = cat3.CatalogueId, name = cat3.CatalogueIntitule };
                    level2.value.Add(level3);
                    }
                }
                return Ok(level2);
            }
        }
        /*[HttpGet]
        [Route("{id}")]
        public IActionResult getCategoryLevel3([FromRoute] int id)
        {
            var categoryLvl2 = context.catalogue.FirstOrDefault((c) => c.CatalogueId == id);
            if (categoryLvl2 == null) { return NotFound(); }
            else
            {
                var level2 = new CatalogueKeyPair() { id = categoryLvl2.CatalogueId, name = categoryLvl2.CatalogueIntitule, value = new List<CatalogueKeyPair>() };
                var cataloguesLevel3 = context.catalogue.Where((c) => c.CatalogueParentId == categoryLvl2.CatalogueId).ToList();
                if (cataloguesLevel3.Count == 0)
                {
                    return BadRequest("doesn t contain any sub categories");
                }
                foreach (var cat3 in cataloguesLevel3)
                {
                    if (context.article.Any((a) => a.CatalogueId == cat3.CatalogueId))
                    {
                        var level3 = new CatalogueKeyPair() { id = cat3.CatalogueId, name = cat3.CatalogueIntitule };
                        level2.value.Add(level3);
                    }
                }
                return Ok(level2);
            }
        }*/
        [HttpGet]
        [Route("admin")]
        [Authorize(Policy = CustomPolicy.AdminOnly)]
        //the user can fetch category even if they don t contain article
        public async Task<IActionResult> getCategoryForAdmin([FromQuery] bool divide)
        {

            var cataloguesLevel1 = context.catalogue.Where((c) => c.CatalogueNiveau == 1).ToList();
            bool containsCat3 = true;
            if (divide)
            {
                var cataloguesDivided = new List<CatalogueKeyPair>();
                foreach (var cat1 in cataloguesLevel1)
                {
                    var level1 = new CatalogueKeyPair() { id = cat1.CatalogueId, name = cat1.CatalogueIntitule, value = new List<CatalogueKeyPair>() };
                    var cataloguesLevel2 = context.catalogue.Where((c) => c.CatalogueParentId == cat1.CatalogueId).ToList();
                    if (cataloguesLevel2.Count == 0)
                    {
                        continue;
                    }
                    foreach (var cat2 in cataloguesLevel2)
                    {
                        var level2 = new CatalogueKeyPair() { id = cat2.CatalogueId, name = cat2.CatalogueIntitule, value = new List<CatalogueKeyPair>() };
                        var cataloguesLevel3 = context.catalogue.Where((c) => c.CatalogueParentId == cat2.CatalogueId).ToList();
                        if (cataloguesLevel3.Count == 0)
                        {
                            continue;
                        }
                        foreach (var cat3 in cataloguesLevel3)
                        {
                                var level3 = new CatalogueKeyPair() { id = cat3.CatalogueId, name = cat3.CatalogueIntitule };
                                level2.value.Add(level3);
           
                        }
                        if (level2.value.Count != 0)
                        {
                            level1.value.Add(level2);
                        }
                    }
                    if (level1.value.Count == 0)
                    {
                        continue;
                    }
                    cataloguesDivided.Add(level1);
                }
                if (cataloguesDivided.Count > 0)
                {
                    return new JsonResult(cataloguesDivided);
                }
                else
                {
                    return BadRequest("tu dois add ajouter des catalogues avant ajouter des articles");
                }
            }
            else
            {
                var catalogues = context.catalogue.ToList();
                return new JsonResult(catalogues);
            }
        }
        [HttpGet]
        [Route("admin/all")]
        [Authorize(Policy = CustomPolicy.AdminOnly)]
        //the user can fetch category even if they don t contain article
        public async Task<IActionResult> getAllCategoryForAdmin()
        {

            var cataloguesLevel1 = context.catalogue.Where((c) => c.CatalogueNiveau == 1).ToList();
            bool containsCat3 = true;
           
                var cataloguesDivided = new List<CatalogueKeyPair>();
                foreach (var cat1 in cataloguesLevel1)
                {
                    var level1 = new CatalogueKeyPair() { id = cat1.CatalogueId, name = cat1.CatalogueIntitule, value = new List<CatalogueKeyPair>()
                    ,parentId=cat1.CatalogueParentId,niveau=cat1.CatalogueNiveau};
                    var cataloguesLevel2 = context.catalogue.Where((c) => c.CatalogueParentId == cat1.CatalogueId).ToList();
                    foreach (var cat2 in cataloguesLevel2)
                    {
                        var level2 = new CatalogueKeyPair() { id = cat2.CatalogueId, name = cat2.CatalogueIntitule, value = new List<CatalogueKeyPair>(),
                            parentId = cat2.CatalogueParentId,
                            niveau = cat2.CatalogueNiveau
                        };
                        var cataloguesLevel3 = context.catalogue.Where((c) => c.CatalogueParentId == cat2.CatalogueId).ToList();
                        foreach (var cat3 in cataloguesLevel3)
                        {
                            var level3 = new CatalogueKeyPair() { id = cat3.CatalogueId, name = cat3.CatalogueIntitule,
                                parentId = cat3.CatalogueParentId
                            ,
                                niveau = cat3.CatalogueNiveau
                            };
                            level2.value.Add(level3);

                        }
                            level1.value.Add(level2);
                        
                    }
                    cataloguesDivided.Add(level1);
                }
                
                    return new JsonResult(cataloguesDivided);  
        }



        [HttpGet]
        [Authorize()]
        public async Task<IActionResult> getCategory([FromQuery] bool divide)
        {
            
            if (divide)
            {
                var value = HttpContext.User.FindFirstValue(ClaimTypes.Name);
                var user = context.Users.Include((u) => u.client).FirstOrDefault((u) => u.UserName == value);
                var articleInStore = context.articleInStores.Where((ais) => ais.tarifEnteteId == user.client.entTarifId).ToList();
                var cataloguesLevel1 = context.catalogue.Where((c) => c.CatalogueNiveau == 1).ToList();
                var cataloguesDivided = new List<CatalogueKeyPair>();
                foreach (var cat1 in cataloguesLevel1)
                {
                    var level1 = new CatalogueKeyPair() { id = cat1.CatalogueId ,name=cat1.CatalogueIntitule,value=new List<CatalogueKeyPair>()};
                    var cataloguesLevel2 = context.catalogue.Where((c) => c.CatalogueParentId == cat1.CatalogueId).ToList();
                    if (cataloguesLevel2.Count==0)
                    {
                        continue;   
                    }
                    foreach (var cat2 in cataloguesLevel2)
                    {
                        var level2 = new CatalogueKeyPair() { id = cat2.CatalogueId, name = cat2.CatalogueIntitule, value = new List<CatalogueKeyPair>() };
                        var cataloguesLevel3 = context.catalogue.Where((c) => c.CatalogueParentId == cat2.CatalogueId).ToList();
                        if (cataloguesLevel3.Count==0)
                        {
                            continue;
                        }
                        foreach (var cat3 in cataloguesLevel3)
                        {
                            var articles = context.article.Where((a) => a.CatalogueId == cat3.CatalogueId && a.ArticleEtat == true).ToList();
                            if (articles.Count!=0) { 
                            var level3 = new CatalogueKeyPair() { id = cat3.CatalogueId, name = cat3.CatalogueIntitule };
                                foreach(var art in articles)
                                {
                                    if (articleInStore.Any((elem) => elem.articleID == art.ArticleID && elem.tarifPrix != 0))
                                    {
                                        level2.value.Add(level3);
                                        break;
                                    }
                                    
                                }
                                /*if (articleInStore.Any((elem)=>elem.articleID==article.ArticleID && elem.tarifPrix!=0)) { 
                            level2.value.Add(level3);
                                }*/
                            }
                            else
                            {
                                continue;
                            }
                        }
                        if (level2.value.Count != 0) { 
                        level1.value.Add(level2);
                        }
                    }
                    if (level1.value.Count == 0)
                    {
                        continue;
                    }
                    cataloguesDivided.Add(level1);  
                }
                if(cataloguesDivided.Count > 0) { 
                return new JsonResult(cataloguesDivided);
                }
                else
                {
                    return BadRequest("tu dois add ajouter des catalogues avant ajouter des articles");
                }
            }
            else {
                var catalogues = context.catalogue.ToList();
                return new JsonResult(catalogues);
            }
        }
        [HttpGet]
        [Authorize()]
        [Route("level1/{name}")]
        public async Task<IActionResult> getCategoryLevel1([FromRoute] string name)
        {


            var value = HttpContext.User.FindFirstValue(ClaimTypes.Name);
            var user = context.Users.Include((u) => u.client).FirstOrDefault((u) => u.UserName == value);
            
            var catalogueLevel1 = context.catalogue.FirstOrDefault((c) => c.CatalogueIntitule == name && c.CatalogueNiveau == 1);
            if (catalogueLevel1 == null)
            {
                return NotFound("aucun catalogue avec cet id de niveau 1");
            }
            var cataloguesDivided = new List<CatalogueKeyPair>();

            var level1 = new CatalogueKeyPair() { id = catalogueLevel1.CatalogueId, name = catalogueLevel1.CatalogueIntitule, value = new List<CatalogueKeyPair>() };
            var cataloguesLevel2 = context.catalogue.Where((c) => c.CatalogueParentId == catalogueLevel1.CatalogueId).ToList();
            if (cataloguesLevel2.Count == 0)
            {
                return BadRequest("cette catalogue ne contient pas des sous catalogues");
            }
            foreach (var cat2 in cataloguesLevel2)
            {
                var level2 = new CatalogueKeyPair() { id = cat2.CatalogueId, name = cat2.CatalogueIntitule, value = new List<CatalogueKeyPair>() };
                var cataloguesLevel3 = context.catalogue.Where((c) => c.CatalogueParentId == cat2.CatalogueId).ToList();
                if (cataloguesLevel3.Count == 0)
                {
                    continue;
                }
                foreach (var cat3 in cataloguesLevel3)
                {
                    //int nb = 0;

                    /*var articles = context.articleInStores.Where((a) => a.catalogueId == cat3.CatalogueId && a.articleEtat == true && a.tarifEnteteId == user.client.entTarifId).ToList();*/
                    var articles = context.articleInStores.Where((a) => a.catalogueId == cat3.CatalogueId && a.enVente && a.tarifEnteteId == user.client.entTarifId).ToList();
                    if (articles.Count != 0)
                    {
                        var level3 = new CatalogueKeyPair() { id = cat3.CatalogueId, name = cat3.CatalogueIntitule };
                        level3.nbArticle = articles.Count;
                        //level3.nbArticle = nb;
                        level2.value.Add(level3);
                        //nb = 0;

                        
                        /*foreach (var art in articles)
                        {
                            if (art.tarifPrix!=0)
                            {
                                nb++;

                            }

                        }
                        if (nb > 0)
                        {
                            level3.nbArticle = nb;
                            level2.value.Add(level3);
                            nb = 0;

                        }*/
                    }
                    else
                    {
                        continue;
                    }
                }
                if (level2.value.Count != 0)
                {
                    level1.value.Add(level2);
                }
            }
            if (level1.value.Count == 0)
            {
                return NotFound("cette catalogue racine ne possede aucun article dans ses sous categories");
            }
            return new JsonResult(level1);
        }
        /*
        [HttpGet]
        [Authorize()]
        [Route("level1/{name}")]
        public async Task<IActionResult> getCategoryLevel1([FromRoute] string name)
        {

            
                var value = HttpContext.User.FindFirstValue(ClaimTypes.Name);
                var user = context.Users.Include((u) => u.client).FirstOrDefault((u) => u.UserName == value);
                var articleInStore = context.articleInStores.Where((ais) => ais.tarifEnteteId == user.client.entTarifId).ToList();
                var catalogueLevel1 = context.catalogue.FirstOrDefault((c) => c.CatalogueIntitule == name && c.CatalogueNiveau==1);
                if (catalogueLevel1 == null)
                {
                return BadRequest("aucun catalogue avec cet id de niveau 1");
                }
                var cataloguesDivided = new List<CatalogueKeyPair>();
                
                    var level1 = new CatalogueKeyPair() { id = catalogueLevel1.CatalogueId, name = catalogueLevel1.CatalogueIntitule, value = new List<CatalogueKeyPair>() };
                    var cataloguesLevel2 = context.catalogue.Where((c) => c.CatalogueParentId == catalogueLevel1.CatalogueId).ToList();
                    if (cataloguesLevel2.Count == 0)
                    {
                        return BadRequest("cet categorie ne contient pas des sous categories");
                    }
                    foreach (var cat2 in cataloguesLevel2)
                    {
                        var level2 = new CatalogueKeyPair() { id = cat2.CatalogueId, name = cat2.CatalogueIntitule, value = new List<CatalogueKeyPair>() };
                        var cataloguesLevel3 = context.catalogue.Where((c) => c.CatalogueParentId == cat2.CatalogueId).ToList();
                        if (cataloguesLevel3.Count == 0)
                        {
                            continue;
                        }
                        foreach (var cat3 in cataloguesLevel3)
                        {
                            int nb = 0;
                            //var articles = context.article.Where((a) => a.CatalogueId == cat3.CatalogueId && a.ArticleEtat == true).ToList();
                            var articles = context.articleInStores.Where((a) => a.catalogueId == cat3.CatalogueId && a.articleEtat == true).ToList();
                            if (articles.Count != 0)
                            {
                                var level3 = new CatalogueKeyPair() { id = cat3.CatalogueId, name = cat3.CatalogueIntitule };
                                foreach (var art in articles)
                                {
                                    if (articleInStore.Any((elem) => elem.articleID == art.ArticleID && elem.tarifPrix != 0))
                                    {
                                    nb++;
                                    
                                    }
                            
                                }
                        if (nb > 0)
                        {
                            level3.nbArticle = nb;
                            level2.value.Add(level3);
                            nb = 0;

                        }
                            }
                            else
                            {
                                continue;
                            }
                        }
                        if (level2.value.Count != 0)
                        {
                            level1.value.Add(level2);
                        }
                    }
                    if (level1.value.Count == 0)
                    {
                        return BadRequest("cet categorie racine ne possede aucun articles dans ses sous categories");
                    }
            return new JsonResult(level1);
        }*/



        [HttpDelete]
        [Route("{id}")]
        [Authorize(Policy = CustomPolicy.AdminOnly)]
        public async Task<IActionResult> deleteCategory([FromRoute] long id)
        {
            IActionResult response = null;
            var category = context.catalogue.FirstOrDefault(c => c.CatalogueId == id);
            if (category == null)
            {
                return BadRequest("aucun catalogue avec cette id");
            }
            if (category.CatalogueNiveau == 1)
            {
                response = await deleteRootCategory(category);
            }
            if (category.CatalogueNiveau == 2)
            {
                response = await deleteCategoryLevel2(category);
            }
            if (category.CatalogueNiveau == 3)
            {
                response = await deleteSimpleCategory(category);
            }

            if (response != null)
            {
                context.SaveChanges();
                return response;
            }
            return BadRequest("il y a un probléme");
        }

        private async Task<IActionResult> deleteRootCategory(Catalogue category)
        {
            if (category == null)
            {
                return BadRequest("aucun catalogue avec cette id");
            }

            var categories = context.catalogue.Where<Catalogue>(c => c.CatalogueParentId == category.CatalogueId).ToList();
            if (categories.Count() > 0)
            {
                return BadRequest("catalogue racine contient des sous catalogues.supprimer ses sous catalogues ou changer leur parent avant de supprimer cette catalogue");
            }
            context.catalogue.Remove(category);
            //context.SaveChanges();
            return Ok(new { message = "catalogue racine supprimé avec succées" });
        }
        private async Task<IActionResult> deleteCategoryLevel2(Catalogue category)
        {

            if (category == null)
            {
                return BadRequest("aucun catalogue avec cette id");
            }
            var categories = context.catalogue.Where<Catalogue>(c => c.CatalogueParentId == category.CatalogueId).ToList();
            if (categories.Count() > 0)
            {
                return BadRequest("contenaires des catalogues contient des sous catalogues.suppimez ces catalogues ou changez leur parent avant de supprimer cette catalogue");
            }
            context.catalogue.Remove(category);
            //context.SaveChanges();
            return Ok(new { message = "category niveau 2 supprimé" });
        }
        private async Task<IActionResult> deleteSimpleCategory(Catalogue category)
        {
            if (category == null)
            {
                return BadRequest("aucun catalogue avec cette id");
            }
            var articlesToDelete = context.article.Where(a => a.CatalogueId == category.CatalogueId).ToList();
            if (articlesToDelete.Count > 0)
            {
                return BadRequest("cette catalogue contient des articles. supprimez ces articles avant de supprimer cette catalogue");
            }
            context.catalogue.Remove(category);

            //context.SaveChanges();
            return Ok(new { message = "category supprimée avec succées" });
        }
        [HttpGet]
        [Route("parent/{name}")]
        public IActionResult GetCategory1And2([FromRoute] string name) {
        var category3 = context.catalogue.FirstOrDefault((c)=>c.CatalogueIntitule== name);
        var category2=context.catalogue.FirstOrDefault((c)=>c.CatalogueId==category3.CatalogueParentId);
        var category1= context.catalogue.FirstOrDefault((c) => c.CatalogueId == category2.CatalogueParentId);
            return Ok (new { category2 = category2.CatalogueIntitule, category1 = category1.CatalogueIntitule });
        }
        [HttpPut]
        [Route("{id}")]
        [Authorize(Policy = CustomPolicy.AdminOnly)]
        public async Task<IActionResult> updateCategory([FromRoute] long id, CatalogueDto categoryDto)
        {
            bool isLevelChanged = false;
            bool isBecomeRoot = false;
            var category = context.catalogue.FirstOrDefault(c => c.CatalogueId == id);
            if (category == null)
            {
                BadRequest("no category with such id");
            }
            if (!categoryDto.CatalogueIntitule.IsNullOrEmpty())
            {
                category.CatalogueIntitule = categoryDto.CatalogueIntitule;
            }
            if (category.CatalogueNiveau != categoryDto.CatalogueNiveau)
            {
                if (context.catalogue.Any(ca => ca.CatalogueParentId == id))
                {
                    return BadRequest("can t update this category level because it contains sub category or articles");
                }
                if(context.article.Any(a => a.CatalogueId == id))
                {
                    return BadRequest("tu ne peut pas mise a jour le niveau de cet category puisque il contient des articles");
                }


                isLevelChanged = true;
                if (categoryDto.CatalogueNiveau == 1)
                {
                    isBecomeRoot = true;
                    category.CatalogueParent = null;
                    category.CatalogueParentId = null;
                }
                category.CatalogueNiveau = categoryDto.CatalogueNiveau;
            }

            if (isLevelChanged && categoryDto.CatalogueParentId == 0 && !isBecomeRoot)
            {
                return BadRequest("Lors de la mise à jour du niveau de catégorie vers un niveau autre que la racine, vous devez fournir l'identifiant du parent.");
            }
            if (categoryDto.CatalogueParentId != 0 && isBecomeRoot)
            {
                return BadRequest("catalogue racine ne contient pas un catalogue parent");
            }

            if (categoryDto.CatalogueParentId != 0)
            {
                var parentCategory = context.catalogue.FirstOrDefault(c => c.CatalogueId == categoryDto.CatalogueParentId);
                if (parentCategory == null)
                {
                    return BadRequest("La mise à jour du parent de la catégorie est impossible car il n'existe pas.");
                }
                if (!(parentCategory.CatalogueNiveau + 1 == category.CatalogueNiveau))
                {
                    return BadRequest("La hiérarchie doit être respectée lors de la mise à jour");
                }
                category.CatalogueParent = parentCategory;
            }
            context.catalogue.Update(category);
            context.SaveChanges();
            return Ok(new { message = "mise a jour fait avec succées" });
        }

           
          
        [HttpGet]
        [Route("level3")]
        [Authorize()]
        public IActionResult getCataloguesLevel3()
        {
            var catalogues=context.catalogue.Where(c=>c.CatalogueNiveau==3).ToList();
            List<Catalogue> cataloguesToReturn=new List<Catalogue>();
            foreach (var cat in catalogues)
            {
                if (context.article.Any((a) => a.CatalogueId == cat.CatalogueId))
                //if (context.article.Any((a) => a.CatalogueId == cat.CatalogueId && a.ArticleEtat))
                {
                    cataloguesToReturn.Add(cat);
                }
            }
                return Ok(cataloguesToReturn);
        }
        
    

/*
    [HttpPut]
    [Route("{id}")]
    public async Task<IActionResult> updateCategory([FromRoute] long id, CatalogueDto categoryDto)
    {
        bool isBecomeRoot = false;
        bool isLevelChnaged = false;
        var category = context.catalogue.FirstOrDefault(c => c.CatalogueId == id);
        if (category == null)
        {
            BadRequest("no category with such id");
        }
        if (!categoryDto.CatalogueIntitule.IsNullOrEmpty())
        {
            category.CatalogueIntitule = categoryDto.CatalogueIntitule;
        }
        if (categoryDto.CatalogueNiveau != 0 && categoryDto.CatalogueNiveau != category.CatalogueNiveau)
        {
            isLevelChnaged = true;
            if (category.CatalogueNiveau == 1)
            {
                var categories = context.catalogue.Where<Catalogue>(c => c.CatalogueParentId == category.CatalogueId).ToList();
                if (categories.Count() > 0)
                {
                    foreach (var c in categories)
                    {
                        await deleteCategoryLevel2(c);

                    }
                }
                category.CatalogueNiveau = categoryDto.CatalogueNiveau;

            }
            else if (category.CatalogueNiveau == 2)
            {
                if (categoryDto.CatalogueNiveau == 1)
                {
                    var categories = context.catalogue.Where<Catalogue>(c => c.CatalogueParentId == category.CatalogueId).ToList();
                    if (categories.Count() > 0)
                    {
                        foreach (var c in categories)
                        {
                            c.CatalogueNiveau = 2;
                        }
                    }
                    category.CatalogueParent = null;
                    isBecomeRoot = true;
                }
                else
                {
                    var categories = context.catalogue.Where<Catalogue>(c => c.CatalogueParentId == category.CatalogueId).ToList();
                    if (categories.Count() > 0)
                    {
                        foreach (var c in categories)
                        {
                            await deleteSimpleCategory(c);
                        }
                    }

                }
                category.CatalogueNiveau = categoryDto.CatalogueNiveau;
            }
            else
            {
                if (categoryDto.CatalogueNiveau == 1)
                {
                    category.CatalogueParent = null;
                    isBecomeRoot = true;

                }
                category.CatalogueNiveau = categoryDto.CatalogueNiveau;
            }

        }
        if (isLevelChnaged && categoryDto.CatalogueParentId == 0 && !isBecomeRoot)
        {
            return BadRequest("when updating category level to other than root you should provide the parent id");
        }
        if (categoryDto.CatalogueParentId != 0 && isBecomeRoot)
        {
            return BadRequest("root category does not have parent");
        }
        //context.SaveChanges();

        if (categoryDto.CatalogueParentId != 0)
        {
            var parentCategory = context.catalogue.FirstOrDefault(c => c.CatalogueId == categoryDto.CatalogueParentId);
            if (parentCategory == null)
            {
                return BadRequest("can t update category's parent because it does not exist");
            }
            if (!(parentCategory.CatalogueNiveau + 1 == category.CatalogueNiveau))
            {
                return BadRequest("hiearchy must be respected when updating");
            }
            category.CatalogueParent = parentCategory;
        }
        else
        {
            if (isLevelChnaged)
            {
                BadRequest("when you  update the category level you should specify parent");
            }
        }
        context.SaveChanges();
        return Content("update successfully");
    }
*/

}


}

