using Domain;

namespace Persistence
{
    public class Seed
    {
        public static async Task SeedData(DataContext context)
        {
            if (context.Recipes.Any()) return;
            
            var activities = new List<Recipe>
            {
                new Recipe
                {
                    Title = "Past Recipe 1",
                    Date = DateTime.UtcNow.AddMonths(-2),
                    Description = "Recipe 2 months ago",
                },
                new Recipe
                {
                    Title = "Past Recipe 2",
                    Date = DateTime.UtcNow.AddMonths(-1),
                    Description = "Recipe 1 month ago",
                },
                new Recipe
                {
                    Title = "Future Recipe 1",
                    Date = DateTime.UtcNow.AddMonths(1),
                    Description = "Recipe 1 month in future",
                },
                new Recipe
                {
                    Title = "Future Recipe 2",
                    Date = DateTime.UtcNow.AddMonths(2),
                    Description = "Recipe 2 months in future",
                },
                new Recipe
                {
                    Title = "Future Recipe 3",
                    Date = DateTime.UtcNow.AddMonths(3),
                    Description = "Recipe 3 months in future",
                },
                new Recipe
                {
                    Title = "Future Recipe 4",
                    Date = DateTime.UtcNow.AddMonths(4),
                    Description = "Recipe 4 months in future",
                },
                new Recipe
                {
                    Title = "Future Recipe 5",
                    Date = DateTime.UtcNow.AddMonths(5),
                    Description = "Recipe 5 months in future",
                },
                new Recipe
                {
                    Title = "Future Recipe 6",
                    Date = DateTime.UtcNow.AddMonths(6),
                    Description = "Recipe 6 months in future",
                },
                new Recipe
                {
                    Title = "Future Recipe 7",
                    Date = DateTime.UtcNow.AddMonths(7),
                    Description = "Recipe 2 months ago",
                },
                new Recipe
                {
                    Title = "Future Recipe 8",
                    Date = DateTime.UtcNow.AddMonths(8),
                    Description = "Recipe 8 months in future",
                }
            };

            await context.Recipes.AddRangeAsync(activities);
            await context.SaveChangesAsync();
        }
    }
}