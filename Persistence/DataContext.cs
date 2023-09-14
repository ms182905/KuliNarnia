using Domain;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Persistence
{
    public class DataContext : IdentityDbContext<AppUser>
    {
        public DataContext(DbContextOptions options) : base(options)
        {
        }

        public DbSet<Recipe> Recipes { get; set; }
        public DbSet<FavouriteRecipe> FavouriteRecipes { get; set; }
        public DbSet<Ingredient> Ingredients { get; set; }
        public DbSet<Measurement> Measurements { get; set; }


        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<FavouriteRecipe>(x => x.HasKey(aa => new {aa.AppUserId, aa.RecipeId}));

            builder.Entity<FavouriteRecipe>()
                .HasOne(u => u.AppUser)
                .WithMany(a => a.FavouriteRecipes)
                .HasForeignKey(aa => aa.AppUserId);

            builder.Entity<FavouriteRecipe>()
                .HasOne(u => u.Recipe)
                .WithMany(a => a.FavouriteRecipes)
                .HasForeignKey(aa => aa.RecipeId);

            builder.Entity<AppUser>()
                .HasMany(u => u.CreatedRecipes)
                .WithOne(a => a.Creator)
                .HasForeignKey(aa => aa.CreatorId);

            builder.Entity<Recipe>()
                .HasMany(u => u.Ingredients)
                .WithOne(a => a.Recipe)
                .HasForeignKey(aa => aa.RecipeId);

            builder.Entity<Measurement>()
                .HasMany(u => u.Ingredients)
                .WithOne(a => a.Measurement)
                .HasForeignKey(aa => aa.MeasurementId);
        }
    }
}