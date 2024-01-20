using Moq;
using Domain;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Persistence;
using Moq.EntityFrameworkCore;
using Application.Core;

namespace UnitTests.Recipes
{
    [TestFixture]
    public class ListRecipesByUserTests
    {
        private DataContext _context;

        private IMapper _mapper;
        private string userId = "AppUserId";
        private string userName = "AppUserName";

        [SetUp]
        public void Setup()
        {
            var options = new DbContextOptionsBuilder<DataContext>()
                .UseInMemoryDatabase(databaseName: "TestDatabase")
                .Options;
            _context = new DataContext(options);

            var config = new MapperConfiguration(cfg =>
            {
                cfg.AddProfile(new MappingProfiles());
            });
            _mapper = config.CreateMapper();

            var categories = new List<Category>
            {
                new Category { Id = Guid.NewGuid(), Name = "Kategoria 1" },
                new Category { Id = Guid.NewGuid(), Name = "Kategoria 2" }
            };

            var tags = new List<Tag>
            {
                new Tag { Id = Guid.NewGuid(), Name = "Tag 1" },
                new Tag { Id = Guid.NewGuid(), Name = "Tag 2" }
            };

            var recipes = Enumerable
                .Range(1, 20)
                .Select(
                    i =>
                        new Recipe
                        {
                            Id = Guid.NewGuid(),
                            CreatorId = i % 5 == 0 ? userId : "idid",
                            Title = "Przepis " + i,
                            CategoryId = categories[i % categories.Count].Id,
                            Date = DateTime.Now.AddDays(-i),
                            Ingredients = new List<Ingredient>
                            {
                                new Ingredient { Name = "Składnik" }
                            },
                            RecipeTags = new List<RecipeTags>
                            {
                                new RecipeTags { TagId = tags[i % tags.Count].Id }
                            }
                        }
                )
                .ToList();

            var users = new List<AppUser>
            {
                new AppUser { UserName = userName, Id = userId }
            };

            _context.Users.AddRange(users);
            _context.SaveChanges();

            _context.Categories.AddRange(categories);
            _context.Tags.AddRange(tags);
            _context.Recipes.AddRange(recipes);
            _context.SaveChanges();
        }

        [Test]
        public async Task Handler_ReturnsNumberOfRecipesCreatedByUser()
        {
            var handler = new Application.Recipes.ListByUser.Handler(_context, _mapper);
            var query = new Application.Recipes.ListByUser.Querry
            {
                From = 0,
                To = 3,
                UserName = userName
            };

            var result = await handler.Handle(query, CancellationToken.None);

            Assert.IsNotNull(result.Value);
            Assert.That(result.Value.Count, Is.EqualTo(4));
            Assert.That(result.Value.Recipes, Has.Count.EqualTo(3));
            Assert.That(result.Value.Recipes.Any(r => r.Title == "Przepis 5"));
            Assert.That(result.Value.Recipes.Any(r => r.Title == "Przepis 10"));
            Assert.That(result.Value.Recipes.Any(r => r.Title == "Przepis 15"));
        }

        [Test]
        public async Task Handler_NoUserName_ReturnsNull()
        {
            var handler = new Application.Recipes.ListByUser.Handler(_context, _mapper);
            var query = new Application.Recipes.ListByUser.Querry
            {
                From = 0,
                To = 3,
                UserName = "AnotherUserName"
            };

            var result = await handler.Handle(query, CancellationToken.None);

            Assert.IsNull(result);
        }

        [TearDown]
        public void Cleanup()
        {
            _context.Database.EnsureDeleted();
            _context.Dispose();
        }
    }
}
