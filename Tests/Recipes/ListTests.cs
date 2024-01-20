// using Moq;
// using Domain;
// using AutoMapper;
// using Microsoft.EntityFrameworkCore;
// using Persistence;
// using Moq.EntityFrameworkCore;
// using Application.Core;

// namespace UnitTests.Recipes
// {
//     [TestFixture]
//     public class ListRecipesTests
//     {
//         private Mock<DataContext> _mockContext;
//         private IMapper _mapper;
//         private List<Category> categories;
//         private List<Tag> tags;

//         [SetUp]
//         public void Setup()
//         {
//             _mockContext = new Mock<DataContext>(new DbContextOptions<DataContext>());

//             var config = new MapperConfiguration(cfg =>
//             {
//                 cfg.AddProfile(new MappingProfiles());
//             });
//             _mapper = config.CreateMapper();

//             categories = new List<Category>
//             {
//                 new Category { Id = Guid.NewGuid(), Name = "Kategoria 1" },
//                 new Category { Id = Guid.NewGuid(), Name = "Kategoria 2" }
//             };

//             tags = new List<Tag>
//             {
//                 new Tag { Id = Guid.NewGuid(), Name = "Tag 1" },
//                 new Tag { Id = Guid.NewGuid(), Name = "Tag 2" }
//             };

//             var recipes = Enumerable
//                 .Range(1, 20)
//                 .Select(
//                     i =>
//                         new Recipe
//                         {
//                             Id = Guid.NewGuid(),
//                             Title = "Przepis " + (i % 5 == 0 ? "Specjalny " : "") + i,
//                             CategoryId = categories[i % categories.Count].Id,
//                             Date = DateTime.Now.AddDays(-i),
//                             Ingredients = new List<Ingredient>
//                             {
//                                 new Ingredient { Name = "Składnik" }
//                             },
//                             RecipeTags = new List<RecipeTags>
//                             {
//                                 new RecipeTags { TagId = tags[i % tags.Count].Id }
//                             }
//                         }
//                 )
//                 .AsQueryable();

//             _mockContext.Setup(c => c.Recipes).ReturnsDbSet(recipes);
//         }

//         [Test]
//         public async Task Handler_ReturnsNumberOfRecipes()
//         {
//             var handler = new Application.Recipes.List.Handler(_mockContext.Object, _mapper);
//             var query = new Application.Recipes.List.Querry
//             {
//                 From = 2,
//                 To = 5,
//                 CategoryFilter = "",
//                 TagsFilter = "",
//                 SearchQuerry = ""
//             };

//             var result = await handler.Handle(query, CancellationToken.None);

//             Assert.IsNotNull(result.Value);
//             Assert.That(result.Value.Count, Is.EqualTo(20));
//             Assert.That(result.Value.Recipes, Has.Count.EqualTo(3));
//             Assert.That(result.Value.Recipes.Any(r => r.Title == "Przepis 3"));
//             Assert.That(result.Value.Recipes.Any(r => r.Title == "Przepis 4"));
//             Assert.That(result.Value.Recipes.Any(r => r.Title == "Przepis Specjalny 5"));
//         }

//         [Test]
//         public async Task Handler_ReturnsRecipesFilteredByPhrase()
//         {
//             var handler = new Application.Recipes.List.Handler(_mockContext.Object, _mapper);
//             var query = new Application.Recipes.List.Querry
//             {
//                 From = 0,
//                 To = 7,
//                 CategoryFilter = "",
//                 TagsFilter = "",
//                 SearchQuerry = "Specjalny"
//             };

//             var result = await handler.Handle(query, CancellationToken.None);

//             Assert.IsNotNull(result.Value);
//             Assert.That(result.Value.Count, Is.EqualTo(4));
//             Assert.That(result.Value.Recipes, Has.Count.EqualTo(4));
//             Assert.That(result.Value.Recipes.Any(r => r.Title == "Przepis Specjalny 5"));
//             Assert.That(result.Value.Recipes.Any(r => r.Title == "Przepis Specjalny 10"));
//             Assert.That(result.Value.Recipes.Any(r => r.Title == "Przepis Specjalny 15"));
//             Assert.That(result.Value.Recipes.Any(r => r.Title == "Przepis Specjalny 20"));
//         }

