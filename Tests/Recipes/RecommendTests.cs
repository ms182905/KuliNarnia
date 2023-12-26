using Moq;
using Application.Recipes;
using Application.DTOs;
using Persistence;
using Domain;
using AutoMapper;
using Application.Interfaces;
using Microsoft.EntityFrameworkCore;
using Moq.EntityFrameworkCore;

namespace UnitTests.Recipes
{
    [TestFixture]
    public class RecommendRecipesTests
    {
        private Mock<DataContext> _mockContext;
        private Mock<IMapper> _mockMapper;
        private Mock<IUserAccessor> _mockUserAccessor;

        [SetUp]
        public void Setup()
        {
            var users = new List<AppUser> { new() { Id = "appuser" } };
            var stats = new List<UserSelectionStastic>();

            _mockContext = new Mock<DataContext>(new DbContextOptions<DataContext>());
            _mockContext.Setup(c => c.Users).ReturnsDbSet(users);
            _mockContext.Setup(c => c.UserSelectionStastics).ReturnsDbSet(stats);

            _mockMapper = new Mock<IMapper>();
            _mockUserAccessor = new Mock<IUserAccessor>();
        }

        [Test]
        public async Task Handler_UserNotFound_ReturnsNull()
        {
            var handler = new Recomend.Handler(
                _mockContext.Object,
                _mockMapper.Object,
                _mockUserAccessor.Object
            );
            _mockUserAccessor.Setup(x => x.GetUsername()).Returns("username");

            var result = await handler.Handle(new Recomend.Querry(), new CancellationToken());

            Assert.Null(result);
        }

