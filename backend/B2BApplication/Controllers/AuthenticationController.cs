using B2BApplication.Context;
using B2BApplication.DTO;
using B2BApplication.Enum;
using B2BApplication.Models;
using B2BApplication.Services;
using Mailjet.Client.Resources;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json;
using Security2.DTO;

using System.Security.Claims;
using static System.Net.WebRequestMethods;

namespace Security2.Controllers
{
    [Route("api")]
    [ApiController]
    public class AuthenticationController : ControllerBase
    {
        SignInManager<B2BApplication.Models.User> signInManager;
        UserManager<B2BApplication.Models.User> userManager;
        JwtService service;
        RoleManager<IdentityRole> roleManager;
        IConfiguration configuration;
        EmailService emailService;
        ILogger<AuthenticationController> logger;
        ApplicationDbContext context;
        IWebHostEnvironment environement;
        public AuthenticationController(SignInManager<B2BApplication.Models.User> _signInManager,
            UserManager<B2BApplication.Models.User> _userManager,
            JwtService _service, RoleManager<IdentityRole> _roleManager, IConfiguration _configuration, EmailService _emailService,
            ILogger<AuthenticationController> _logger,
            ApplicationDbContext _applicationDbContext, IWebHostEnvironment _environement)
        {
            signInManager = _signInManager;
            userManager = _userManager;
            service = _service;
            roleManager = _roleManager;
            configuration = _configuration;
            logger = _logger;
            emailService = _emailService;
            this.context = _applicationDbContext;
            this.environement = _environement;

        }




        [HttpPost]
        [Route("login")]
        public async Task<IActionResult> login(LoginDto loginDto)
        {
            B2BApplication.Models.User user = context.Users.Include((u) => u.client).Where(u=>u.UserName==loginDto.username).FirstOrDefault();
            if (user == null)
            {
                return BadRequest("aucun utilisateur avec ce nom");
            }
            if (!await userManager.IsInRoleAsync(user, "ADMIN"))
            {
                if (user.client.etat == false)
                {
                    return BadRequest("tous les comptes d'utilisateur associé a votre société sont bloqué");
                }
            }
            if (!user.etat)
            {
                return Unauthorized("Votre compte est verrouillé.");
            }
            var result = await signInManager.CheckPasswordSignInAsync(user, loginDto.password,false);
            if (!result.Succeeded)
            {
                return Unauthorized("mot de passe incorrect");
            }
            string role = (await userManager.GetRolesAsync(user))[0];
            var idClient = 0;
            var entTarifId = 0;
            if (user.client != null)
            {
                idClient = user.client.Id;
                entTarifId = user.client.entTarifId;
            }
   
            return Ok(new LoginResult() { fname = user.Name, token = await service.createTokenAsync(user), email = user.Email, role = role, username = user.UserName,idClient=idClient,entTarifId= entTarifId,id=user.Id});
        }
       

        //send email to societe
        [Authorize()]
        [HttpGet]
        [Route("account/forget-password")]
        public async Task<IActionResult> ForgetPassword(ForgetPasswordDTO forgetPasswordDTO)
        {
            var username= User.FindFirst(ClaimTypes.Name)?.Value;
            var user = await userManager.FindByNameAsync(username);
            if (user == null)
            {
                return BadRequest("aucun utilisateur avec ce nom");
            }
            var result = await userManager.ChangePasswordAsync(user, forgetPasswordDTO.oldPassword, forgetPasswordDTO.newPassword);
            if (result.Succeeded)
            {
                return Ok(new { message = "Votre mot de passe a été réinitialisé avec succès." });
            }
            else
            {
                return BadRequest("verifier mot de passe");
            }
        }
        [Authorize(Policy =CustomPolicy.AdminClientOnly)]
        [HttpPut]
        [Route("account/reset-password")]
        public async Task<IActionResult> resetPassword(UpdatePasswordDto updatePasswordDTO)
        {
            var username = User.FindFirst(ClaimTypes.Name)?.Value;
            var user = await userManager.FindByNameAsync(username);
            if (user == null)
            {
                return BadRequest("aucun utilisateur avec ce nom");
            }
            if (!await userManager.CheckPasswordAsync(user, updatePasswordDTO.password))
            {
                return BadRequest("mot de passe incorrect.");
            }
            if(updatePasswordDTO.newPassword!=updatePasswordDTO.passwordConfirm)
            {
                return BadRequest("Assurez-vous que votre nouveau mot de passe et sa confirmation correspondent. ");
            }
            var result = await userManager.ChangePasswordAsync(user, updatePasswordDTO.password, updatePasswordDTO.newPassword);
            if (result.Succeeded)
            {
                return Ok(new { message = "Votre mot de passe a été réinitialisé avec succès." });
            }
            else
            {
                return BadRequest("verifier mot de passe il doit avoir longeur superieur a 6");
            }
        }

