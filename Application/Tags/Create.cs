using Application.Core;
using Application.DTOs;
using Domain;
using FluentValidation;
using MediatR;
using Persistence;

namespace Application.Tags
{
    public class Create
    {
        public class Command : IRequest<Result<Unit>>
        {
            public TagDTO TagDTO { get; set; }
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
                var tag = new Tag { Id = request.TagDTO.Id, Name = request.TagDTO.Name };

                await _context.Tags.AddAsync(tag);

                var result = await _context.SaveChangesAsync() > 0;
                if (!result)
                {
                    return Result<Unit>.Failure("Failed to create tag");
                }

                return Result<Unit>.Success(Unit.Value);
            }
        }
    }
}
