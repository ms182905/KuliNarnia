using Moq;
using Domain;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Persistence;
using Moq.EntityFrameworkCore;
using Application.Core;

namespace UnitTests.Categories
{
    [TestFixture]
    public class ListCategoriesTests
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

            var categories = Enumerable
                .Range(1, 4)
                .Select(i => new Category { Id = Guid.NewGuid(), Name = $"Category {i}" })
                .ToList();

            _mockContext.Setup(c => c.Categories).ReturnsDbSet(categories);
        }

        [Test]
        public async Task Handler_ReturnsCategories()
        {
            var handler = new Application.Categories.List.Handler(_mockContext.Object, _mapper);
            var query = new Application.Categories.List.Querry { };

            var result = await handler.Handle(
                new Application.Categories.List.Querry { },
                CancellationToken.None
            );

            Assert.IsNotNull(result.Value);
            Assert.That(result.Value, Has.Count.EqualTo(4));
            Assert.That(result.Value.Any(t => t.Name == "Category 1"));
            Assert.That(result.Value.Any(t => t.Name == "Category 2"));
            Assert.That(result.Value.Any(t => t.Name == "Category 3"));
            Assert.That(result.Value.Any(t => t.Name == "Category 4"));
        }
    }
}
