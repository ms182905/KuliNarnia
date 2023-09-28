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
        public class Querry : IRequest<Result<RecipeDetailsDTO>>
        {
            public Guid Id { get; set; }
        }

        public class Handler : IRequestHandler<Querry, Result<RecipeDetailsDTO>>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;

            public Handler(DataContext context, IMapper mapper)
            {
                _context = context;
                _mapper = mapper;
            }

            public async Task<Result<RecipeDetailsDTO>> Handle(
                Querry request,
                CancellationToken cancellationToken
            )
            {
                var recipe = await _context.Recipes
                    .Where(r => r.Id == request.Id)
                    .ProjectTo<RecipeDetailsDTO>(_mapper.ConfigurationProvider)
                    .FirstAsync();

                return Result<RecipeDetailsDTO>.Success(recipe);
            }
        }
    }
}
