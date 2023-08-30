using Domain;
using FluentValidation;
using FluentValidation.Validators;
using MediatR;
using Persistence;

namespace Application.Recipes
{
    public class Create
    {
        public class Command : IRequest
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

        public class Handler : IRequestHandler<Command>
        {
        private readonly DataContext _context;
            public Handler(DataContext context)
            {
                _context = context;
            }

            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {
                _context.Recipes.Add(request.Recipe);

                await _context.SaveChangesAsync();

                return Unit.Value;
            }
        }
    }
}