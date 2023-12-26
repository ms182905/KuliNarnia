using Moq;
using Application.Tags;
using Domain;
using Persistence;
using Application.DTOs;
using Microsoft.EntityFrameworkCore;

namespace UnitTests.Tags
{
    [TestFixture]
    public class EditTagTests
    {
        private Mock<DataContext> _mockContext;
        private Guid tagId;

        [SetUp]
        public void SetUp()
        {
            _mockContext = new Mock<DataContext>(new DbContextOptions<DataContext>());

            tagId = Guid.NewGuid();
            var existingTag = new Tag { Id = tagId, Name = "Old Tag Name" };
            
            _mockContext.Setup(x => x.Tags.FindAsync(tagId))
                .ReturnsAsync(existingTag);

            _mockContext.Setup(x => x.SaveChangesAsync(It.IsAny<CancellationToken>()))
                .ReturnsAsync(1);
        }

        [Test]
        public async Task Handler_WhenTagExists_UpdatesTag()
        {
            var handler = new Application.Tags.Edit.Handler(_mockContext.Object);
            var command = new Edit.Command
            {
                TagId = tagId,
                TagDTO = new TagDTO { Name = "New Tag Name" }
            };

            var result = await handler.Handle(command, CancellationToken.None);

            Assert.IsNotNull(result);
            Assert.IsTrue(result.IsSuccess);
            _mockContext.Verify(x => x.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);
        }

        [Test]
        public async Task Handler_WhenTagDoesNotExist_ReturnsNull()
        {
            var handler = new Application.Tags.Edit.Handler(_mockContext.Object);
            var command = new Edit.Command
            {
                TagId = Guid.NewGuid(),
                TagDTO = new TagDTO { Name = "New Tag Name" }
            };

            _mockContext.Setup(x => x.Tags.FindAsync(tagId))
                .ReturnsAsync(() => null);

            var result = await handler.Handle(command, CancellationToken.None);

            Assert.IsNull(result);
        }
    }
}
