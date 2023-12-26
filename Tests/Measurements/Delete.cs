using Moq;
using Application.Measurements;
using Domain;
using Persistence;
using Microsoft.EntityFrameworkCore;
using Moq.EntityFrameworkCore;

namespace UnitTests.Measurements
{
    [TestFixture]
    public class DeleteMeasurementTests
    {
        private Mock<DataContext> _mockContext;
        private Guid measurementIdToDelete;
        private Guid unknownMeasurementId;
        private List<Ingredient> ingredients;

        [SetUp]
        public void SetUp()
        {
            _mockContext = new Mock<DataContext>(new DbContextOptions<DataContext>());

            measurementIdToDelete = Guid.NewGuid();
            unknownMeasurementId = Guid.NewGuid();
            var measurementToDelete = new Measurement
            {
                Id = measurementIdToDelete,
                Name = "Measurement to delete"
            };
            var unknownMeasurement = new Measurement
            {
                Id = unknownMeasurementId,
                Name = "Unknown"
            };
            var measurements = new List<Measurement> { measurementToDelete, unknownMeasurement };
            ingredients = new List<Ingredient>
            {
                new Ingredient { Id = Guid.NewGuid(), MeasurementId = measurementIdToDelete },
                new Ingredient { Id = Guid.NewGuid(), MeasurementId = measurementIdToDelete }
            };

            _mockContext.Setup(c => c.Measurements).ReturnsDbSet(measurements);
            _mockContext.Setup(c => c.Ingredients).ReturnsDbSet(ingredients);

            _mockContext
                .Setup(x => x.SaveChangesAsync(It.IsAny<CancellationToken>()))
                .ReturnsAsync(1);
        }

        [Test]
        public async Task Handler_MeasurementExists_DeletesMeasurement()
        {
            var handler = new Delete.Handler(_mockContext.Object);
            var command = new Delete.Command { MeasurementId = measurementIdToDelete };

            var result = await handler.Handle(command, CancellationToken.None);

            Assert.IsNotNull(result);
            Assert.IsTrue(result.IsSuccess);
            _mockContext.Verify(
                x => x.SaveChangesAsync(It.IsAny<CancellationToken>()),
                Times.AtLeastOnce
            );
            foreach (var ingredient in ingredients)
            {
                Assert.That(ingredient.MeasurementId, Is.EqualTo(unknownMeasurementId));
            }
        }

        [Test]
        public async Task Handler_MeasurementDoesNotExist_ReturnsNull()
        {
            var handler = new Delete.Handler(_mockContext.Object);
            var command = new Delete.Command { MeasurementId = Guid.NewGuid() };

            var result = await handler.Handle(command, CancellationToken.None);

            Assert.IsNull(result);
        }
    }
}