        [Test]
        public async Task GetRecommendedRecipes_ReturnsExpectedRecipeList()
        {
            var userId = "appuser";
            var user = new AppUser { Id = userId };

            var categories = Enumerable
                .Range(1, 3)
                .Select(i => new Category { Id = Guid.NewGuid(), Name = $"Kategoria {i}" })
                .ToList();

            var tags = Enumerable
                .Range(1, 4)
                .Select(i => new Tag { Id = Guid.NewGuid(), Name = $"Tag {i}" })
                .ToList();

            var recipe1 = new RecipeDetailsDTO
            {
                Title = "r1",
                Id = Guid.NewGuid(),
                CategoryId = categories[0].Id,
                Tags = new List<TagDTO>
                {
                    new TagDTO { Id = tags[0].Id },
                    new TagDTO { Id = tags[1].Id },
                    new TagDTO { Id = tags[2].Id }
                }
            };
            var recipe2 = new RecipeDetailsDTO
            {
                Title = "r2",
                Id = Guid.NewGuid(),
                CategoryId = categories[1].Id,
                Tags = new List<TagDTO>
                {
                    new TagDTO { Id = tags[1].Id },
                    new TagDTO { Id = tags[2].Id }
                }
            };
            var recipe3 = new RecipeDetailsDTO
            {
                Title = "r3",
                Id = Guid.NewGuid(),
                CategoryId = categories[0].Id,
                Tags = new List<TagDTO>
                {
                    new TagDTO { Id = tags[0].Id },
                    new TagDTO { Id = tags[1].Id },
                    new TagDTO { Id = tags[3].Id }
                }
            };
            var recipe4 = new RecipeDetailsDTO
            {
                Title = "r4",
                Id = Guid.NewGuid(),
                CategoryId = categories[2].Id,
                Tags = new List<TagDTO>
                {
                    new TagDTO { Id = tags[1].Id },
                    new TagDTO { Id = tags[2].Id }
                }
            };
            var recipe5 = new RecipeDetailsDTO
            {
                Title = "r5",
                Id = Guid.NewGuid(),
                CategoryId = categories[2].Id,
                Tags = new List<TagDTO> { new TagDTO { Id = tags[3].Id } }
            };
            var recipe6 = new RecipeDetailsDTO
            {
                Title = "r6",
                Id = Guid.NewGuid(),
                CategoryId = categories[1].Id,
                Tags = new List<TagDTO>
                {
                    new TagDTO { Id = tags[1].Id },
                    new TagDTO { Id = tags[2].Id },
                    new TagDTO { Id = tags[3].Id }
                }
            };
            var recipe7 = new RecipeDetailsDTO
            {
                Title = "r7",
                Id = Guid.NewGuid(),
                CategoryId = categories[1].Id,
                Tags = new List<TagDTO>
                {
                    new TagDTO { Id = tags[0].Id },
                    new TagDTO { Id = tags[1].Id },
                    new TagDTO { Id = tags[2].Id },
                    new TagDTO { Id = tags[3].Id }
                }
            };
            var recipe8 = new RecipeDetailsDTO
            {
                Title = "r8",
                Id = Guid.NewGuid(),
                CategoryId = categories[1].Id,
                Tags = new List<TagDTO> { new TagDTO { Id = tags[1].Id } }
            };
            var recipe9 = new RecipeDetailsDTO
            {
                Title = "r9",
                Id = Guid.NewGuid(),
                CategoryId = categories[0].Id,
                Tags = new List<TagDTO>
                {
                    new TagDTO { Id = tags[2].Id },
                    new TagDTO { Id = tags[3].Id }
                }
            };
            var recipe10 = new RecipeDetailsDTO
            {
                Title = "r10",
                Id = Guid.NewGuid(),
                CategoryId = categories[1].Id,
                Tags = new List<TagDTO> { new TagDTO { Id = tags[2].Id } }
            };

            var recipes = new List<RecipeDetailsDTO>
            {
                recipe1, // 0.92
                recipe2, // 0,14
                recipe3, // 0,92
                recipe4, // 0,22
                recipe5, // 0,08
                recipe6, // 0,14
                recipe7, // 0,5
                recipe8, // 0,14
                recipe9, // 0,42
                recipe10 // 0
            };

            var userSelectionStastics = new List<UserSelectionStastic>
            {
                new UserSelectionStastic
                {
                    UserId = userId,
                    TagId = tags[0].Id,
                    CategoryId = categories[0].Id,
                    Counter = 10
                },
                new UserSelectionStastic
                {
                    UserId = userId,
                    TagId = tags[1].Id,
                    CategoryId = categories[0].Id,
                    Counter = 5
                },
                new UserSelectionStastic
                {
                    UserId = userId,
                    TagId = tags[0].Id,
                    CategoryId = categories[2].Id,
                    Counter = 3
                },
            };

            _mockContext.Setup(c => c.UserSelectionStastics).ReturnsDbSet(userSelectionStastics);

            var handler = new Recomend.Handler(
                _mockContext.Object,
                _mockMapper.Object,
                _mockUserAccessor.Object
            );

            var recommendedRecipes = await handler.getRecommendedRecipes(recipes, userId);

            Assert.IsNotNull(recommendedRecipes);
            Assert.That(recommendedRecipes, Has.Count.EqualTo(7));

            Assert.Contains(recipe1, recommendedRecipes);
            Assert.Contains(recipe3, recommendedRecipes);
            Assert.Contains(recipe7, recommendedRecipes);
            Assert.Contains(recipe9, recommendedRecipes);
            Assert.Contains(recipe4, recommendedRecipes);
            Assert.Contains(recipe2, recommendedRecipes);
            Assert.Contains(recipe6, recommendedRecipes);
        }

