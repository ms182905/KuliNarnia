namespace Domain
{
    public class Recipe
    {
        public Guid Id { get; set; }
        public string Title { get; set; }
        public DateTime Date { get; set; }
        // public string Category { get; set; }
        public Category Category { get; set; }
        public Guid CategoryId { get; set; }
        public string Description { get; set; }
        public AppUser Creator { get; set; }
        public string CreatorId { get; set; }
        public ICollection<FavouriteRecipe> FavouriteRecipes { get; set; }
        public ICollection<Ingredient> Ingredients { get; set; }
        public ICollection<RecipeTags> RecipeTags { get; set; }
        public ICollection<Comment> Comments { get; set; }

    }
}