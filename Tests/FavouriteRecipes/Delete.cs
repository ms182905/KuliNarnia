using Moq;
using NUnit.Framework;
using System;
using System.Threading.Tasks;
using Application.FavouriteRecipes;
using Domain;
using Microsoft.EntityFrameworkCore;
using Persistence;
using Moq.EntityFrameworkCore;
using Application.Interfaces;

namespace UnitTests.FavouriteRecipes
{
    [TestFixture]
    public class DeleteFromFavouritesTests
    {
        private Mock<DataContext> _mockContext;
        private Mock<IUserAccessor> _mockUserAccessor;
        private Guid _userId;
        private Guid _recipeId;

        [SetUp]
        public void SetUp()
        {
            _mockContext = new Mock<DataContext>(new DbContextOptions<DataContext>());
            _mockUserAccessor = new Mock<IUserAccessor>();

            _userId = Guid.NewGuid();
            _recipeId = Guid.NewGuid();
            var user = new AppUser { Id = _userId.ToString(), UserName = "testuser" };

            _mockContext.Setup(x => x.Users).ReturnsDbSet(new List<AppUser> { user });

            _mockContext
                .Setup(x => x.SaveChangesAsync(It.IsAny<CancellationToken>()))
                .ReturnsAsync(1);
        }

        [Test]
        public async Task Handler_UserDoesNotExist_ReturnsNull()
        {
            _mockUserAccessor.Setup(x => x.GetUsername()).Returns("nonexistentuser");
            var handler = new Delete.Handler(_mockContext.Object, _mockUserAccessor.Object);

            var result = await handler.Handle(
                new Delete.Command { Id = _recipeId },
                CancellationToken.None
            );

            Assert.IsNull(result);
        }

        [Test]
        public async Task Handler_RecipeNotInFavourites_ReturnsFailure()
        {
            _mockUserAccessor.Setup(x => x.GetUsername()).Returns("testuser");
            _mockContext.Setup(x => x.FavouriteRecipes).ReturnsDbSet(new List<FavouriteRecipe>());

            var handler = new Delete.Handler(_mockContext.Object, _mockUserAccessor.Object);

            var result = await handler.Handle(
                new Delete.Command { Id = _recipeId },
                CancellationToken.None
            );

            Assert.IsFalse(result.IsSuccess);
            Assert.That(result.Error, Is.EqualTo("No such recipe in favourites"));
        }

        [Test]
        public async Task Handler_ValidRequest_RemovesRecipeFromFavourites()
        {
            _mockUserAccessor.Setup(x => x.GetUsername()).Returns("testuser");
            _mockContext
                .Setup(x => x.FavouriteRecipes)
                .ReturnsDbSet(
                    new List<FavouriteRecipe>
                    {
                        new FavouriteRecipe { AppUserId = _userId.ToString(), RecipeId = _recipeId }
                    }
                );

            var handler = new Delete.Handler(_mockContext.Object, _mockUserAccessor.Object);

            var result = await handler.Handle(
                new Delete.Command { Id = _recipeId },
                CancellationToken.None
            );

            Assert.IsTrue(result.IsSuccess);
            _mockContext.Verify(
                x => x.SaveChangesAsync(It.IsAny<CancellationToken>()),
                Times.Once()
            );
        }
    }
}
