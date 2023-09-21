using Domain;
using Microsoft.AspNetCore.Identity;

namespace Persistence
{
    public class Seed
    {
        public static async Task SeedData(DataContext context, UserManager<AppUser> userManager)
        {
            if (userManager.Users.Any()) return;
            
            var users = new List<AppUser>
            {
                new AppUser{Id = Guid.NewGuid().ToString(), DisplayName="Bob", UserName="bob", Email="bob@test.com"},
                new AppUser{Id = Guid.NewGuid().ToString(), DisplayName="Tom", UserName="tom", Email="tom@test.com"},
                new AppUser{Id = Guid.NewGuid().ToString(), DisplayName="Jane", UserName="jane", Email="jane@test.com"}
            };

            foreach (var user in users)
            {
                await userManager.CreateAsync(user, "Pa$$w0rd");
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

            if (context.Measurements.Any()) return;

            var measurements = new List<Measurement>
            {
                new Measurement
                {
                    Name = "Measurement 0"
                },
                new Measurement
                {
                    Name = "Measurement 1"
                },
                new Measurement
                {
                    Name = "Measurement 2"
                },
                new Measurement
                {
                    Name = "Measurement 3"
                },
                new Measurement
                {
                    Name = "Measurement 4"
                },
                new Measurement
                {
                    Name = "Measurement 5"
                }
            };

            if (context.Recipes.Any()) return;

            var recipes = new List<Recipe>
            {
                new() {
                    Id = Guid.NewGuid(),
                    Title = "Test Recipe 1",
                    Date = DateTime.UtcNow.AddMonths(-2),
                    Description = "Recipe 2 months ago",
                    Category = categories[0],
                    Creator = users[0],
                    Instructions = new List<Instruction>{
                        new() {
                            Position = 0,
                            Text = "Test Instruction Text, position 0"
                        },
                        new() {
                            Position = 1,
                            Text = "Test Instruction Text, position 1"
                        },
                        new() {
                            Position = 2,
                            Text = "Test Instruction Text, position 2"
                        }
                    },
                    Ingredients = new List<Ingredient>{
                        new() {
                            Name = "Ingredient 0",
                            Amount = 50,
                            Measurement = measurements[0]
                        },
                        new() {
                            Name = "Ingredient 1",
                            Amount = 4,
                            Measurement = measurements[1]
                        },
                        new() {
                            Name = "Ingredient 2",
                            Amount = 54,
                            Measurement = measurements[2]
                        },
                        new() {
                            Name = "Ingredient 3",
                            Amount = 112,
                            Measurement = measurements[3]
                        },
                        new() {
                            Name = "Ingredient 4",
                            Amount = 77,
                            Measurement = measurements[4]
                        }
                    },
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

            var comments = new List<Comment> 
            {
                new () {
                    Text = "Comment 0",
                    Date = DateTime.UtcNow.AddDays(-2),
                    AppUserId = users[1].Id,
                    RecipeId = recipes[0].Id
                },
                new () {
                    Text = "Comment 1",
                    Date = DateTime.UtcNow.AddDays(-4),
                    AppUserId = users[1].Id,
                    RecipeId = recipes[0].Id
                },
                new () {
                    Text = "Comment 2",
                    Date = DateTime.UtcNow.AddDays(-12),
                    AppUserId = users[1].Id,
                    RecipeId = recipes[0].Id
                },
                new () {
                    Text = "Comment 3",
                    Date = DateTime.UtcNow.AddDays(-1),
                    AppUserId = users[2].Id,
                    RecipeId = recipes[0].Id
                }
            };

            await context.Categories.AddRangeAsync(categories);
            await context.Measurements.AddRangeAsync(measurements);
            await context.Recipes.AddRangeAsync(recipes);
            await context.SaveChangesAsync();

            await context.Comments.AddRangeAsync(comments);
            await context.SaveChangesAsync();
        }
    }
}