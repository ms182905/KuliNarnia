using Application.Core;
using Domain;
using MediatR;
using Persistence;

namespace Application.Recipes
{
    public class Details
    {
        public class Querry : IRequest<Result<Recipe>>
        {
            public Guid Id { get; set; }
        }

        public class Handler : IRequestHandler<Querry, Result<Recipe>>
        {
        private readonly DataContext _context;
            public Handler(DataContext context)
            {
                _context = context;
            }

            public async Task<Result<Recipe>> Handle(Querry request, CancellationToken cancellationToken)
            {
                var recipe = await _context.Recipes.FindAsync(request.Id);
                return Result<Recipe>.Success(recipe);
            }
        }
    }
}