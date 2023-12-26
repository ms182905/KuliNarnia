using Moq;
using NUnit.Framework;
using System;
using System.Threading;
using System.Threading.Tasks;
using Application.Comments;
using Domain;
using Persistence;
using Application.Core;
using Microsoft.EntityFrameworkCore;
using Moq.EntityFrameworkCore;

namespace UnitTests.Comments
{
    [TestFixture]
    public class DeleteCommentTests
    {
        private Mock<DataContext> _mockContext;
        private Guid commentId;

        [SetUp]
        public void SetUp()
        {
            _mockContext = new Mock<DataContext>(new DbContextOptions<DataContext>());

            commentId = Guid.NewGuid();
            var comment = new Comment { Id = commentId, Text = "Test Comment" };
            
            _mockContext.Setup(x => x.Comments).ReturnsDbSet(new List<Comment>{comment});

            _mockContext.Setup(x => x.SaveChangesAsync(It.IsAny<CancellationToken>()))
                .ReturnsAsync(1);
        }

        [Test]
        public async Task Handler_CommentExists_DeletesComment()
        {
            var handler = new Delete.Handler(_mockContext.Object);
            var command = new Delete.Command { Id = commentId };

            var result = await handler.Handle(command, CancellationToken.None);

            Assert.IsNotNull(result);
            Assert.IsTrue(result.IsSuccess);
            _mockContext.Verify(x => x.Comments.Remove(It.IsAny<Comment>()), Times.Once);
            _mockContext.Verify(x => x.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);
        }

        [Test]
        public async Task Handler_CommentDoesNotExist_ReturnsNull()
        {
            var nonExistingCommentId = Guid.NewGuid();
            _mockContext.Setup(x => x.Comments.Find(nonExistingCommentId)).Returns(() => null);

            var handler = new Delete.Handler(_mockContext.Object);
            var command = new Delete.Command { Id = nonExistingCommentId };

            var result = await handler.Handle(command, CancellationToken.None);

            Assert.IsNull(result);
            _mockContext.Verify(x => x.Comments.Remove(It.IsAny<Comment>()), Times.Never);
            _mockContext.Verify(x => x.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Never);
        }
    }
}