//         [Test]
//         public async Task Handler_ReturnsRecipesFilteredByCategory()
//         {
//             var handler = new Application.Recipes.List.Handler(_mockContext.Object, _mapper);
//             var query = new Application.Recipes.List.Querry
//             {
//                 From = 0,
//                 To = 7,
//                 CategoryFilter = Uri.EscapeDataString(categories[0].Id.ToString()),
//                 TagsFilter = "",
//                 SearchQuerry = ""
//             };

//             var result = await handler.Handle(query, CancellationToken.None);

//             Assert.IsNotNull(result.Value);
//             Assert.That(result.Value.Count, Is.EqualTo(10));
//             Assert.That(result.Value.Recipes, Has.Count.EqualTo(7));
//             Assert.That(result.Value.Recipes.Any(r => r.Title == "Przepis 2"));
//             Assert.That(result.Value.Recipes.Any(r => r.Title == "Przepis 4"));
//             Assert.That(result.Value.Recipes.Any(r => r.Title == "Przepis 6"));
//             Assert.That(result.Value.Recipes.Any(r => r.Title == "Przepis 8"));
//             Assert.That(result.Value.Recipes.Any(r => r.Title == "Przepis Specjalny 10"));
//             Assert.That(result.Value.Recipes.Any(r => r.Title == "Przepis 12"));
//             Assert.That(result.Value.Recipes.Any(r => r.Title == "Przepis 14"));
//         }

//         [Test]
//         public async Task Handler_ReturnsRecipesFilteredByTag()
//         {
//             var handler = new Application.Recipes.List.Handler(_mockContext.Object, _mapper);
//             var query = new Application.Recipes.List.Querry
//             {
//                 From = 0,
//                 To = 4,
//                 CategoryFilter = "",
//                 TagsFilter = Uri.EscapeDataString(tags[1].Id.ToString()),
//                 SearchQuerry = ""
//             };

//             var result = await handler.Handle(query, CancellationToken.None);

//             Assert.IsNotNull(result.Value);
//             Assert.That(result.Value.Count, Is.EqualTo(10));
//             Assert.That(result.Value.Recipes, Has.Count.EqualTo(4));
//             Assert.That(result.Value.Recipes.Any(r => r.Title == "Przepis 1"));
//             Assert.That(result.Value.Recipes.Any(r => r.Title == "Przepis 3"));
//             Assert.That(result.Value.Recipes.Any(r => r.Title == "Przepis Specjalny 5"));
//             Assert.That(result.Value.Recipes.Any(r => r.Title == "Przepis 7"));
//         }
//     }
// }

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using Application.DTOs;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;
using NUnit.Framework;
using Domain;

namespace UnitTests.Recipes
{
    [TestFixture]
    public class ListRecipesTests
    {
        private DataContext _context;
        private IMapper _mapper;
        private List<Category> categories;
        private List<Tag> tags;

        [SetUp]
        public void Setup()
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

            categories = new List<Category>
            {
                new Category { Id = Guid.NewGuid(), Name = "Kategoria 1" },
                new Category { Id = Guid.NewGuid(), Name = "Kategoria 2" }
            };

            tags = new List<Tag>
            {
                new Tag { Id = Guid.NewGuid(), Name = "Tag 1" },
                new Tag { Id = Guid.NewGuid(), Name = "Tag 2" }
            };

            var recipes = Enumerable
                .Range(1, 20)
                .Select(
                    i =>
                        new Recipe
                        {
                            Id = Guid.NewGuid(),
                            Title = "Przepis " + (i % 5 == 0 ? "Specjalny " : "") + i,
                            CategoryId = categories[i % categories.Count].Id,
                            Date = DateTime.Now.AddDays(-i),
                            Ingredients = new List<Ingredient>
                            {
                                new Ingredient { Name = "Składnik" }
                            },
                            RecipeTags = new List<RecipeTags>
                            {
                                new RecipeTags { TagId = tags[i % tags.Count].Id }
                            }
                        }
                )
                .ToList();

            _context.Categories.AddRange(categories);
            _context.Tags.AddRange(tags);
            _context.Recipes.AddRange(recipes);
            _context.SaveChanges();
        }

