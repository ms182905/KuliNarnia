using Application.Core;
using Application.DTOs;
using Domain;
using FluentValidation;
using MediatR;
using Persistence;

namespace Application.Categories
{
    public class Create
    {
        public class Command : IRequest<Result<Unit>>
        {
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
                var category = new Category
                {
                    Id = request.CategoryDTO.Id,
                    Name = request.CategoryDTO.Name
                };

                await _context.Categories.AddAsync(category);

                var result = await _context.SaveChangesAsync() > 0;
                if (!result)
                {
                    return Result<Unit>.Failure("Failed to create category");
                }

                return Result<Unit>.Success(Unit.Value);
            }
        }
    }
}
