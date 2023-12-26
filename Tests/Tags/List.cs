using Moq;
using Domain;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Persistence;
using Moq.EntityFrameworkCore;
using Application.Core;

namespace UnitTests.Tags
{
    [TestFixture]
    public class ListTagsTests
    {
        private Mock<DataContext> _mockContext;

        private IMapper _mapper;

        [SetUp]
        public void Setup()
        {
            _mockContext = new Mock<DataContext>(new DbContextOptions<DataContext>());

            var config = new MapperConfiguration(cfg =>
            {
                cfg.AddProfile(new MappingProfiles());
            });
            _mapper = config.CreateMapper();

            var tags = Enumerable
                .Range(1, 4)
                .Select(i => new Tag { Id = Guid.NewGuid(), Name = $"Tag {i}" })
                .ToList();

            _mockContext.Setup(c => c.Tags).ReturnsDbSet(tags);
        }

        [Test]
        public async Task Handler_ReturnsTags()
        {
            var handler = new Application.Tags.List.Handler(_mockContext.Object, _mapper);
            var query = new Application.Tags.List.Querry { };

            var result = await handler.Handle(
                new Application.Tags.List.Querry { },
                CancellationToken.None
            );

            Assert.IsNotNull(result.Value);
            Assert.That(result.Value, Has.Count.EqualTo(4));
            Assert.That(result.Value.Any(t => t.Name == "Tag 1"));
            Assert.That(result.Value.Any(t => t.Name == "Tag 2"));
            Assert.That(result.Value.Any(t => t.Name == "Tag 3"));
            Assert.That(result.Value.Any(t => t.Name == "Tag 4"));
        }
    }
}
