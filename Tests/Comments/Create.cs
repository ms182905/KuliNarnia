using Moq;
using NUnit.Framework;
using System;
using System.Threading;
using System.Threading.Tasks;
using Application.Comments;
using Domain;
using Persistence;
using Application.Interfaces;
using Microsoft.EntityFrameworkCore;
using Application.DTOs;
using Moq.EntityFrameworkCore;

namespace UnitTests.Comments
{
    [TestFixture]
    public class CreateCommentTests
    {
        private Mock<DataContext> _mockContext;
        private Mock<IUserAccessor> _mockUserAccessor;
        private string existingUsername;
        private string existingUserId;
        private string nonExistingUsername;

        [SetUp]
        public void SetUp()
        {
            _mockContext = new Mock<DataContext>(new DbContextOptions<DataContext>());
            _mockUserAccessor = new Mock<IUserAccessor>();

            existingUsername = "existingUser";
            nonExistingUsername = "nonExistingUser";
            existingUserId = Guid.NewGuid().ToString();
            var user = new AppUser { Id = existingUserId, UserName = existingUsername };

            _mockContext.Setup(x => x.Users).ReturnsDbSet(new List<AppUser> { user });
            _mockContext.Setup(x => x.Comments).ReturnsDbSet(new List<Comment> { });

            // Symulacja zapisywania zmian
            _mockContext
                .Setup(x => x.SaveChangesAsync(It.IsAny<CancellationToken>()))
                .ReturnsAsync(1);
        }

        [Test]
        public async Task Handler_ExistingUser_CreatesComment()
        {
            Comment? capturedComment = null;
            _mockUserAccessor.Setup(x => x.GetUsername()).Returns(existingUsername);

            _mockContext
                .Setup(x => x.Comments.Add(It.IsAny<Comment>()))
                .Callback<Comment>(comment => capturedComment = comment);

            var handler = new Application.Comments.Create.Handler(
                _mockContext.Object,
                _mockUserAccessor.Object
            );
            var expectedCommentId = Guid.NewGuid();
            var expectedRecipeId = Guid.NewGuid();
            var expectedText = "Test comment";
            var command = new Create.Command
            {
                CommentDTO = new CommentDTO
                {
                    Id = expectedCommentId,
                    Text = expectedText,
                    Date = DateTime.Now,
                    RecipeId = expectedRecipeId
                }
            };

            var result = await handler.Handle(command, CancellationToken.None);

            Assert.IsNotNull(result);
            Assert.IsTrue(result.IsSuccess);
            Assert.IsNotNull(capturedComment);
            Assert.That(capturedComment.Id, Is.EqualTo(expectedCommentId));
            Assert.That(capturedComment.Text, Is.EqualTo(expectedText));
            Assert.That(capturedComment.RecipeId, Is.EqualTo(expectedRecipeId));
            Assert.That(capturedComment.AppUserId, Is.EqualTo(existingUserId)); // Możesz potrzebować dostępu do UserId zamiast UserName
            _mockContext.Verify(x => x.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);
        }

        [Test]
        public async Task Handler_NonExistingUser_ReturnsNull()
        {
            _mockUserAccessor.Setup(x => x.GetUsername()).Returns(nonExistingUsername);

            var handler = new Application.Comments.Create.Handler(
                _mockContext.Object,
                _mockUserAccessor.Object
            );
            var command = new Create.Command
            {
                CommentDTO = new CommentDTO
                {
                    Id = Guid.NewGuid(),
                    Text = "Test comment",
                    Date = DateTime.Now,
                    RecipeId = Guid.NewGuid()
                }
            };

            var result = await handler.Handle(command, CancellationToken.None);

            Assert.IsNull(result);
        }

        // Tutaj możesz dodać dodatkowe testy na różne scenariusze
    }
}
