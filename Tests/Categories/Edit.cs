using Moq;
using Domain;
using Persistence;
using Application.DTOs;
using Microsoft.EntityFrameworkCore;

namespace UnitTests.Categories
{
    [TestFixture]
    public class EditTagTests
    {
        private Mock<DataContext> _mockContext;
        private Guid categoryId;

        [SetUp]
        public void SetUp()
        {
            _mockContext = new Mock<DataContext>(new DbContextOptions<DataContext>());

            categoryId = Guid.NewGuid();
            var existingCategory = new Category { Id = categoryId, Name = "Old Category Name" };

            _mockContext
                .Setup(x => x.Categories.FindAsync(categoryId))
                .ReturnsAsync(existingCategory);

            _mockContext
                .Setup(x => x.SaveChangesAsync(It.IsAny<CancellationToken>()))
                .ReturnsAsync(1);
        }

        [Test]
        public async Task Handler_WhenCategoryExists_UpdatesCategory()
        {
            var handler = new Application.Categories.Edit.Handler(_mockContext.Object);
            var command = new Application.Categories.Edit.Command
            {
                CategoryId = categoryId,
                CategoryDTO = new CategoryDTO { Name = "New Category Name" }
            };

            var result = await handler.Handle(command, CancellationToken.None);

            Assert.IsNotNull(result);
            Assert.IsTrue(result.IsSuccess);
            _mockContext.Verify(x => x.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);
        }

        [Test]
        public async Task Handler_WhenCategoryDoesNotExist_ReturnsNull()
        {
            var handler = new Application.Categories.Edit.Handler(_mockContext.Object);
            var command = new Application.Categories.Edit.Command
            {
                CategoryId = Guid.NewGuid(),
                CategoryDTO = new CategoryDTO { Name = "New Category Name" }
            };

            _mockContext.Setup(x => x.Categories.FindAsync(categoryId)).ReturnsAsync(() => null);

            var result = await handler.Handle(command, CancellationToken.None);

            Assert.IsNull(result);
        }
    }
}
