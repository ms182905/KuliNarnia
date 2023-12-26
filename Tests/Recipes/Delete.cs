using Moq;
using Application.Recipes;
using Domain;
using Persistence;
using Application.Interfaces;
using Microsoft.EntityFrameworkCore;
using Moq.EntityFrameworkCore;

namespace UnitTests.Recipes
{
    [TestFixture]
    public class DeleteRecipeTests
    {
        private Mock<DataContext> _mockContext;
        private Mock<IPhotoAccessor> _mockPhotoAccessor;
        private Guid existingRecipeId;

        [SetUp]
        public void SetUp()
        {
            _mockContext = new Mock<DataContext>(new DbContextOptions<DataContext>());
            _mockPhotoAccessor = new Mock<IPhotoAccessor>();

            existingRecipeId = Guid.NewGuid();
            var existingRecipe = new Recipe { Id = existingRecipeId };
            var photos = new List<Photo>
            {
                new Photo { Id = "photoId", RecipeId = existingRecipeId }
            };

            _mockContext
                .Setup(x => x.Recipes.FindAsync(existingRecipeId))
                .ReturnsAsync(existingRecipe);
            _mockContext.Setup(x => x.Photos).ReturnsDbSet(photos);
            _mockContext
                .Setup(x => x.SaveChangesAsync(It.IsAny<CancellationToken>()))
                .ReturnsAsync(1);

            _mockPhotoAccessor
                .Setup(x => x.DeletePhoto(It.IsAny<string>()))
                .ReturnsAsync("Photo deleted");
        }

        [Test]
        public async Task Handler_RecipeExists_DeletesRecipe()
        {
            var handler = new Delete.Handler(_mockContext.Object, _mockPhotoAccessor.Object);
            var command = new Delete.Command { Id = existingRecipeId };

            var result = await handler.Handle(command, CancellationToken.None);

            Assert.IsNotNull(result);
            Assert.IsTrue(result.IsSuccess);
            _mockContext.Verify(x => x.Recipes.Remove(It.IsAny<Recipe>()), Times.Once);
            _mockContext.Verify(x => x.Photos.Remove(It.IsAny<Photo>()), Times.Once);
            _mockContext.Verify(x => x.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);
            _mockPhotoAccessor.Verify(x => x.DeletePhoto(It.IsAny<string>()), Times.Once);
        }

        [Test]
        public async Task Handler_RecipeDoesNotExist_ReturnsNull()
        {
            var handler = new Delete.Handler(_mockContext.Object, _mockPhotoAccessor.Object);
            var command = new Delete.Command { Id = Guid.NewGuid() };

            var result = await handler.Handle(command, CancellationToken.None);

            Assert.IsNull(result);
        }
    }
}
