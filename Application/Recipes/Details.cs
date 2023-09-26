using Application.Core;
using Application.DTOs;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Recipes
{
    public class Details
    {
        public class Querry : IRequest<Result<RecipeDTO>>
        {
            public Guid Id { get; set; }
        }

        public class Handler : IRequestHandler<Querry, Result<RecipeDTO>>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;

            public Handler(DataContext context, IMapper mapper)
            {
                _context = context;
                _mapper = mapper;
            }

            public async Task<Result<RecipeDTO>> Handle(
                Querry request,
                CancellationToken cancellationToken
            )
            {
                var recipe = await _context.Recipes
                    .Where(r => r.Id == request.Id)
                    .ProjectTo<RecipeDTO>(_mapper.ConfigurationProvider)
                    .FirstAsync();

                return Result<RecipeDTO>.Success(recipe);
            }
        }
    }
}
