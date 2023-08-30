using Application.Core;
using MediatR;
using Persistence;

namespace Application.Recipes
{
    public class Delete
    {
        public class Command : IRequest<Result<Unit>>
        {
            public Guid Id { get; set; }
        }

        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            private readonly DataContext _context;
            public Handler(DataContext context)
            {
                _context = context;
            }

            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var recipe = await _context.Recipes.FindAsync(request.Id);
                
                if (recipe == null) 
                {
                    return null;
                }
                
                _context.Recipes.Remove(recipe);

                var result = await _context.SaveChangesAsync() > 0;

                if (!result)
                {
                    return Result<Unit>.Failure("Failed to delete the recipe");
                }

                return Result<Unit>.Success(Unit.Value);
            }
        }
    }
}