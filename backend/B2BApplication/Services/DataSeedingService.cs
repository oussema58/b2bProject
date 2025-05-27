using B2BApplication.Context;
using B2BApplication.Models;
using Microsoft.AspNetCore.Identity;

namespace B2BApplication.Services
{
    public class DataSeedingService
    {
        RoleManager<IdentityRole> roleManager;
        ILogger<DataSeedingService> logger;
        UserManager<User> userManager;
        ApplicationDbContext context;
        public DataSeedingService(RoleManager<IdentityRole>_roleManager, ILogger<DataSeedingService> _logger, UserManager<User> _userManager,
            ApplicationDbContext _context)
        {
            roleManager = _roleManager;
            this.logger = _logger;
            userManager = _userManager;
            context = _context;
        }
        public async Task seedRolesData()
        {
            var role = await roleManager.FindByNameAsync("ADMIN");
            if (role == null)
            {
                var role1 = new IdentityRole() { Name = "ADMIN" };
                var result1 = await roleManager.CreateAsync(role1);
                if (result1.Succeeded)
                {
                    logger.LogInformation("role admin created\n");
                }
            }
             role = await roleManager.FindByNameAsync("CLIENT");
            if(role == null)
            {
                var role2 = new IdentityRole() { Name = "CLIENT" };
                var result2 = await roleManager.CreateAsync(role2);
                if (result2.Succeeded)
                {
                    logger.LogInformation("role user created\n");
                }
            }
            role = await roleManager.FindByNameAsync("SUPER_CLIENT");
            if(role == null)
            {
                var role3 = new IdentityRole() { Name = "SUPER_CLIENT" };
                var result3 = await roleManager.CreateAsync(role3);

                if (result3.Succeeded)
                {
                    logger.LogInformation("role Super Client created\n");
                }
            }
           
            var exists = await userManager.FindByEmailAsync("admin@admin.com");
            if (exists==null) {
                var user = new User() { Email = "admin@admin.com", EmailConfirmed = true, Name = "admin", etat = true, UserName = "admin",imagePath="" };
                var result = await userManager.CreateAsync(user,"admin1");
                if (result.Succeeded)
                {
                    logger.LogInformation("user created with success");
                }
                else
                {
                    logger.LogInformation("problem occured");
                }
                var storedUser = await userManager.FindByNameAsync("admin");
                
                await userManager.AddToRoleAsync(storedUser, "ADMIN");
            }
            Statut status1 = new Statut() { statusCode="S1",statustIntitule="CREE"};
            Statut status2 = new Statut() { statusCode = "S2", statustIntitule = "VALIDE" };
            Statut status3 = new Statut() { statusCode = "S3", statustIntitule = "REFUSE" };
            Statut status4 = new Statut() { statusCode = "S4", statustIntitule = "PREPARE" };
            Statut status5 = new Statut() { statusCode = "S5", statustIntitule = "Livree" };
            var status = context.statusCommandes.FirstOrDefault();
            if (status == null) { 
            context.Add(status1);
            context.Add(status2);
            context.Add(status3);
            context.Add(status4);
            context.Add(status5);
            context.SaveChanges();
            }
        }
    }
}
