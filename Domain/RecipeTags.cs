namespace Domain
{
    public class RecipeTags
    {
        public Guid TagId { get; set; }
        public Tag Tag { get; set; }
        public Guid RecipeId { get; set; }
        public Recipe Recipe { get; set; }
    }
}