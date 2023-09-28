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
            public RecipeDetailsDTO RecipeDetailsDTO { get; set; }
        }

        public class CommandValidator : AbstractValidator<Command>
        {
            public CommandValidator()
            {
                RuleFor(x => x.RecipeDetailsDTO).SetValidator(new RecipeDetailsDTOValidator());
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
                var category = await _context.Categories.FindAsync(request.RecipeDetailsDTO.CategoryId);

                var recipe = new Recipe
                {
                    Id = request.RecipeDetailsDTO.Id,
                    Title = request.RecipeDetailsDTO.Title,
                    Description = request.RecipeDetailsDTO.Description,
                    CreatorId = user.Id,
                    CategoryId = category.Id,
                };

                _context.Recipes.Add(recipe);
                var result = await _context.SaveChangesAsync() > 0;
                if (!result)
                {
                    return Result<Unit>.Failure("Failed to create recipe");
                }

                var recipeTags = request.RecipeDetailsDTO.Tags
                    .Select(
                        tag => new RecipeTags { TagId = tag.Id, RecipeId = request.RecipeDetailsDTO.Id }
                    )
                    .ToList();
                var instructions = request.RecipeDetailsDTO.Instructions
                    .Select(
                        instruction =>
                            new Instruction
                            {
                                Id = instruction.Id,
                                Text = instruction.Text,
                                Position = instruction.Position,
                                RecipeId = request.RecipeDetailsDTO.Id
                            }
                    )
                    .ToList();
                var ingredients = request.RecipeDetailsDTO.Ingredients
                    .Select(
                        ingredient =>
                            new Ingredient
                            {
                                Id = ingredient.Id,
                                Name = ingredient.Name,
                                Amount = ingredient.Amount,
                                RecipeId = request.RecipeDetailsDTO.Id,
                                MeasurementId = ingredient.MeasurementId
                            }
                    )
                    .ToList();

                await _context.RecipeTags.AddRangeAsync(recipeTags);
                await _context.Instructions.AddRangeAsync(instructions);
                await _context.Ingredients.AddRangeAsync(ingredients);

                result = await _context.SaveChangesAsync() > 0;
                if (!result)
                {
                    return Result<Unit>.Failure("Failed to create recipe");
                }

                return Result<Unit>.Success(Unit.Value);
            }
        }
    }
}
