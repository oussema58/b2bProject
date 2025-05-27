using B2BApplication.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace B2BApplication.Services
{
    public class JwtService
    {
        UserManager<User> userManager;
        public JwtService(UserManager<User> _userManager) {
            this.userManager = _userManager;
        }
        public async Task<string> createTokenAsync(User user)
        {
            var roles = await userManager.GetRolesAsync(user);
            var claimsIdentity = new ClaimsIdentity(new Claim[]
            {
                new Claim(ClaimTypes.GivenName,user.Name),
                new Claim(ClaimTypes.Name,user.UserName),
                new Claim(ClaimTypes.NameIdentifier,user.Id),
                new Claim(ClaimTypes.Email,user.Email),
                new Claim(ClaimTypes.Role,roles[0])
            }); ;
            // var crdentials=new SigningCredentials(new SymmetricSecurityKey(Encoding.ASCII.GetBytes(config["JSON:Key"])),SecurityAlgorithms.HmacSha256);
            var crdentials = new SigningCredentials(new SymmetricSecurityKey(Encoding.ASCII.GetBytes("B3D9CC125378D8E18F912A6367F7AB3D9CC125378D8E18F912A6367F7A")), SecurityAlgorithms.HmacSha256);
            SecurityTokenDescriptor descriptor = new SecurityTokenDescriptor()
            {
                Subject = claimsIdentity,
                //Expires = DateTime.UtcNow.AddDays(Convert.ToInt32(config["JSON:LifeTime"])),
                Expires = DateTime.UtcNow.AddDays(5),
                //Issuer = config["JSON:Issuer"]
                Issuer = "http://localhost:5083",
                SigningCredentials = crdentials
            };
            var tokenBuilder = new JwtSecurityTokenHandler();
            var token = tokenBuilder.CreateToken(descriptor);
            return tokenBuilder.WriteToken(token);
        }
    }
}