        [Test]
        public async Task GetRecommendedRecipes_NoStatistics_ReturnsEmptyRecipeList()
        {
            var userId = "appuser";
            var user = new AppUser { Id = userId };

            var categories = Enumerable
                .Range(1, 3)
                .Select(i => new Category { Id = Guid.NewGuid(), Name = $"Kategoria {i}" })
                .ToList();

            var tags = Enumerable
                .Range(1, 4)
                .Select(i => new Tag { Id = Guid.NewGuid(), Name = $"Tag {i}" })
                .ToList();

            var recipes = new List<RecipeDetailsDTO>
            {
                new RecipeDetailsDTO
                {
                    Title = "r1",
                    Id = Guid.NewGuid(),
                    CategoryId = categories[0].Id,
                    Tags = new List<TagDTO>
                    {
                        new TagDTO { Id = tags[0].Id },
                        new TagDTO { Id = tags[1].Id },
                        new TagDTO { Id = tags[2].Id }
                    }
                },
                new RecipeDetailsDTO
                {
                    Title = "r2",
                    Id = Guid.NewGuid(),
                    CategoryId = categories[1].Id,
                    Tags = new List<TagDTO>
                    {
                        new TagDTO { Id = tags[1].Id },
                        new TagDTO { Id = tags[2].Id }
                    }
                },
                new RecipeDetailsDTO
                {
                    Title = "r3",
                    Id = Guid.NewGuid(),
                    CategoryId = categories[0].Id,
                    Tags = new List<TagDTO>
                    {
                        new TagDTO { Id = tags[0].Id },
                        new TagDTO { Id = tags[1].Id },
                        new TagDTO { Id = tags[3].Id }
                    }
                },
                new RecipeDetailsDTO
                {
                    Title = "r4",
                    Id = Guid.NewGuid(),
                    CategoryId = categories[2].Id,
                    Tags = new List<TagDTO>
                    {
                        new TagDTO { Id = tags[1].Id },
                        new TagDTO { Id = tags[2].Id }
                    }
                },
                new RecipeDetailsDTO
                {
                    Title = "r5",
                    Id = Guid.NewGuid(),
                    CategoryId = categories[2].Id,
                    Tags = new List<TagDTO> { new TagDTO { Id = tags[3].Id } }
                },
                new RecipeDetailsDTO
                {
                    Title = "r6",
                    Id = Guid.NewGuid(),
                    CategoryId = categories[1].Id,
                    Tags = new List<TagDTO>
                    {
                        new TagDTO { Id = tags[1].Id },
                        new TagDTO { Id = tags[2].Id },
                        new TagDTO { Id = tags[3].Id }
                    }
                }
            };

            var userSelectionStastics = new List<UserSelectionStastic> { };

            _mockContext.Setup(c => c.UserSelectionStastics).ReturnsDbSet(userSelectionStastics);

            var handler = new Recomend.Handler(
                _mockContext.Object,
                _mockMapper.Object,
                _mockUserAccessor.Object
            );

            var recommendedRecipes = await handler.getRecommendedRecipes(recipes, userId);

            Assert.IsNotNull(recommendedRecipes);
            Assert.That(recommendedRecipes, Has.Count.EqualTo(0));
        }

