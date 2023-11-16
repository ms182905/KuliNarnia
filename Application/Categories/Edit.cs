using Application.Core;
using Application.DTOs;
using FluentValidation;
using MediatR;
using Persistence;

namespace Application.Categories
{
    public class Edit
    {
        public class Command : IRequest<Result<Unit>>
        {
            public Guid CategoryId { get; set; }
            public CategoryDTO CategoryDTO { get; set; }
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
                var category = await _context.Categories.FindAsync(request.CategoryId);

                if (category == null)
                {
                    return null;
                }

                category.Name = request.CategoryDTO.Name;

                var result = await _context.SaveChangesAsync() > 0;
                if (!result)
                {
                    return Result<Unit>.Failure("Failed to update category");
                }

                return Result<Unit>.Success(Unit.Value);
            }
        }
    }
}
