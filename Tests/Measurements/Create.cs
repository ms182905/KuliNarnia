using Moq;
using Application.Measurements;
using Domain;
using Persistence;
using Application.DTOs;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;

namespace UnitTests.Measurements
{
    [TestFixture]
    public class CreateMeasurementTests
    {
        private Mock<DataContext> _mockContext;
        private Measurement? capturedMeasurement = null;

        [SetUp]
        public void SetUp()
        {
            _mockContext = new Mock<DataContext>(new DbContextOptions<DataContext>());

            _mockContext
                .Setup(
                    x =>
                        x.Measurements.AddAsync(
                            It.IsAny<Measurement>(),
                            It.IsAny<CancellationToken>()
                        )
                )
                .Callback(
                    (Measurement measurement, CancellationToken cancellationToken) =>
                    {
                        capturedMeasurement = measurement;
                    }
                )
                .Returns(() =>
                {
                    return new ValueTask<EntityEntry<Measurement>>();
                });

            _mockContext
                .Setup(x => x.SaveChangesAsync(It.IsAny<CancellationToken>()))
                .ReturnsAsync(1);
        }

        [Test]
        public async Task Handler_CreatesNewMeasurement()
        {
            var handler = new Create.Handler(_mockContext.Object);
            var command = new Create.Command
            {
                MeasurementDTO = new MeasurementDTO
                {
                    Id = Guid.NewGuid(),
                    Name = "New Measurement Name"
                }
            };

            var result = await handler.Handle(command, CancellationToken.None);

            Assert.IsNotNull(result);
            Assert.IsTrue(result.IsSuccess);
            _mockContext.Verify(
                x =>
                    x.Measurements.AddAsync(It.IsAny<Measurement>(), It.IsAny<CancellationToken>()),
                Times.Once
            );
            _mockContext.Verify(x => x.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);
            Assert.IsNotNull(capturedMeasurement);
            Assert.That(capturedMeasurement.Name, Is.EqualTo("New Measurement Name"));
        }
    }
}
