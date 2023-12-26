using Moq;
using Domain;
using Persistence;
using Application.DTOs;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;

namespace UnitTests.Tags
{
    [TestFixture]
    public class CreateTagTests
    {
        private Mock<DataContext> _mockContext;
        private Tag? capturedTag = null;

        [SetUp]
        public void SetUp()
        {
            _mockContext = new Mock<DataContext>(new DbContextOptions<DataContext>());

            _mockContext
                .Setup(x => x.Tags.AddAsync(It.IsAny<Tag>(), It.IsAny<CancellationToken>()))
                .Callback(
                    (Tag tag, CancellationToken cancellationToken) =>
                    {
                        capturedTag = tag;
                    }
                )
                .Returns(() =>
                {
                    return new ValueTask<EntityEntry<Tag>>();
                });

            _mockContext
                .Setup(x => x.SaveChangesAsync(It.IsAny<CancellationToken>()))
                .ReturnsAsync(1);
        }

        [Test]
        public async Task Handler_CreatesNewTag()
        {
            var handler = new Application.Tags.Create.Handler(_mockContext.Object);
            var command = new Application.Tags.Create.Command
            {
                TagDTO = new TagDTO { Id = Guid.NewGuid(), Name = "New Tag Name" }
            };

            var result = await handler.Handle(command, CancellationToken.None);

            Assert.IsNotNull(result);
            Assert.IsTrue(result.IsSuccess);
            _mockContext.Verify(
                x => x.Tags.AddAsync(It.IsAny<Tag>(), It.IsAny<CancellationToken>()),
                Times.Once
            );
            _mockContext.Verify(x => x.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);
            Assert.IsNotNull(capturedTag);
            Assert.That(capturedTag.Name, Is.EqualTo("New Tag Name"));
        }
    }
}
