using Moq;
using Application.Recipes;
using Domain;
using Persistence;
using Application.DTOs;
using Application.Interfaces;
using Microsoft.EntityFrameworkCore;
using Moq.EntityFrameworkCore;

namespace UnitTests.Recipes
{
    [TestFixture]
    public class CreateRecipeTests
    {
        private Mock<DataContext> _mockContext;
        private Mock<IUserAccessor> _mockUserAccessor;
        private string currentUsername;
        private Guid categoryId;

        [SetUp]
        public void SetUp()
        {
            _mockContext = new Mock<DataContext>(new DbContextOptions<DataContext>());
            _mockUserAccessor = new Mock<IUserAccessor>();

            currentUsername = "testuser";
            var user = new AppUser { Id = "userid", UserName = currentUsername };

            categoryId = Guid.NewGuid();
            var category = new Category { Id = categoryId };

            _mockContext.Setup(x => x.Categories).ReturnsDbSet(new List<Category> { category });

            _mockContext.Setup(x => x.Users).ReturnsDbSet(new List<AppUser> { user });

            _mockContext
                .Setup(x => x.SaveChangesAsync(It.IsAny<CancellationToken>()))
                .ReturnsAsync(1);

            _mockUserAccessor.Setup(x => x.GetUsername()).Returns(currentUsername);
        }

        [Test]
        public async Task Handler_ValidRecipe_CreatesRecipe()
        {
            Recipe? capturedRecipe = null;
            var capturedRecipeTags = new List<RecipeTags>();
            var capturedInstructions = new List<Instruction>();
            var capturedIngredients = new List<Ingredient>();

            _mockContext
                .Setup(x => x.Recipes.Add(It.IsAny<Recipe>()))
                .Callback<Recipe>(recipe => capturedRecipe = recipe);

            _mockContext
                .Setup(
                    x =>
                        x.RecipeTags.AddRangeAsync(
                            It.IsAny<IEnumerable<RecipeTags>>(),
                            It.IsAny<CancellationToken>()
                        )
                )
                .Callback(
                    (IEnumerable<RecipeTags> tags, CancellationToken ct) =>
                        capturedRecipeTags.AddRange(tags)
                )
                .Returns(Task.CompletedTask);

            _mockContext
                .Setup(
                    x =>
                        x.Instructions.AddRangeAsync(
                            It.IsAny<IEnumerable<Instruction>>(),
                            It.IsAny<CancellationToken>()
                        )
                )
                .Callback(
                    (IEnumerable<Instruction> instructions, CancellationToken ct) =>
                        capturedInstructions.AddRange(instructions)
                )
                .Returns(Task.CompletedTask);

            _mockContext
                .Setup(
                    x =>
                        x.Ingredients.AddRangeAsync(
                            It.IsAny<IEnumerable<Ingredient>>(),
                            It.IsAny<CancellationToken>()
                        )
                )
                .Callback(
                    (IEnumerable<Ingredient> ingredients, CancellationToken ct) =>
                        capturedIngredients.AddRange(ingredients)
                )
                .Returns(Task.CompletedTask);

            var handler = new Create.Handler(_mockContext.Object, _mockUserAccessor.Object);
            var categoryId = Guid.NewGuid();
            var recipeId = Guid.NewGuid();

            var command = new Create.Command
            {
                RecipeDetailsDTO = new RecipeDetailsDTO
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
                }
            };

            _mockContext
                .Setup(x => x.Categories.FindAsync(categoryId))
                .ReturnsAsync(new Category { Id = categoryId });

            var result = await handler.Handle(command, CancellationToken.None);

            Assert.IsNotNull(result);
            Assert.IsTrue(result.IsSuccess);

            Assert.IsNotNull(capturedRecipe);
            Assert.That(capturedRecipe.Id, Is.EqualTo(command.RecipeDetailsDTO.Id));
            Assert.That(capturedRecipe.Title, Is.EqualTo(command.RecipeDetailsDTO.Title));
            Assert.That(
                capturedRecipe.Description,
                Is.EqualTo(command.RecipeDetailsDTO.Description)
            );
            Assert.That(capturedRecipe.CategoryId, Is.EqualTo(command.RecipeDetailsDTO.CategoryId));

            Assert.That(capturedRecipeTags.Count, Is.EqualTo(command.RecipeDetailsDTO.Tags.Count));
            Assert.That(
                capturedInstructions.Count,
                Is.EqualTo(command.RecipeDetailsDTO.Instructions.Count)
            );
            Assert.That(
                capturedIngredients.Count,
                Is.EqualTo(command.RecipeDetailsDTO.Ingredients.Count)
            );

            foreach (var tag in command.RecipeDetailsDTO.Tags)
            {
                Assert.IsTrue(
                    capturedRecipeTags.Any(t => t.TagId == tag.Id && t.RecipeId == recipeId)
                );
            }

            foreach (var instruction in command.RecipeDetailsDTO.Instructions)
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

            foreach (var ingredient in command.RecipeDetailsDTO.Ingredients)
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

            _mockContext.Verify(
                x => x.SaveChangesAsync(It.IsAny<CancellationToken>()),
                Times.AtLeastOnce
            );
        }

        [Test]
        public async Task Handler_CategoryNotFound_ReturnsFailure()
        {
            var handler = new Create.Handler(_mockContext.Object, _mockUserAccessor.Object);
            var recipeId = Guid.NewGuid();

            var command = new Create.Command
            {
                RecipeDetailsDTO = new RecipeDetailsDTO
                {
                    Id = recipeId,
                    Title = "New Recipe",
                    Date = DateTime.Now,
                    Description = "Test Description",
                    CategoryId = Guid.NewGuid(),
                    Tags = new List<TagDTO>(),
                    Instructions = new List<InstructionDTO>(),
                    Ingredients = new List<IngredientDTO>()
                }
            };

            var result = await handler.Handle(command, CancellationToken.None);

            Assert.IsNotNull(result);
            Assert.IsFalse(result.IsSuccess);
            Assert.That(result.Error, Is.EqualTo("Category not found"));
        }
    }
}
