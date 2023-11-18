using Application.Core;
using Application.DTOs;
using Application.Interfaces;
using Domain;
using FluentValidation;
using MediatR;
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

            public async Task<Result<Unit>> Handle(
                Command request,
                CancellationToken cancellationToken
            )
            {
                var oldRecipe = await _context.Recipes.FindAsync(request.RecipeDetailsDTO.Id);

                if (oldRecipe == null)
                {
                    return null;
                }

                UpdateRecipeProperties(oldRecipe, request.RecipeDetailsDTO);

                if (_context.ChangeTracker.HasChanges())
                {
                    var result = await _context.SaveChangesAsync() > 0;
                    if (!result)
                    {
                        return Result<Unit>.Failure("Failed to update recipe");
                    }
                }

                RemoveExistingEntities(request.RecipeDetailsDTO.Id);

                if (_context.ChangeTracker.HasChanges())
                {
                    var result = await _context.SaveChangesAsync() > 0;
                    if (!result)
                    {
                        return Result<Unit>.Failure("Failed to update recipe");
                    }
                }

                AddNewEntities(request.RecipeDetailsDTO);

                if (_context.ChangeTracker.HasChanges())
                {
                    var result = await _context.SaveChangesAsync() > 0;
                    if (!result)
                    {
                        return Result<Unit>.Failure("Failed to update recipe");
                    }
                }

                return Result<Unit>.Success(Unit.Value);
            }

            private void UpdateRecipeProperties(Recipe recipe, RecipeDetailsDTO detailsDTO)
            {
                recipe.Title = detailsDTO.Title;
                recipe.Description = detailsDTO.Description;
                recipe.CategoryId = detailsDTO.CategoryId;
                recipe.LastModificationDate = detailsDTO.Date;
            }

            private void RemoveExistingEntities(Guid recipeId)
            {
                var existingRecipeTags = _context.RecipeTags
                    .Where(rt => rt.RecipeId == recipeId)
                    .ToList();

                var existingRecipeIngredients = _context.Ingredients
                    .Where(rt => rt.RecipeId == recipeId)
                    .ToList();

                var existingRecipeInstructions = _context.Instructions
                    .Where(rt => rt.RecipeId == recipeId)
                    .ToList();

                _context.RecipeTags.RemoveRange(existingRecipeTags);
                _context.Ingredients.RemoveRange(existingRecipeIngredients);
                _context.Instructions.RemoveRange(existingRecipeInstructions);
            }

            private void AddNewEntities(RecipeDetailsDTO detailsDTO)
            {
                var recipeTags = detailsDTO.Tags
                    .Select(tag => new RecipeTags { TagId = tag.Id, RecipeId = detailsDTO.Id })
                    .ToList();

                var instructions = detailsDTO.Instructions
                    .Select(
                        instruction =>
                            new Instruction
                            {
                                Id = instruction.Id,
                                Text = instruction.Text,
                                Position = instruction.Position,
                                RecipeId = detailsDTO.Id
                            }
                    )
                    .ToList();

                var ingredients = detailsDTO.Ingredients
                    .Select(
                        ingredient =>
                            new Ingredient
                            {
                                Id = ingredient.Id,
                                Name = ingredient.Name,
                                Amount = ingredient.Amount,
                                RecipeId = detailsDTO.Id,
                                MeasurementId = ingredient.Measurement.Id
                            }
                    )
                    .ToList();

                _context.RecipeTags.AddRange(recipeTags);
                _context.Ingredients.AddRange(ingredients);
                _context.Instructions.AddRange(instructions);
            }
        }
    }
}
