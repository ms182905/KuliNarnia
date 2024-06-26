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

        public virtual DbSet<Recipe> Recipes { get; set; }
        public virtual DbSet<FavouriteRecipe> FavouriteRecipes { get; set; }
        public virtual DbSet<Ingredient> Ingredients { get; set; }
        public virtual DbSet<Measurement> Measurements { get; set; }
        public virtual DbSet<Category> Categories { get; set; }
        public virtual DbSet<Tag> Tags { get; set; }
        public virtual DbSet<RecipeTags> RecipeTags { get; set; }
        public virtual DbSet<Comment> Comments { get; set; }
        public virtual DbSet<Instruction> Instructions { get; set; }
        public virtual DbSet<UserSelectionStastic> UserSelectionStastics { get; set; }
        public virtual DbSet<Photo> Photos { get; set; }

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

            builder.Entity<Ingredient>()
                .HasOne(u => u.Recipe)
                .WithMany(a => a.Ingredients)
                .HasForeignKey(aa => aa.RecipeId);

            builder.Entity<Measurement>()
                .HasMany(u => u.Ingredients)
                .WithOne(a => a.Measurement)
                .HasForeignKey(aa => aa.MeasurementId);

            builder.Entity<Category>()
                .HasMany(u => u.Recipes)
                .WithOne(a => a.Category)
                .HasForeignKey(aa => aa.CategoryId);
        
            builder.Entity<RecipeTags>(x => x.HasKey(aa => new {aa.TagId, aa.RecipeId}));

            builder.Entity<RecipeTags>()
                .HasOne(u => u.Tag)
                .WithMany(a => a.RecipeTags)
                .HasForeignKey(aa => aa.TagId);

            builder.Entity<Comment>()
                .HasOne(u => u.Recipe)
                .WithMany(a => a.Comments)
                .HasForeignKey(aa => aa.RecipeId);

            builder.Entity<Instruction>()
                .HasOne(u => u.Recipe)
                .WithMany(a => a.Instructions)
                .HasForeignKey(aa => aa.RecipeId);

            builder.Entity<UserSelectionStastic>(x => x.HasKey(aa => new {aa.CategoryId, aa.TagId, aa.UserId}));

            builder.Entity<UserSelectionStastic>()
                .HasOne(u => u.Category)
                .WithMany(a => a.UserSelectionStastics)
                .HasForeignKey(aa => aa.CategoryId);

            builder.Entity<Photo>()
                .HasOne(u => u.Recipe)
                .WithMany(a => a.Photos)
                .HasForeignKey(aa => aa.RecipeId);
        }
    }
}