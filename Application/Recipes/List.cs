using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Recipes
{
    public class List
    {
        public class Querry : IRequest<List<Recipe>> {}

        public class Handler : IRequestHandler<Querry, List<Recipe>>
        {
        private readonly DataContext _context;
            public Handler(DataContext context)
            {
                _context = context;
            }

            public async Task<List<Recipe>> Handle(Querry request, CancellationToken cancellationToken)
            {
                return await _context.Recipes.ToListAsync();
            }
        }
    }
}