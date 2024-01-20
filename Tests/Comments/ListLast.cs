using Moq;
using Application.Comments;
using Domain;
using AutoMapper;
using Persistence;
using Microsoft.EntityFrameworkCore;
using Moq.EntityFrameworkCore;
using Application.Core;

namespace UnitTests.Comments
{
    [TestFixture]
    public class ListLastCommentsTests
    {
        private IMapper _mapper;
        private DataContext _context;
        private List<Comment> comments;
        private string _existingUsername;
        private string _existingUserId;

        [SetUp]
        public void SetUp()
        {
            var options = new DbContextOptionsBuilder<DataContext>()
                .UseInMemoryDatabase(databaseName: "TestDatabase")
                .Options;
            _context = new DataContext(options);

            var config = new MapperConfiguration(cfg =>
            {
                cfg.AddProfile(new MappingProfiles());
            });
            _mapper = config.CreateMapper();

            _existingUsername = "existingUser";
            _existingUserId = Guid.NewGuid().ToString();
            var user = new AppUser { Id = _existingUserId, UserName = _existingUsername, DisplayName = "displayname", PhotoUrl = "url" };
            comments = new List<Comment>
            {
                new Comment
                {
                    Id = Guid.NewGuid(),
                    Text = "Comment 1",
                    Date = new DateTime(2023, 12, 26),
                    AppUserId = _existingUserId
                },
                new Comment
                {
                    Id = Guid.NewGuid(),
                    Text = "Comment 2",
                    Date = new DateTime(2023, 12, 25),
                    AppUserId = _existingUserId
                },
                new Comment
                {
                    Id = Guid.NewGuid(),
                    Text = "Comment 3",
                    Date = new DateTime(2023, 12, 24),
                    AppUserId = _existingUserId
                },
                new Comment
                {
                    Id = Guid.NewGuid(),
                    Text = "Comment 4",
                    Date = new DateTime(2023, 12, 23),
                    AppUserId = _existingUserId
                },
                new Comment
                {
                    Id = Guid.NewGuid(),
                    Text = "Comment 5",
                    Date = new DateTime(2023, 12, 22),
                    AppUserId = _existingUserId
                },
                new Comment
                {
                    Id = Guid.NewGuid(),
                    Text = "Comment 6",
                    Date = new DateTime(2023, 12, 21),
                    AppUserId = _existingUserId
                },
                new Comment
                {
                    Id = Guid.NewGuid(),
                    Text = "Comment 7",
                    Date = new DateTime(2023, 12, 20),
                    AppUserId = _existingUserId
                },
                new Comment
                {
                    Id = Guid.NewGuid(),
                    Text = "Comment 8",
                    Date = new DateTime(2023, 12, 19),
                    AppUserId = _existingUserId
                },
                new Comment
                {
                    Id = Guid.NewGuid(),
                    Text = "Comment 9",
                    Date = new DateTime(2023, 12, 18),
                    AppUserId = _existingUserId
                },
                new Comment
                {
                    Id = Guid.NewGuid(),
                    Text = "Comment 10",
                    Date = new DateTime(2023, 12, 17),
                    AppUserId = _existingUserId
                },
                new Comment
                {
                    Id = Guid.NewGuid(),
                    Text = "Comment 11",
                    Date = new DateTime(2023, 12, 16),
                    AppUserId = _existingUserId
                },
                new Comment
                {
                    Id = Guid.NewGuid(),
                    Text = "Comment 12",
                    Date = new DateTime(2023, 12, 15),
                    AppUserId = _existingUserId
                },
                new Comment
                {
                    Id = Guid.NewGuid(),
                    Text = "Comment 13",
                    Date = new DateTime(2023, 12, 14),
                    AppUserId = _existingUserId
                },
                new Comment
                {
                    Id = Guid.NewGuid(),
                    Text = "Comment 14",
                    Date = new DateTime(2023, 12, 13),
                    AppUserId = _existingUserId
                }
            };

            _context.Users.AddRange(new List<AppUser> {user});
            _context.SaveChanges();

            _context.Comments.AddRange(comments);
            _context.SaveChanges();
        }

        [Test]
        public async Task Handler_UserExists_ReturnsLastComments()
        {
            var handler = new ListLast.Handler(_context, _mapper);
            var query = new ListLast.Querry { UserName = _existingUsername };

            var result = await handler.Handle(query, CancellationToken.None);

            Assert.IsNotNull(result);
            Assert.IsTrue(result.IsSuccess);
            Assert.That(result.Value.Count, Is.EqualTo(14));
            Assert.That(result.Value.Comments, Has.Count.EqualTo(12));
            Assert.That(result.Value.Comments.Any(r => r.Text == "Comment 1"));
            Assert.That(result.Value.Comments.Any(r => r.Text == "Comment 2"));
            Assert.That(result.Value.Comments.Any(r => r.Text == "Comment 3"));
            Assert.That(result.Value.Comments.Any(r => r.Text == "Comment 4"));
            Assert.That(result.Value.Comments.Any(r => r.Text == "Comment 5"));
            Assert.That(result.Value.Comments.Any(r => r.Text == "Comment 6"));
            Assert.That(result.Value.Comments.Any(r => r.Text == "Comment 7"));
            Assert.That(result.Value.Comments.Any(r => r.Text == "Comment 8"));
            Assert.That(result.Value.Comments.Any(r => r.Text == "Comment 9"));
            Assert.That(result.Value.Comments.Any(r => r.Text == "Comment 10"));
            Assert.That(result.Value.Comments.Any(r => r.Text == "Comment 11"));
            Assert.That(result.Value.Comments.Any(r => r.Text == "Comment 12"));
            
        }

        [Test]
        public async Task Handler_UserDoesNotExist_ReturnsNull()
        {
            var handler = new ListLast.Handler(_context, _mapper);
            var query = new ListLast.Querry { UserName = "nonexistentUser" };

            var result = await handler.Handle(query, CancellationToken.None);

            Assert.IsNull(result);
        }

        [TearDown]
        public void Cleanup()
        {
            _context.Database.EnsureDeleted();
            _context.Dispose();
        }
    }
}
