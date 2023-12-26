using Moq;
using Application.Recipes;
using Domain;
using Persistence;
using Application.Interfaces;
using Application.DTOs;
using Microsoft.EntityFrameworkCore;
using Moq.EntityFrameworkCore;

namespace UnitTests.Recipes
{
    [TestFixture]
    public class EditRecipeTests
    {
        private Mock<DataContext> _mockContext;
        private Mock<IUserAccessor> _mockUserAccessor;
        private Guid existingRecipeId;

        [SetUp]
        public void SetUp()
        {
            _mockContext = new Mock<DataContext>(new DbContextOptions<DataContext>());

            _mockUserAccessor = new Mock<IUserAccessor>();

            existingRecipeId = Guid.NewGuid();
            var existingRecipe = new Recipe { Id = existingRecipeId, Title = "Existing Recipe" };

            _mockContext
                .Setup(x => x.Recipes.FindAsync(existingRecipeId))
                .ReturnsAsync(existingRecipe);
            _mockContext
                .Setup(x => x.SaveChangesAsync(It.IsAny<CancellationToken>()))
                .ReturnsAsync(1);
        }

        [Test]
        public async Task Handle_RecipeDoesNotExist_ReturnsNull()
        {
            var handler = new Edit.Handler(_mockContext.Object, _mockUserAccessor.Object);
            var command = new Edit.Command
            {
                RecipeDetailsDTO = new RecipeDetailsDTO { Id = Guid.NewGuid(), }
            };

            var result = await handler.Handle(command, CancellationToken.None);

            Assert.IsNull(result);
        }

        [Test]
        public void RemoveExistingEntities_ExistingEntities_RemovesEntities()
        {
            var recipeId = Guid.NewGuid();
            var existingTags = new List<RecipeTags>
            {
                new RecipeTags { RecipeId = recipeId, TagId = Guid.NewGuid() },
            };

            var existingInstructions = new List<Instruction>
            {
                new Instruction { RecipeId = recipeId, Text = "Instrukcja 1" },
            };

            var existingIngredients = new List<Ingredient>
            {
                new Ingredient { RecipeId = recipeId, Name = "Składnik 1" },
            };

            _mockContext.Setup(x => x.RecipeTags).ReturnsDbSet(existingTags);
            _mockContext.Setup(x => x.Instructions).ReturnsDbSet(existingInstructions);
            _mockContext.Setup(x => x.Ingredients).ReturnsDbSet(existingIngredients);

            var handler = new Edit.Handler(_mockContext.Object, _mockUserAccessor.Object);

            handler.RemoveExistingEntities(recipeId);

            _mockContext.Verify(x => x.RecipeTags.RemoveRange(existingTags), Times.Once);
            _mockContext.Verify(x => x.Instructions.RemoveRange(existingInstructions), Times.Once);
            _mockContext.Verify(x => x.Ingredients.RemoveRange(existingIngredients), Times.Once);
        }

        [Test]
        public void AddNewEntities_NewEntities_AddsEntities()
        { 
            var capturedRecipeTags = new List<RecipeTags>();
            var capturedInstructions = new List<Instruction>();
            var capturedIngredients = new List<Ingredient>();

            _mockContext
                .Setup(x => x.RecipeTags.AddRange(It.IsAny<IEnumerable<RecipeTags>>()))
                .Callback((IEnumerable<RecipeTags> tags) => capturedRecipeTags.AddRange(tags));

            _mockContext
                .Setup(x => x.Instructions.AddRange(It.IsAny<IEnumerable<Instruction>>()))
                .Callback(
                    (IEnumerable<Instruction> instructions) =>
                        capturedInstructions.AddRange(instructions)
                );

            _mockContext
                .Setup(x => x.Ingredients.AddRange(It.IsAny<IEnumerable<Ingredient>>()))
                .Callback(
                    (IEnumerable<Ingredient> ingredients) =>
                        capturedIngredients.AddRange(ingredients)
                );

            var categoryId = Guid.NewGuid();
            var recipeId = Guid.NewGuid();

            var recipeDetails = new RecipeDetailsDTO
            {
                Id = recipeId,
                Title = "New Recipe",
                Date = DateTime.Now,
                Description = "Test Description",
                CategoryId = categoryId,
                Tags = new List<TagDTO> { new TagDTO { Id = Guid.NewGuid() } },
                Instructions = new List<InstructionDTO>
                {
                    new InstructionDTO
                    {
                        Id = Guid.NewGuid(),
                        Text = "Text 0",
                        Position = 0
                    },
                    new InstructionDTO
                    {
                        Id = Guid.NewGuid(),
                        Text = "Text 2",
                        Position = 2
                    },
                },
                Ingredients = new List<IngredientDTO>
                {
                    new IngredientDTO
                    {
                        Name = "Name 0",
                        Amount = 0.12,
                        Measurement = new MeasurementDTO { Id = Guid.NewGuid() }
                    }
                }
            };

            _mockContext
                .Setup(x => x.Categories.FindAsync(categoryId))
                .ReturnsAsync(new Category { Id = categoryId });

            var handler = new Edit.Handler(_mockContext.Object, _mockUserAccessor.Object);

            handler.AddNewEntities(recipeDetails);

            Assert.That(capturedInstructions.Count, Is.EqualTo(recipeDetails.Instructions.Count));
            Assert.That(capturedIngredients.Count, Is.EqualTo(recipeDetails.Ingredients.Count));

            foreach (var tag in recipeDetails.Tags)
            {
                Assert.IsTrue(
                    capturedRecipeTags.Any(t => t.TagId == tag.Id && t.RecipeId == recipeId)
                );
            }

            foreach (var instruction in recipeDetails.Instructions)
            {
                Assert.IsTrue(
                    capturedInstructions.Any(
                        i =>
                            i.Text == instruction.Text
                            && i.Position == instruction.Position
                            && i.RecipeId == recipeId
                    )
                );
            }

            foreach (var ingredient in recipeDetails.Ingredients)
            {
                Assert.IsTrue(
                    capturedIngredients.Any(
                        ing =>
                            ing.Name == ingredient.Name
                            && ing.Amount == ingredient.Amount
                            && ing.MeasurementId == ingredient.Measurement.Id
                            && ing.RecipeId == recipeId
                    )
                );
            }
        }
    }
}
