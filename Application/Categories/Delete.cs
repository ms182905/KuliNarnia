using Application.Core;
using Application.DTOs;
using Domain;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Categories
{
    public class Delete
    {
        public class Command : IRequest<Result<Unit>>
        {
            public Guid CategoryId { get; set; }
        }

        public class CommandValidator : AbstractValidator<Command>
        {
            public CommandValidator()
            {
                // RuleFor(x => x.RecipeDetailsDTO).SetValidator(new RecipeDetailsDTOValidator());
            }
        }

        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            private readonly DataContext _context;

            public Handler(DataContext context)
            {
                _context = context;
            }

            public async Task<Result<Unit>> Handle(
                Command request,
                CancellationToken cancellationToken
            )
            {
                var userSelectionStatistics = await _context.UserSelectionStastics
                    .Where(s => s.CategoryId == request.CategoryId)
                    .ToListAsync();
                if (userSelectionStatistics.Count > 0)
                {
                    _context.UserSelectionStastics.RemoveRange(userSelectionStatistics);
                }

                var recipes = await _context.Recipes
                    .Where(r => r.CategoryId == request.CategoryId)
                    .ToListAsync();
                if (recipes.Count > 0)
                {
                    var unknownCategory = await _context.Categories
                        .Where(c => c.Name == "Unknown")
                        .FirstAsync();
                    foreach (var recipe in recipes)
                    {
                        recipe.CategoryId = unknownCategory.Id;
                    }

                    var changeCategoryResults = await _context.SaveChangesAsync() > 0;
                    if (!changeCategoryResults)
                    {
                        return Result<Unit>.Failure("Failed to delete category");
                    }
                }

                var category = await _context.Categories.FindAsync(request.CategoryId);
                if (category == null)
                {
                    return null;
                }

                _context.Categories.Remove(category);

                var result = await _context.SaveChangesAsync() > 0;
                if (!result)
                {
                    return Result<Unit>.Failure("Failed to delete category");
                }

                return Result<Unit>.Success(Unit.Value);
            }
        }
    }
}