        [Authorize]
        [HttpGet]
        [Route("info")]
        public async Task<IActionResult> getInfo()
        {
            String username = User.FindFirst(ClaimTypes.Email)?.Value;
            String firstName = User.FindFirstValue(ClaimTypes.GivenName);
            B2BApplication.Models.User user = new B2BApplication.Models.User() { };

            return Ok(new {message =$"info => {firstName} : {username}" });
        }
    }
}


        /*private async Task<bool> sendConfirmSocieteEmail(B2BApplication.Models.User user, Societe societe)
        {
            if (user == null)
            {
                throw new Exception("user is null can t send email");
            }
            var token = societyTokenService.generateToken();
            token.UserId = user.Id;
            token.SocieteId = societe.Id;
            context.tokens.Add(token);
            context.SaveChanges();
            var url = configuration["Angular:SocietyAccountConfirmationPath"] + "?token=" + token.value + "&userEmail=" + user.Email+ "&society=" + societe.email;
            var urlDecline = configuration["Angular:SocietyAccountDeclinePath"] + "?token=" + token.value + "&userEmail=" + user.Email + "&society=" + societe.email;
            string body = "";
            if (societe.emailConfirmed) {
                body = $"<p>hello {societe.intitule} we ask you to confirm your account creation in our app {configuration["Mail:ApplicationName"]}</p>" +
                        $"<p>that was created by {user.Name} with email {user.Email}</p>" +
                    "<p>by clicking in the link bellow</p>" +
                    $"<a href=\"{url}\">confirm both email</a>" +
                    $"if you want to decline yur account on our site will be deleted" +
                    $"<a href=\"{urlDecline}\">confirm both email</a>"+
                "<p>thank you</p>";
            }
            else
            {
                body= $"<p>hello {societe.intitule} we ask you to confirm {user.Name} account creation in our app {configuration["Mail:ApplicationName"]}</p>" +
                        $"<p>the email of user is {user.Email}</p>" +
                    "<p>by clicking in the link bellow</p>" +
                    $"<a href=\"{url}\">confirm both email</a>" +
                    $"if you want to decline yur account on our site will be deleted" +
                    $"<a href=\"{urlDecline}\">confirm both email</a>" +
                "<p>thank you</p>";
            }
            var subject = configuration["Mail:ApplicationName"] + " Email Confirmation";
            var result = await emailService.sendEmailAsync(societe.email, subject, body);
            if (result.Messages[0].Status == "success")
            {
                return true;
            }
            else { return false; }
        }

        [Route("account/user/confirm")]
        [HttpPost]
        public async Task<IActionResult> confirmUser([FromQuery]string email, [FromQuery] string token)
        {
            if(email == null)
            {
                return BadRequest("email is not specified");
            }
            if (token == null)
            {
                return BadRequest("confirmation token is not specified");
            }
            var user=await userManager.FindByEmailAsync(email);
            if (user == null)
            {
                return BadRequest("email does not exist");
            }
            if(user.EmailConfirmed == true) {
                return BadRequest("you already confirmed your email");
            }
            var result =await userManager.ConfirmEmailAsync(user, token);
            
            if(result.Succeeded)
            {
                await userManager.UpdateAsync(user);
                return Ok(new { message = "email successfully confirmed" });

            }
            else
            {
                Response.StatusCode=500;
                return Content( "email is not confirmed");
            }
           
        }
        [Route("account/user/confirm/resend")]
        [HttpPost]
        public async Task<IActionResult> resendConfirmation([FromQuery]String email)
        {
            var user = await userManager.FindByEmailAsync(email);
            if (user == null)
            {
                return BadRequest("email is not specified in uri");
            }
            if (await sendConfirmUserEmail(user))
            {
                logger.LogInformation("email sent successfully");
            }
            else
            {
                logger.LogInformation("error occured when sending email");

            }
            return Ok("confirmation resend");
        }

        [Route("account/society/confirm")]
        [HttpPost]
        public async Task<IActionResult> confirmSociete([FromQuery] string token, [FromQuery] string society, [FromQuery] string userEmail,[FromBody] SocieteDto societyDto )
        {
            if (userEmail == null)
            {
                return BadRequest("user email is not specified");
            }
            if (token == null)
            {
                return BadRequest("confirmation token is not specified");
            }
            if(society == null)
            {
                return BadRequest("society email is not specified");
            }
            var user = await userManager.FindByEmailAsync(userEmail);
            if (user == null)
            {
                return BadRequest("email does not exist");
            }
            if (user.status == true)
            {
                return BadRequest("you already opened the account");
            }
            var societyStored =context.societe.FirstOrDefault<Societe>(s => s.email == society);
            if (societyTokenService.isTokenValid(token,user.Id,societyStored.Id))
            {
                if (!societyStored.emailConfirmed)
                {
                    societyStored.emailConfirmed=true;
                    user.status = true;
                    societyStored.matricule=societyDto.matricule;
                    societyStored.matriculeFiscal = societyDto.matriculeFiscal;
                    societyStored.registreCommerce = societyDto.registreCommerce;
                    if(societyDto.adresse.IsNullOrEmpty())
                    {
                        societyStored.adresse=societyDto.adresse;
                    }
                        societyStored.telephone=societyDto.telephone;
                    if (societyDto.codePostale.IsNullOrEmpty())
                    {
                        societyStored.codePostale = societyDto.codePostale;
                    }
                    context.SaveChanges();
                }
                return Ok("email successfully confirmed");

            }
            else
            {
                Response.StatusCode = 500;
                return Content("a problem occured user account is not valid");
            }

        }

        [Route("account/society/decline")]
        [HttpPost]
        public async Task<IActionResult> DeclineSociete([FromQuery] string token, [FromQuery] string society, [FromQuery] string userEmail)
        {
            if (userEmail == null)
            {
                return BadRequest("user email is not specified");
            }
            if (token == null)
            {
                return BadRequest("confirmation token is not specified");
            }
            if (society == null)
            {
                return BadRequest("society email is not specified");
            }
            var user = await userManager.FindByEmailAsync(userEmail);
            if (user == null)
            {
                return BadRequest("email does not exist");
            }
            if (user.status == true)
            {
                return BadRequest("you already opened the account");
            }
            var societyStored = context.societe.FirstOrDefault<Societe>(s => s.email == society);
            if (societyTokenService.isTokenValid(token, user.Id, societyStored.Id))
            {
                if (!societyStored.emailConfirmed)
                {
                    context.societe.Remove(societyStored); 
                }
                await userManager.DeleteAsync(user);
                var client = context.client.FirstOrDefault(c => c.email == userEmail);
                if (client != null)
                {
                    context.client.Remove(client);
                }
                var tokenStored = context.tokens.FirstOrDefault(t => t.value == token);
                if (tokenStored != null)
                {
                    context.tokens.Remove(tokenStored);
                }
                
                context.SaveChanges();
                return Ok("email successfully confirmed");

            }
            else
            {
                Response.StatusCode = 500;
                return Content("a problem occured user account is not valid");


            }
        }





            private async Task<bool> sendConfirmUserEmail(B2BApplication.Models.User user)
        {
            if (user == null)
            {
                throw new Exception("user is null can t send email");
            }

            var confirmationToken = await userManager.GenerateEmailConfirmationTokenAsync(user);
            var url = configuration["Angular:ConfirmationUrl"] + "?token=" + confirmationToken + "&email=" + user.Email;
            //var url = "https://www.google.com/";
            var body = $"<p>hello {user.Name} we ask you to confirm your email</p>" +
                "<p> click in the link bellow</p>" +
                $"<a href=\"{url}\">confirm my email</a>" +
                // $"<a href=\"https://www.google.com/\">confirm my email</a>" +
                "<p>thank you</p>";
            var subject = configuration["Mail:ApplicationName"] + " Email Confirmation";
            var result = await emailService.sendEmailAsync(user.Email, subject, body);
            if (result.Messages[0].Status == "success")
            {
                return true;
            }
            else { return false; }
        }
        */
       

       /* private async Task<bool> SendResetPassword(B2BApplication.Models.User user)
        {
            if (user == null)
            {
                throw new Exception("user is null can t send email");
            }

            var resetToken = await userManager.GeneratePasswordResetTokenAsync(user);
            var url = configuration["Angular:ResetPasswordUrl"] + "?token=" + resetToken + "&email=" + user.Email;
            var body = $"<p>hello {user.Name}</p>" +
                "<p>to reset your password click in the link bellow</p>" +
                $"<a href=\"{url}\">confirm my email</a>" +
                "<p>thank you</p>";
            var subject = configuration["Mail:ApplicationName"] + " Reset Password";
            var result = await emailService.sendEmailAsync(user.Email, subject, body);
            if (result.Messages[0].Status == "success")
            {
                return true;
            }
            else { return false; }
        }

        [HttpPut]
        [Route("account/reset-password")]
        public  async Task<IActionResult> ResetPassword([FromBody] ForgetPasswordDTO forgetPasswordDTO)
        {
            var user = await userManager.FindByEmailAsync(forgetPasswordDTO.email);
                if(user == null)
                {
                    return BadRequest("user not registred yet");
                }

            var result = await userManager.ResetPasswordAsync(user, forgetPasswordDTO.token, forgetPasswordDTO.newPassword);
            if (result.Succeeded)
            {
                return Content("password reset successfuly");
            }
            else
            {
                Response.StatusCode = 500;  
                return Content("password reset failed");
            }
            }
        

           
        [Authorize(Roles = "ADMIN")]
        [HttpGet]
        [Route("admin")]

        public async Task<IActionResult> sayHello()
        {
            String username = User.FindFirst(ClaimTypes.Email)?.Value;
            String firstName = User.FindFirstValue(ClaimTypes.GivenName);
            return Content($"hello admin => {firstName} : {username}");
        }
        [Authorize(Roles = "CLIENT")]
        [HttpGet]
        [Route("user")]

        public async Task<IActionResult> sayHelloUser()
        {
            String username = User.FindFirst(ClaimTypes.Email)?.Value;
            String firstName = User.FindFirstValue(ClaimTypes.GivenName);
            return Content($"hello user => {firstName}  : {username}");
        }


        




        [HttpPost]
        [Route("assign/{username}/{role}")]
        public async Task<IActionResult> assign([FromRoute] string username, [FromRoute] string role)
        {
            var user = await userManager.FindByEmailAsync(username);
            if (user != null)
            {
                var result = await userManager.AddToRoleAsync(user, role);
                if (result.Succeeded)
                {
                    return Ok("role assigned to user");
                }
                else
                {
                    return BadRequest("something went wrong");
                }
            }
            else
            {
                return BadRequest("no such user");
            }
        }

        [HttpPost]
        [Route("role/add/{role}")]

        public async Task<IActionResult> addRole([FromRoute] string role)
        {
            var exists = await roleManager.FindByNameAsync(role);
            if (exists != null)
            {
                BadRequest("already exists");
            }
            var result = await roleManager.CreateAsync(new IdentityRole(role));
            if (result.Succeeded)
            {
                return Ok("role added");
            }
            else
            {
                return BadRequest("something went wrong");
            }
        }

        */
   

