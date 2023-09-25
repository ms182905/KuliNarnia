using Application.Core;
using Application.DTOs;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Recipes
{
    public class List
    {
        public class Querry : IRequest<Result<List<RecipeDTO>>> { }

        public class Handler : IRequestHandler<Querry, Result<List<RecipeDTO>>>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;

            public Handler(DataContext context, IMapper mapper)
            {
                _context = context;
                _mapper = mapper;
            }

            public async Task<Result<List<RecipeDTO>>> Handle(
                Querry request,
                CancellationToken cancellationToken
            )
            {
                return Result<List<RecipeDTO>>.Success(
                    await _context.Recipes
                        .ProjectTo<RecipeDTO>(_mapper.ConfigurationProvider)
                        .ToListAsync()
                );
            }
        }
    }
}
