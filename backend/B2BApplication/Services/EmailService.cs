using B2BApplication.DTO;
using Mailjet.Client;
using Mailjet.Client.TransactionalEmails;

namespace B2BApplication.Services
{
    public class EmailService
    {
        IConfiguration config;
        public EmailService(IConfiguration _config) { 
       config = _config;
        }
        public async Task<Mailjet.Client.TransactionalEmails.Response.TransactionalEmailResponse> sendEmailAsync(String to,String subject,String body)
        {
            MailjetClient client = new MailjetClient(config["MailJet:ApiKey"], config["MailJet:secretKey"]);
            TransactionalEmailBuilder builder = new TransactionalEmailBuilder();
            var message=builder.WithFrom(new SendContact(config["Mail:From"]))
                .WithTo(new SendContact(to))
            .WithSubject(subject)
            .WithHtmlPart(body)
            .Build();
            return await client.SendTransactionalEmailAsync(message);
        }
    }
}
