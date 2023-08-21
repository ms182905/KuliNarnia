using Domain;
using MediatR;
using Persistence;

namespace Application.Recipes
{
    public class Details
    {
        public class Querry : IRequest<Recipe>
        {
            public Guid Id { get; set; }
        }

        public class Handler : IRequestHandler<Querry, Recipe>
        {
        private readonly DataContext _context;
            public Handler(DataContext context)
            {
                _context = context;
            }

            public async Task<Recipe> Handle(Querry request, CancellationToken cancellationToken)
            {
                return await _context.Recipes.FindAsync(request.Id);
            }
        }
    }
}