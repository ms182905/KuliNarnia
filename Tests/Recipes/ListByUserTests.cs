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
        private Mock<DataContext> _mockContext;

        private IMapper _mapper;
        private string userId = "AppUserId";
        private string userName = "AppUserName";

        [SetUp]
        public void Setup()
        {
            _mockContext = new Mock<DataContext>(new DbContextOptions<DataContext>());

            var config = new MapperConfiguration(cfg =>
            {
                cfg.AddProfile(new MappingProfiles());
            });
            _mapper = config.CreateMapper();

            var recipes = Enumerable
                .Range(1, 20)
                .Select(
                    i =>
                        new Recipe
                        {
                            Id = Guid.NewGuid(),
                            Title = "Przepis " + i,
                            Date = DateTime.Now.AddDays(-i),
                            CreatorId = (i % 5 == 0) ? userId : Guid.NewGuid().ToString()
                        }
                )
                .AsQueryable();

            var users = new List<AppUser>
            {
                new AppUser { UserName = userName, Id = userId }
            };

            _mockContext.Setup(c => c.Recipes).ReturnsDbSet(recipes);
            _mockContext.Setup(c => c.Users).ReturnsDbSet(users);
        }

        [Test]
        public async Task Handler_ReturnsNumberOfRecipesCreatedByUser()
        {
            var handler = new Application.Recipes.ListByUser.Handler(_mockContext.Object, _mapper);
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
            var handler = new Application.Recipes.ListByUser.Handler(_mockContext.Object, _mapper);
            var query = new Application.Recipes.ListByUser.Querry
            {
                From = 0,
                To = 3,
                UserName = "AnotherUserName"
            };

            var result = await handler.Handle(query, CancellationToken.None);

            Assert.IsNull(result);
        }
    }
}
