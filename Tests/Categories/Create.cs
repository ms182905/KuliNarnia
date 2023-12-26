using Moq;
using Application.Categories;
using Domain;
using Persistence;
using Application.DTOs;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;

namespace UnitTests.Categories
{
    [TestFixture]
    public class CreateCategoryTests
    {
        private Mock<DataContext> _mockContext;
        private Category? capturedCategory = null;

        [SetUp]
        public void SetUp()
        {
            _mockContext = new Mock<DataContext>(new DbContextOptions<DataContext>());

            _mockContext
                .Setup(
                    x => x.Categories.AddAsync(It.IsAny<Category>(), It.IsAny<CancellationToken>())
                )
                .Callback(
                    (Category category, CancellationToken cancellationToken) =>
                    {
                        capturedCategory = category;
                    }
                )
                .Returns(() =>
                {
                    return new ValueTask<EntityEntry<Category>>();
                });

            _mockContext
                .Setup(x => x.SaveChangesAsync(It.IsAny<CancellationToken>()))
                .ReturnsAsync(1);
        }

        [Test]
        public async Task Handler_CreatesNewTag()
        {
            var handler = new Application.Categories.Create.Handler(_mockContext.Object);
            var command = new Create.Command
            {
                CategoryDTO = new CategoryDTO { Id = Guid.NewGuid(), Name = "New Category Name" }
            };

            var result = await handler.Handle(command, CancellationToken.None);

            Assert.IsNotNull(result);
            Assert.IsTrue(result.IsSuccess);
            _mockContext.Verify(
                x => x.Categories.AddAsync(It.IsAny<Category>(), It.IsAny<CancellationToken>()),
                Times.Once
            );
            _mockContext.Verify(x => x.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);
            Assert.IsNotNull(capturedCategory);
            Assert.That(capturedCategory.Name, Is.EqualTo("New Category Name"));
        }
    }
}
