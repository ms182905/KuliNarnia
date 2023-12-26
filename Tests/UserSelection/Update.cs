using Moq;
using Application.UserSelection;
using Domain;
using Persistence;
using Application.Interfaces;
using Microsoft.EntityFrameworkCore;
using Moq.EntityFrameworkCore;
using Application.DTOs;
using Microsoft.EntityFrameworkCore.ChangeTracking;

namespace UnitTests.UserSelection
{
    [TestFixture]
    public class UpdateUserSelectionTests
    {
        private Mock<DataContext> _mockContext;
        private Mock<IUserAccessor> _mockUserAccessor;
        private string currentUsername;
        private List<UserSelectionStastic> stastics;

        [SetUp]
        public void SetUp()
        {
            _mockContext = new Mock<DataContext>(new DbContextOptions<DataContext>());
            _mockUserAccessor = new Mock<IUserAccessor>();

            currentUsername = "testuser";
            var user = new AppUser { Id = "userid", UserName = currentUsername };
            stastics = new List<UserSelectionStastic> { };

            _mockContext.Setup(x => x.Users).ReturnsDbSet(new List<AppUser> { user });
            _mockContext.Setup(x => x.UserSelectionStastics).ReturnsDbSet(stastics);
            _mockUserAccessor.Setup(x => x.GetUsername()).Returns(currentUsername);

            _mockContext
                .Setup(x => x.SaveChangesAsync(It.IsAny<CancellationToken>()))
                .ReturnsAsync(1);
        }

        [Test]
        public async Task Handler_UserDoesNotExist_ReturnsNull()
        {
            _mockUserAccessor.Setup(x => x.GetUsername()).Returns("nonexistentuser");

            var handler = new Application.UserSelection.Update.Handler(
                _mockContext.Object,
                _mockUserAccessor.Object
            );
            var command = new Update.Command
            {
                UserSelectionPoint = new UserSelectionPoint
                {
                    CategoryId = Guid.NewGuid(),
                    TagIds = new List<Guid> { Guid.NewGuid() }
                }
            };

            var result = await handler.Handle(command, CancellationToken.None);

            Assert.IsNull(result);
        }

        [Test]
        public async Task Handler_UserSelectionExists_IncrementsCounter()
        {
            var existingCategoryId = Guid.NewGuid();
            var existingTagId = Guid.NewGuid();
            var existingSelection = new UserSelectionStastic
            {
                UserId = "userid",
                CategoryId = existingCategoryId,
                TagId = existingTagId,
                Counter = 5
            };
            stastics.Add(existingSelection);

            _mockContext.Setup(x => x.UserSelectionStastics).ReturnsDbSet(stastics);

            var handler = new Application.UserSelection.Update.Handler(
                _mockContext.Object,
                _mockUserAccessor.Object
            );
            var command = new Update.Command
            {
                UserSelectionPoint = new UserSelectionPoint
                {
                    CategoryId = existingCategoryId,
                    TagIds = new List<Guid> { existingTagId }
                }
            };

            var result = await handler.Handle(command, CancellationToken.None);

            Assert.IsNotNull(result);
            Assert.IsTrue(result.IsSuccess);
            Assert.That(existingSelection.Counter, Is.EqualTo(6));
            _mockContext.Verify(x => x.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);
        }

        [Test]
        public async Task Handler_UserSelectionDoesNotExist_CreatesNewWithCounterOne()
        {
            var newCategoryId = Guid.NewGuid();
            var newTagId = Guid.NewGuid();
            UserSelectionStastic? capturedSelection = null;

            _mockContext
                .Setup(
                    x =>
                        x.UserSelectionStastics.AddAsync(
                            It.IsAny<UserSelectionStastic>(),
                            It.IsAny<CancellationToken>()
                        )
                )
                .Callback(
                    (UserSelectionStastic selection, CancellationToken ct) =>
                        capturedSelection = selection
                )
                .Returns(() =>
                {
                    return new ValueTask<EntityEntry<UserSelectionStastic>>();
                });

            var handler = new Application.UserSelection.Update.Handler(
                _mockContext.Object,
                _mockUserAccessor.Object
            );
            var command = new Update.Command
            {
                UserSelectionPoint = new UserSelectionPoint
                {
                    CategoryId = newCategoryId,
                    TagIds = new List<Guid> { newTagId }
                }
            };

            var result = await handler.Handle(command, CancellationToken.None);

            Assert.IsNotNull(result);
            Assert.IsTrue(result.IsSuccess);
            Assert.IsNotNull(capturedSelection);
            Assert.That(capturedSelection.CategoryId, Is.EqualTo(newCategoryId));
            Assert.That(capturedSelection.TagId, Is.EqualTo(newTagId));
            Assert.That(capturedSelection.Counter, Is.EqualTo(1));
            _mockContext.Verify(x => x.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);
        }
    }
}
