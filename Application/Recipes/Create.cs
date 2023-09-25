using Application.Core;
using Application.Interfaces;
using Domain;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;
using Application.DTOs;

namespace Application.Recipes
{
    public class Create
    {
        public class Command : IRequest<Result<Unit>>
        {
            public RecipeDTO RecipeDTO { get; set; }
        }

        public class CommandValidator : AbstractValidator<Command>
        {
            public CommandValidator()
            {
                RuleFor(x => x.RecipeDTO).SetValidator(new RecipeDTOValidator());
            }
        }

        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            private readonly DataContext _context;
            private readonly IUserAccessor _userAccessor;

            public Handler(DataContext context, IUserAccessor userAccessor)
            {
                _context = context;
                _userAccessor = userAccessor;
            }

            public async Task<Result<Unit>> Handle(
                Command request,
                CancellationToken cancellationToken
            )
            {
                var user = await _context.Users.FirstOrDefaultAsync(
                    x => x.UserName == _userAccessor.GetUsername()
                );
                var category = await _context.Categories.FindAsync(request.RecipeDTO.CategoryId);

                var recipe = new Recipe
                {
                    Id = request.RecipeDTO.Id,
                    Title = request.RecipeDTO.Title,
                    Description = request.RecipeDTO.Description,
                    CreatorId = user.Id,
                    CategoryId = category.Id,
                };

                _context.Recipes.Add(recipe);
                await _context.SaveChangesAsync();

                var recipeTags = request.RecipeDTO.Tags
                    .Select(
                        tag => new RecipeTags { TagId = tag.Id, RecipeId = request.RecipeDTO.Id }
                    )
                    .ToList();
                var instructions = request.RecipeDTO.Instructions
                    .Select(
                        instruction =>
                            new Instruction
                            {
                                Id = instruction.Id,
                                Text = instruction.Text,
                                Position = instruction.Position,
                                RecipeId = request.RecipeDTO.Id
                            }
                    )
                    .ToList();
                var ingredients = request.RecipeDTO.Ingredients
                    .Select(
                        ingredient =>
                            new Ingredient
                            {
                                Id = ingredient.Id,
                                Name = ingredient.Name,
                                Amount = ingredient.Amount,
                                RecipeId = request.RecipeDTO.Id,
                                MeasurementId = ingredient.MeasurementId
                            }
                    )
                    .ToList();

                //_context.Recipes.Add(recipe);
                await _context.RecipeTags.AddRangeAsync(recipeTags);
                await _context.Instructions.AddRangeAsync(instructions);
                await _context.Ingredients.AddRangeAsync(ingredients);

                var result = await _context.SaveChangesAsync() > 0;

                if (!result)
                {
                    return Result<Unit>.Failure("Failed to create recipe");
                }
                else
                {
                    return Result<Unit>.Success(Unit.Value);
                }
            }
        }
    }
}
