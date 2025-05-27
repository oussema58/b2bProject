using B2BApplication.Context;
using B2BApplication.Models;
using B2BApplication.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddDbContext<ApplicationDbContext>(options => options.UseSqlServer(builder.Configuration.GetConnectionString("defaultConnection")));
builder.Services.AddCors((options) => { options.AddPolicy("myPolicy", (policy) => { policy.WithOrigins("http://localhost:4200", "http://localhost:65352","http://localhost:52767").AllowAnyMethod().AllowAnyHeader(); });});
builder.Services.AddIdentityCore<User>(options =>
{
    options.Password.RequireNonAlphanumeric = false;
    options.Password.RequiredLength = 6;
    options.Password.RequireDigit = false;
    options.Password.RequireLowercase = false;
    options.Password.RequireUppercase = false;
}).AddRoles<IdentityRole>()
    .AddRoleManager<RoleManager<IdentityRole>>()
    .AddEntityFrameworkStores<ApplicationDbContext>()
    .AddSignInManager<SignInManager<User>>().
    AddUserManager<UserManager<User>>()
    .AddDefaultTokenProviders();

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
}
).AddJwtBearer(options => {

    options.TokenValidationParameters = new Microsoft.IdentityModel.Tokens.TokenValidationParameters
    {
        //IssuerSigningKey=new SymmetricSecurityKey(Encoding.ASCII.GetBytes(builder.Configuration.GetSection("JSON").GetValue<String>("Key"))),
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes("B3D9CC125378D8E18F912A6367F7AB3D9CC125378D8E18F912A6367F7A")),
        ValidateIssuerSigningKey = true,
        ValidateIssuer = true,
        //ValidIssuer= builder.Configuration.GetSection("JSON").GetValue<String>("Issuer"),
        ValidIssuer = "http://localhost:5083",
        ValidateAudience = false,
    };
});
const string adminRole = "ADMIN";
const string clientRole = "CLIENT";
const string superClientRole = "SUPER_CLIENT";
builder.Services.AddAuthorization(options => {
    options.AddPolicy("ADMIN_ONLY", (policy) =>
    {
policy.RequireRole(adminRole);
    });
    options.AddPolicy("CLIENT_ONLY", (policy) =>
    {
        policy.RequireRole(clientRole,superClientRole);
    });
    options.AddPolicy("SUPER_CLIENT_ONLY", (policy) =>
    {
        policy.RequireRole(superClientRole);
    });
    options.AddPolicy("ADMIN_CLIENT_ONLY", (policy) =>
    {
        policy.RequireRole(superClientRole,adminRole,clientRole);
    });
    options.AddPolicy("ADMIN_SUPER_CLIENT_ONLY", (policy) =>
    {
        policy.RequireRole(superClientRole, adminRole);
    });
}
);
builder.Services.AddScoped<JwtService>();
builder.Services.AddScoped<DataSeedingService>();
builder.Services.AddScoped<EmailService>();


var app = builder.Build();
//var rootImages = "";
var scopeFactory = app.Services.GetService<IServiceScopeFactory>();
using (var scope = scopeFactory.CreateScope())
{
   /* var service2 = scope.ServiceProvider.GetService<IWebHostEnvironment>();
    rootImages = service2.ContentRootPath.Replace("\\", "/") + "/images";*/
    var service=scope.ServiceProvider.GetService<DataSeedingService>();
    await service.seedRolesData();
}


// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
app.UseCors("myPolicy");
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
/*if (!Directory.Exists(rootImages+"/Article"))
{
    Directory.CreateDirectory(rootImages+"/Article");
}
if (!Directory.Exists(rootImages + "/Societe"))
{
    Directory.CreateDirectory(rootImages+ "/Societe");
}
if (!Directory.Exists(rootImages + "/User"))
{
    Directory.CreateDirectory(rootImages + "/User");
}*/


app.Run();
