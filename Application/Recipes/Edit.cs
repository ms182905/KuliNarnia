using Application.Core;
using Application.DTOs;
using Application.Interfaces;
using AutoMapper;
using Domain;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Recipes
{
    public class Edit
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

            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var oldRecipe = await _context.Recipes.FindAsync(request.RecipeDTO.Id);
                
                if (oldRecipe == null) 
                {
                    return null;
                }

                var user = await _context.Users.FirstOrDefaultAsync(
                    x => x.UserName == _userAccessor.GetUsername()
                );

                if (user.Id != oldRecipe.CreatorId)
                {
                    return Result<Unit>.Failure("Unauthorized to edit");
                }

                _context.Recipes.Remove(oldRecipe);
                var result = await _context.SaveChangesAsync() > 0;
                if (!result)
                {
                    return Result<Unit>.Failure("Failed to update recipe");
                }

                var category = await _context.Categories.FindAsync(request.RecipeDTO.CategoryId);

                var recipe = new Recipe
                {
                    Id = request.RecipeDTO.Id,
                    Title = request.RecipeDTO.Title,
                    Description = request.RecipeDTO.Description,
                    CreatorId = user.Id,
                    CategoryId = category.Id,
                };

                // _context.Recipes.Add(recipe);
                // var result = await _context.SaveChangesAsync() > 0;
                // if (!result)
                // {
                //     return Result<Unit>.Failure("Failed to update recipe");
                // }

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

                // await _context.RecipeTags.AddRangeAsync(recipeTags);
                // await _context.Instructions.AddRangeAsync(instructions);
                // await _context.Ingredients.AddRangeAsync(ingredients);

                // result = await _context.SaveChangesAsync() > 0;
                // if (!result)
                // {
                //     return Result<Unit>.Failure("Failed to update recipe");
                // }

                recipe.Ingredients = ingredients;
                recipe.Instructions = instructions;
                recipe.RecipeTags = recipeTags;

                await _context.Recipes.AddAsync(recipe);

                result = await _context.SaveChangesAsync() > 0;
                if (!result)
                {
                    return Result<Unit>.Failure("Failed to update recipe");
                }

                return Result<Unit>.Success(Unit.Value);
            }
        }
    }
}