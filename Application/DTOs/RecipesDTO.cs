namespace Application.DTOs
{
    public class RecipesDTO
    {
        public ICollection<RecipeDTO> Recipes { get; set; }
        public int Count { get; set; }
    }
}