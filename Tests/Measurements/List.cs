using Moq;
using Domain;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Persistence;
using Moq.EntityFrameworkCore;
using Application.Core;

namespace UnitTests.Measurements
{
    [TestFixture]
    public class ListMeasurementsTests
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

            var measurements = Enumerable
                .Range(1, 4)
                .Select(i => new Measurement { Id = Guid.NewGuid(), Name = $"Measurement {i}" })
                .ToList();

            _mockContext.Setup(c => c.Measurements).ReturnsDbSet(measurements);
        }

        [Test]
        public async Task Handler_ReturnsMeasurements()
        {
            var handler = new Application.Measurements.List.Handler(_mockContext.Object, _mapper);
            var query = new Application.Measurements.List.Querry { };

            var result = await handler.Handle(
                new Application.Measurements.List.Querry { },
                CancellationToken.None
            );

            Assert.IsNotNull(result.Value);
            Assert.That(result.Value, Has.Count.EqualTo(4));
            Assert.That(result.Value.Any(t => t.Name == "Measurement 1"));
            Assert.That(result.Value.Any(t => t.Name == "Measurement 2"));
            Assert.That(result.Value.Any(t => t.Name == "Measurement 3"));
            Assert.That(result.Value.Any(t => t.Name == "Measurement 4"));
        }
    }
}
