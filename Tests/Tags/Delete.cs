using Moq;
using Application.Tags;
using Domain;
using Persistence;
using Microsoft.EntityFrameworkCore;
using Moq.EntityFrameworkCore;

namespace UnitTests.Tags
{
    [TestFixture]
    public class DeleteTagTests
    {
        private Mock<DataContext> _mockContext;
        private Guid tagId;

        [SetUp]
        public void SetUp()
        {
            _mockContext = new Mock<DataContext>(new DbContextOptions<DataContext>());

            tagId = Guid.NewGuid();
            var existingTag = new Tag { Id = tagId, Name = "Existing Tag" };
            var userSelections = new List<UserSelectionStastic> { new() { TagId = tagId } };
            var recipeTags = new List<RecipeTags> { new() { TagId = tagId } };

            _mockContext.Setup(x => x.Tags.FindAsync(tagId)).ReturnsAsync(existingTag);
            _mockContext.Setup(x => x.UserSelectionStastics).ReturnsDbSet(userSelections);
            _mockContext.Setup(x => x.RecipeTags).ReturnsDbSet(recipeTags);

            _mockContext
                .Setup(x => x.SaveChangesAsync(It.IsAny<CancellationToken>()))
                .ReturnsAsync(1);
        }

        [Test]
        public async Task Handler_WhenTagExists_DeletesTagAndAssociatedData()
        {
            var handler = new Application.Tags.Delete.Handler(_mockContext.Object);
            var command = new Delete.Command { TagId = tagId };

            var result = await handler.Handle(command, CancellationToken.None);

            Assert.IsNotNull(result);
            Assert.IsTrue(result.IsSuccess);
            _mockContext.Verify(x => x.Tags.Remove(It.IsAny<Tag>()), Times.Once);
            _mockContext.Verify(
                x =>
                    x.UserSelectionStastics.RemoveRange(
                        It.IsAny<IEnumerable<UserSelectionStastic>>()
                    ),
                Times.Once
            );
            _mockContext.Verify(
                x => x.RecipeTags.RemoveRange(It.IsAny<IEnumerable<RecipeTags>>()),
                Times.Once
            );
            _mockContext.Verify(
                x => x.SaveChangesAsync(It.IsAny<CancellationToken>()),
                Times.AtLeastOnce()
            );
        }

        [Test]
        public async Task Handler_WhenTagDoesNotExist_ReturnsNull()
        {
            var handler = new Application.Tags.Delete.Handler(_mockContext.Object);
            var command = new Delete.Command { TagId = Guid.NewGuid() };

            _mockContext.Setup(x => x.Tags.FindAsync(It.IsAny<Guid>())).ReturnsAsync(() => null);

            var result = await handler.Handle(command, CancellationToken.None);

            Assert.IsNull(result);
        }
    }
}
