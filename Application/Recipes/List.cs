using Application.Core;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Recipes
{
    public class List
    {
        public class Querry : IRequest<Result<List<Recipe>>> {}

        public class Handler : IRequestHandler<Querry, Result<List<Recipe>>>
        {
        private readonly DataContext _context;
            public Handler(DataContext context)
            {
                _context = context;
            }

            public async Task<Result<List<Recipe>>> Handle(Querry request, CancellationToken cancellationToken)
            {
                return Result<List<Recipe>>.Success(await _context.Recipes.ToListAsync());
            }
        }
    }
}