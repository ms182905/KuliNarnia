using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Domain
{
    public class Recipe
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public Guid Id { get; set; }
        public string Title { get; set; }
        public DateTime Date { get; set; }
        public Category Category { get; set; }
        public Guid CategoryId { get; set; }
        public string Description { get; set; }
        public AppUser Creator { get; set; }
        public string CreatorId { get; set; }
        public ICollection<FavouriteRecipe> FavouriteRecipes { get; set; }
        public ICollection<Ingredient> Ingredients { get; set; }
        public ICollection<RecipeTags> RecipeTags { get; set; }
        public ICollection<Comment> Comments { get; set; }
        public ICollection<Instruction> Instructions { get; set; }
        public ICollection<Photo> Photos { get; set; }
    }
}