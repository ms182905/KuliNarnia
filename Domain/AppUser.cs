using Microsoft.AspNetCore.Identity;

namespace Domain
{
    public class AppUser : IdentityUser
    {
        public string DisplayName { get; set; }
        public string Bio { get; set; }
        public ICollection<FavouriteRecipe> FavouriteRecipes { get; set; }
        public ICollection<Recipe> CreatedRecipes { get; set; }
    }
}