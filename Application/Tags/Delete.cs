using Application.Core;
using Application.DTOs;
using Domain;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Tags
{
    public class Delete
    {
        public class Command : IRequest<Result<Unit>>
        {
            public Guid TagId { get; set; }
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
                var tag = await _context.Tags.FindAsync(request.TagId);

                if (tag == null)
                {
                    return null;
                }

                var userSelections = await _context.UserSelectionStastics
                    .Where(s => s.TagId == request.TagId)
                    .ToListAsync();
                if (userSelections.Count > 0)
                {
                    _context.UserSelectionStastics.RemoveRange(userSelections);

                    var selectionRemovingResult = await _context.SaveChangesAsync() > 0;
                    if (!selectionRemovingResult)
                    {
                        return Result<Unit>.Failure("Failed to delete tag");
                    }
                }

                var recipeTags = await _context.RecipeTags
                    .Where(s => s.TagId == request.TagId)
                    .ToListAsync();
                if (recipeTags.Count > 0)
                {
                    _context.RecipeTags.RemoveRange(recipeTags);

                    var recipeTagsRemovingResult = await _context.SaveChangesAsync() > 0;
                    if (!recipeTagsRemovingResult)
                    {
                        return Result<Unit>.Failure("Failed to delete tag");
                    }
                }

                _context.Tags.Remove(tag);

                var result = await _context.SaveChangesAsync() > 0;
                if (!result)
                {
                    return Result<Unit>.Failure("Failed to delete measurement");
                }

                return Result<Unit>.Success(Unit.Value);
            }
        }
    }
}