        [Test]
        public async Task Handler_ReturnsNumberOfRecipes()
        {
            var handler = new Application.Recipes.List.Handler(_context, _mapper);
            var query = new Application.Recipes.List.Querry
            {
                From = 2,
                To = 5,
                CategoryFilter = "",
                TagsFilter = "",
                SearchQuerry = ""
            };

            var result = await handler.Handle(query, CancellationToken.None);

            Assert.IsNotNull(result.Value);
            Assert.That(result.Value.Count, Is.EqualTo(20));
            Assert.That(result.Value.Recipes, Has.Count.EqualTo(3));
            Assert.That(result.Value.Recipes.Any(r => r.Title == "Przepis 3"));
            Assert.That(result.Value.Recipes.Any(r => r.Title == "Przepis 4"));
            Assert.That(result.Value.Recipes.Any(r => r.Title == "Przepis Specjalny 5"));
        }

        [Test]
        public async Task Handler_ReturnsRecipesFilteredByPhrase()
        {
            var handler = new Application.Recipes.List.Handler(_context, _mapper);
            var query = new Application.Recipes.List.Querry
            {
                From = 0,
                To = 7,
                CategoryFilter = "",
                TagsFilter = "",
                SearchQuerry = "Specjalny"
            };

            var result = await handler.Handle(query, CancellationToken.None);

            Assert.IsNotNull(result.Value);
            Assert.That(result.Value.Count, Is.EqualTo(4));
            Assert.That(result.Value.Recipes, Has.Count.EqualTo(4));
            Assert.That(result.Value.Recipes.Any(r => r.Title == "Przepis Specjalny 5"));
            Assert.That(result.Value.Recipes.Any(r => r.Title == "Przepis Specjalny 10"));
            Assert.That(result.Value.Recipes.Any(r => r.Title == "Przepis Specjalny 15"));
            Assert.That(result.Value.Recipes.Any(r => r.Title == "Przepis Specjalny 20"));
        }

        [Test]
        public async Task Handler_ReturnsRecipesFilteredByCategory()
        {
            var handler = new Application.Recipes.List.Handler(_context, _mapper);
            var query = new Application.Recipes.List.Querry
            {
                From = 0,
                To = 7,
                CategoryFilter = Uri.EscapeDataString(categories[0].Id.ToString()),
                TagsFilter = "",
                SearchQuerry = ""
            };

            var result = await handler.Handle(query, CancellationToken.None);

            Assert.IsNotNull(result.Value);
            Assert.That(result.Value.Count, Is.EqualTo(10));
            Assert.That(result.Value.Recipes, Has.Count.EqualTo(7));
            Assert.That(result.Value.Recipes.Any(r => r.Title == "Przepis 2"));
            Assert.That(result.Value.Recipes.Any(r => r.Title == "Przepis 4"));
            Assert.That(result.Value.Recipes.Any(r => r.Title == "Przepis 6"));
            Assert.That(result.Value.Recipes.Any(r => r.Title == "Przepis 8"));
            Assert.That(result.Value.Recipes.Any(r => r.Title == "Przepis Specjalny 10"));
            Assert.That(result.Value.Recipes.Any(r => r.Title == "Przepis 12"));
            Assert.That(result.Value.Recipes.Any(r => r.Title == "Przepis 14"));
        }

        [Test]
        public async Task Handler_ReturnsRecipesFilteredByTag()
        {
            var handler = new Application.Recipes.List.Handler(_context, _mapper);
            var query = new Application.Recipes.List.Querry
            {
                From = 0,
                To = 4,
                CategoryFilter = "",
                TagsFilter = Uri.EscapeDataString(tags[1].Id.ToString()),
                SearchQuerry = ""
            };

            var result = await handler.Handle(query, CancellationToken.None);

            Assert.IsNotNull(result.Value);
            Assert.That(result.Value.Count, Is.EqualTo(10));
            Assert.That(result.Value.Recipes, Has.Count.EqualTo(4));
            Assert.That(result.Value.Recipes.Any(r => r.Title == "Przepis 1"));
            Assert.That(result.Value.Recipes.Any(r => r.Title == "Przepis 3"));
            Assert.That(result.Value.Recipes.Any(r => r.Title == "Przepis Specjalny 5"));
            Assert.That(result.Value.Recipes.Any(r => r.Title == "Przepis 7"));
        }

        [TearDown]
        public void Cleanup()
        {
            _context.Database.EnsureDeleted();
            _context.Dispose();
        }
    }
}
