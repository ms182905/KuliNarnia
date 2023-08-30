using Application.Core;
using AutoMapper;
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
            public Recipe Recipe { get; set; }
        }

        public class CommandValidator : AbstractValidator<Command> 
        {
            public CommandValidator()
            {
                RuleFor(x => x.Recipe).SetValidator(new RecipeValidator());
            }
        }

        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;
            public Handler(DataContext context, IMapper mapper)
            {
                _mapper = mapper;
                _context = context;
            }

            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var recipe = await _context.Recipes.FindAsync(request.Recipe.Id);

                if (recipe == null)
                {
                    return null;
                }

                _mapper.Map(request.Recipe, recipe);

                var result = await _context.SaveChangesAsync() > 0;
                
                if (!result)
                {
                    return Result<Unit>.Failure("Failed to edit the recipe");
                }

                return Result<Unit>.Success(Unit.Value);
            }
        }
    }
}