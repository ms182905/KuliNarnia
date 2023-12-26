using Moq;
using Domain;
using Persistence;
using Application.DTOs;
using Microsoft.EntityFrameworkCore;
using Application.Measurements;

namespace UnitTests.Measurements
{
    [TestFixture]
    public class EditMeasurementTests
    {
        private Mock<DataContext> _mockContext;
        private Guid measurementId;
        private Measurement existingMeasurement;

        [SetUp]
        public void SetUp()
        {
            _mockContext = new Mock<DataContext>(new DbContextOptions<DataContext>());

            measurementId = Guid.NewGuid();
            existingMeasurement = new Measurement
            {
                Id = measurementId,
                Name = "Old Measurement Name"
            };

            _mockContext
                .Setup(x => x.Measurements.FindAsync(measurementId))
                .ReturnsAsync(existingMeasurement);

            _mockContext
                .Setup(x => x.SaveChangesAsync(It.IsAny<CancellationToken>()))
                .ReturnsAsync(1);
        }

        [Test]
        public async Task Handler_WhenMeasurementExists_UpdatesMeasurement()
        {
            var handler = new Edit.Handler(_mockContext.Object);
            var command = new Edit.Command
            {
                MeasurementId = measurementId,
                MeasurementDTO = new MeasurementDTO { Name = "New Measurement Name" }
            };

            var result = await handler.Handle(command, CancellationToken.None);

            Assert.IsNotNull(result);
            Assert.IsTrue(result.IsSuccess);
            _mockContext.Verify(x => x.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);
            Assert.That(existingMeasurement.Name, Is.EqualTo("New Measurement Name"));
        }

        [Test]
        public async Task Handler_WhenMeasurementDoesNotExist_ReturnsNull()
        {
            var handler = new Edit.Handler(_mockContext.Object);
            var command = new Edit.Command
            {
                MeasurementId = Guid.NewGuid(),
                MeasurementDTO = new MeasurementDTO { Name = "New Measurement Name" }
            };

            _mockContext
                .Setup(x => x.Measurements.FindAsync(measurementId))
                .ReturnsAsync(() => null);

            var result = await handler.Handle(command, CancellationToken.None);

            Assert.IsNull(result);
        }
    }
}
