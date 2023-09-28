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

            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var oldRecipe = await _context.Recipes.FindAsync(request.RecipeDetailsDTO.Id);
                
                if (oldRecipe == null) 
                {
                    return null;
                }

                var userId = oldRecipe.CreatorId;

                _context.Recipes.Remove(oldRecipe);
                var result = await _context.SaveChangesAsync() > 0;
                if (!result)
                {
                    return Result<Unit>.Failure("Failed to update recipe");
                }

                var category = await _context.Categories.FindAsync(request.RecipeDetailsDTO.CategoryId);

                var recipe = new Recipe
                {
                    Id = request.RecipeDetailsDTO.Id,
                    Title = request.RecipeDetailsDTO.Title,
                    Description = request.RecipeDetailsDTO.Description,
                    CreatorId = userId,
                    CategoryId = category.Id,
                };

                // _context.Recipes.Add(recipe);
                // var result = await _context.SaveChangesAsync() > 0;
                // if (!result)
                // {
                //     return Result<Unit>.Failure("Failed to update recipe");
                // }

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