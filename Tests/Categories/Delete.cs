using Moq;
using Application.Categories;
using Domain;
using Persistence;
using Microsoft.EntityFrameworkCore;
using Moq.EntityFrameworkCore;

namespace UnitTests.Categories
{
    [TestFixture]
    public class DeleteCategoryTests
    {
        private Mock<DataContext> _mockContext;
        private Guid categoryIdToDelete;
        private Guid unknownCategoryId;
        private List<Recipe> recipes;

        [SetUp]
        public void SetUp()
        {
            _mockContext = new Mock<DataContext>(new DbContextOptions<DataContext>());

            categoryIdToDelete = Guid.NewGuid();
            unknownCategoryId = Guid.NewGuid();
            var categoryToDelete = new Category
            {
                Id = categoryIdToDelete,
                Name = "Category to delete"
            };
            var unknownCategory = new Category { Id = unknownCategoryId, Name = "Unknown" };
            var categories = new List<Category> { categoryToDelete, unknownCategory };
            var userSelections = new List<UserSelectionStastic>
            {
                new() { CategoryId = categoryIdToDelete }
            };
            recipes = new List<Recipe>
            {
                new Recipe { Id = Guid.NewGuid(), CategoryId = categoryIdToDelete },
                new Recipe { Id = Guid.NewGuid(), CategoryId = categoryIdToDelete }
            };

            _mockContext.Setup(c => c.Categories).ReturnsDbSet(categories);
            _mockContext.Setup(c => c.Recipes).ReturnsDbSet(recipes);
            _mockContext.Setup(x => x.UserSelectionStastics).ReturnsDbSet(userSelections);

            _mockContext
                .Setup(x => x.SaveChangesAsync(It.IsAny<CancellationToken>()))
                .ReturnsAsync(1);
        }

        [Test]
        public async Task Handler_CategoryExists_DeletesCategory()
        {
            var handler = new Application.Categories.Delete.Handler(_mockContext.Object);
            var command = new Delete.Command { CategoryId = categoryIdToDelete };

            var result = await handler.Handle(command, CancellationToken.None);

            Assert.IsNotNull(result);
            Assert.IsTrue(result.IsSuccess);
            _mockContext.Verify(
                x => x.SaveChangesAsync(It.IsAny<CancellationToken>()),
                Times.AtLeastOnce
            );
            foreach (var recipe in recipes)
            {
                Assert.That(recipe.CategoryId, Is.EqualTo(unknownCategoryId));
            }
        }

        [Test]
        public async Task Handler_CategoryDoesNotExist_ReturnsNull()
        {
            var handler = new Application.Categories.Delete.Handler(_mockContext.Object);
            var command = new Delete.Command { CategoryId = Guid.NewGuid() };

            var result = await handler.Handle(command, CancellationToken.None);

            Assert.IsNull(result);
        }
    }
}
