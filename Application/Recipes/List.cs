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
                var recipes = await _context.Recipes
                        .ProjectTo<RecipeDTO>(_mapper.ConfigurationProvider)
                        .ToListAsync();

                foreach (var recipe in recipes)
                {
                    var photo = await _context.Photos.FirstOrDefaultAsync(x => x.RecipeId == recipe.Id);
                    if (photo == null)
                    {
                        continue;
                    }
                    recipe.Photo = new PhotoDTO{Id = photo.Id, IsMain = true, Url = photo.Url};
                }

                return Result<List<RecipeDTO>>.Success(recipes);
            }
        }
    }
}