        [Test]
        public async Task GetRecommendedRecipes_ReturnsRecipesWithValueGreaterThanZero()
        {
            var userId = "appuser";
            var user = new AppUser { Id = userId };

            var categories = Enumerable
                .Range(1, 3)
                .Select(i => new Category { Id = Guid.NewGuid(), Name = $"Kategoria {i}" })
                .ToList();

            var tags = Enumerable
                .Range(1, 4)
                .Select(i => new Tag { Id = Guid.NewGuid(), Name = $"Tag {i}" })
                .ToList();

            var recipe1 = new RecipeDetailsDTO
            {
                Title = "r1",
                Id = Guid.NewGuid(),
                CategoryId = categories[0].Id,
                Tags = new List<TagDTO>
                {
                    new TagDTO { Id = tags[0].Id },
                    new TagDTO { Id = tags[1].Id },
                    new TagDTO { Id = tags[2].Id }
                }
            };
            var recipe2 = new RecipeDetailsDTO
            {
                Title = "r2",
                Id = Guid.NewGuid(),
                CategoryId = categories[1].Id,
                Tags = new List<TagDTO>
                {
                    new TagDTO { Id = tags[1].Id },
                    new TagDTO { Id = tags[2].Id }
                }
            };
            var recipe3 = new RecipeDetailsDTO
            {
                Title = "r3",
                Id = Guid.NewGuid(),
                CategoryId = categories[0].Id,
                Tags = new List<TagDTO>
                {
                    new TagDTO { Id = tags[0].Id },
                    new TagDTO { Id = tags[1].Id },
                    new TagDTO { Id = tags[3].Id }
                }
            };
            var recipe4 = new RecipeDetailsDTO
            {
                Title = "r4",
                Id = Guid.NewGuid(),
                CategoryId = categories[2].Id,
                Tags = new List<TagDTO>
                {
                    new TagDTO { Id = tags[1].Id },
                    new TagDTO { Id = tags[2].Id }
                }
            };
            var recipe5 = new RecipeDetailsDTO
            {
                Title = "r5",
                Id = Guid.NewGuid(),
                CategoryId = categories[1].Id,
                Tags = new List<TagDTO> { new TagDTO { Id = tags[2].Id } }
            };
            var recipe6 = new RecipeDetailsDTO
            {
                Title = "r6",
                Id = Guid.NewGuid(),
                CategoryId = categories[1].Id,
                Tags = new List<TagDTO> { new TagDTO { Id = tags[2].Id } }
            };
            var recipe7 = new RecipeDetailsDTO
            {
                Title = "r7",
                Id = Guid.NewGuid(),
                CategoryId = categories[1].Id,
                Tags = new List<TagDTO> { new TagDTO { Id = tags[2].Id } }
            };
            var recipe8 = new RecipeDetailsDTO
            {
                Title = "r8",
                Id = Guid.NewGuid(),
                CategoryId = categories[1].Id,
                Tags = new List<TagDTO> { new TagDTO { Id = tags[2].Id } }
            };
            var recipe9 = new RecipeDetailsDTO
            {
                Title = "r9",
                Id = Guid.NewGuid(),
                CategoryId = categories[1].Id,
                Tags = new List<TagDTO> { new TagDTO { Id = tags[2].Id } }
            };
            var recipe10 = new RecipeDetailsDTO
            {
                Title = "r10",
                Id = Guid.NewGuid(),
                CategoryId = categories[1].Id,
                Tags = new List<TagDTO> { new TagDTO { Id = tags[2].Id } }
            };

            var recipes = new List<RecipeDetailsDTO>
            {
                recipe1, // 0.92
                recipe2, // 0,14
                recipe3, // 0,92
                recipe4, // 0,22
                recipe5, // 0
                recipe6, // 0
                recipe7, // 0
                recipe8, // 0
                recipe9, // 0
                recipe10 // 0
            };

            var userSelectionStastics = new List<UserSelectionStastic>
            {
                new UserSelectionStastic
                {
                    UserId = userId,
                    TagId = tags[0].Id,
                    CategoryId = categories[0].Id,
                    Counter = 10
                },
                new UserSelectionStastic
                {
                    UserId = userId,
                    TagId = tags[1].Id,
                    CategoryId = categories[0].Id,
                    Counter = 5
                },
                new UserSelectionStastic
                {
                    UserId = userId,
                    TagId = tags[0].Id,
                    CategoryId = categories[2].Id,
                    Counter = 3
                },
            };

            _mockContext.Setup(c => c.UserSelectionStastics).ReturnsDbSet(userSelectionStastics);

            var handler = new Recomend.Handler(
                _mockContext.Object,
                _mockMapper.Object,
                _mockUserAccessor.Object
            );

            var recommendedRecipes = await handler.getRecommendedRecipes(recipes, userId);

            Assert.IsNotNull(recommendedRecipes);
            Assert.That(recommendedRecipes, Has.Count.EqualTo(4));

            Assert.Contains(recipe1, recommendedRecipes);
            Assert.Contains(recipe3, recommendedRecipes);
            Assert.Contains(recipe4, recommendedRecipes);
            Assert.Contains(recipe2, recommendedRecipes);
        }
    }
}
