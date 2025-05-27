using B2BApplication.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System.Reflection.Emit;
using static B2BApplication.Models.ArticleViews;

namespace B2BApplication.Context
{
    public class ApplicationDbContext: IdentityDbContext<User>
    {
       
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext>options):base(options)
        {

        }
        protected override void OnModelCreating(ModelBuilder builder)
        {
            //SeedData(builder);
            builder.Entity<Article>().Property(a => a.ArticlePrixHT).HasPrecision(18, 3);
            builder.Entity<CommandeLigne>().Property(cl => cl.articlePrixHt).HasPrecision(18, 3);
            builder.Entity<CommandeLigne>().Property(cl => cl.articlePrixTtc).HasPrecision(18, 3);
            builder.Entity<CommandeLigne>().Property(cl => cl.articleTauxTva).HasPrecision(18, 3);
            builder.Entity<CommandeLigne>().Property(cl => cl.ligneTotalHt).HasPrecision(18, 3);
            builder.Entity<CommandeLigne>().Property(cl => cl.ligneTotalTaxes).HasPrecision(18, 3);
            builder.Entity<CommandeLigne>().Property(cl => cl.ligneTotalTtc).HasPrecision(18, 3);

            builder.Entity<Taxe>().Property(t => t.TaxeTaux).HasPrecision(18, 2);

            builder.Entity<Tarif>().Property(t => t.TarifPrix).HasPrecision(18, 3);

            builder.Entity<Commande>().Property(c => c.commandeTotalHt).HasPrecision(18, 3);
            builder.Entity<Commande>().Property(c => c.commandeTotalTaxes).HasPrecision(18, 3);
            builder.Entity<Commande>().Property(c => c.commandeTotalTtc).HasPrecision(18, 3);
            builder.Entity<ArticleInStore>().HasNoKey().ToView("ArticleInStore");
            builder.Entity<ArticleInStore>().Property(ais=>ais.tarifPrix).HasPrecision(18, 3);
            builder.Entity<ArticleInStore>().Property(ais => ais.taxeTaux).HasPrecision(18, 2);

            

            builder.Entity<Models.ArticleViews>()
             .HasKey(av => new { av.idArt, av.userId });


            builder.Entity<DemandeRetour>()
    .HasOne(p => p.commande)
    .WithOne(c => c.demandeRetour)
    .HasForeignKey<DemandeRetour>((dr) => dr.commandeId)
    .OnDelete(DeleteBehavior.NoAction);

            builder.Entity<LigneDemandeRetour>()
   .HasOne(p => p.commandeLigne)
    .WithOne((c)=>c.ligneRetour)
   .HasForeignKey<LigneDemandeRetour>((p) => p.commandeLigneId)
   .OnDelete(DeleteBehavior.NoAction);

             builder.Entity<Article>()
            .Property(a => a.description)
            .HasColumnType("nvarchar(max)");






            base.OnModelCreating(builder);

        }
        public DbSet<Commande> commandes { get; set; }
        public DbSet<CommandeLigne> commandeLignes { get; set; }
        public DbSet<Statut> statusCommandes { get; set; }
        public DbSet<Client> client { get; set; }
        public DbSet<Societe> societe { get; set; }
        //tokens for society email validation
        public DbSet<Catalogue> catalogue { get; set; }
        public DbSet<Famille> famille { get; set; }
        public DbSet<Taxe> taxe { get; set; }
        public DbSet<Article> article { get; set; }
        public DbSet<TarifEntete> TarifEntete { get; set; }
        public DbSet<Tarif> tarifs { get; set; }
        public DbSet<ArticleInStore> articleInStores { get; set; }
        public DbSet<LignePanier>lignePaniers { get; set; }
        public DbSet<DemandeRetour> demandesRetour { get; set; }
        public DbSet<LigneDemandeRetour> lignedemandesRetour { get; set; }
        public DbSet<Motif> motifs { get; set; }
        public DbSet<LigneWishlist> ligneWishList { get; set; }
        public DbSet<Models.ArticleViews> articlesViews { get; set; }

    }
}
