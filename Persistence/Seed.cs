using Domain;
using Microsoft.AspNetCore.Identity;

namespace Persistence
{
    public class Seed
    {
        public static async Task SeedData(DataContext context, UserManager<AppUser> userManager)
        {
            if (!userManager.Users.Any())
            {
                var users = new List<AppUser>
                {
                    new AppUser{DisplayName="Bob", UserName="bob", Email="bob@test.com"},
                    new AppUser{DisplayName="Tom", UserName="tom", Email="tom@test.com"},
                    new AppUser{DisplayName="Jane", UserName="jane", Email="jane@test.com"}
                };

                foreach (var user in users)
                {
                    await userManager.CreateAsync(user, "Pa$$w0rd");
                }
            }

            if (context.Categories.Any()) return;

            var categories = new List<Category>
            {
                new Category
                {
                    Name = "appetizers"
                },
                new Category
                {
                    Name = "soups"
                },
                new Category
                {
                    Name = "main"
                },
                new Category
                {
                    Name = "desserts"
                },
                new Category
                {
                    Name = "drinks"
                },
            };

            if (context.Recipes.Any()) return;
            
            var recipes = new List<Recipe>
            {
                new Recipe
                {
                    Title = "Past Recipe 1",
                    Date = DateTime.UtcNow.AddMonths(-2),
                    Description = "Recipe 2 months ago",
                    Category = categories[0]
                },
                new Recipe
                {
                    Title = "Past Recipe 2",
                    Date = DateTime.UtcNow.AddMonths(-1),
                    Description = "Recipe 1 month ago",
                    Category = categories[0]
                },
                new Recipe
                {
                    Title = "Future Recipe 1",
                    Date = DateTime.UtcNow.AddMonths(1),
                    Description = "Recipe 1 month in future",
                    Category = categories[0]
                },
                new Recipe
                {
                    Title = "Future Recipe 2",
                    Date = DateTime.UtcNow.AddMonths(2),
                    Description = "Recipe 2 months in future",
                    Category = categories[0]
                },
                new Recipe
                {
                    Title = "Future Recipe 3",
                    Date = DateTime.UtcNow.AddMonths(3),
                    Description = "Recipe 3 months in future",
                    Category = categories[0]
                },
                new Recipe
                {
                    Title = "Future Recipe 4",
                    Date = DateTime.UtcNow.AddMonths(4),
                    Description = "Recipe 4 months in future",
                    Category = categories[0]
                },
                new Recipe
                {
                    Title = "Future Recipe 5",
                    Date = DateTime.UtcNow.AddMonths(5),
                    Description = "Recipe 5 months in future",
                    Category = categories[0]
                },
                new Recipe
                {
                    Title = "Future Recipe 6",
                    Date = DateTime.UtcNow.AddMonths(6),
                    Description = "Recipe 6 months in future",
                    Category = categories[0]
                },
                new Recipe
                {
                    Title = "Future Recipe 7",
                    Date = DateTime.UtcNow.AddMonths(7),
                    Description = "Recipe 2 months ago",
                    Category = categories[0]
                },
                new Recipe
                {
                    Title = "Future Recipe 8",
                    Date = DateTime.UtcNow.AddMonths(8),
                    Description = "Recipe 8 months in future",
                    Category = categories[0]
                }
            };

            await context.Categories.AddRangeAsync(categories);
            await context.Recipes.AddRangeAsync(recipes);
            await context.SaveChangesAsync();
        }
    }
}