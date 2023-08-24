using MediatR;
using Persistence;

namespace Application.Recipes
{
    public class Delete
    {
        public class Command : IRequest
        {
            public Guid Id { get; set; }
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
                var recipe = await _context.Recipes.FindAsync(request.Id);
                _context.Recipes.Remove(recipe);

                await _context.SaveChangesAsync();

                return Unit.Value;
            }
        }
    }
}