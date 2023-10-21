using Application.Core;
using Application.DTOs;
using Application.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.FavouriteRecipes
{
    public class List
    {
        public class Querry : IRequest<Result<RecipesDTO>>
        {
            public int From { get; set; }
            public int To { get; set; }
        }

        public class Handler : IRequestHandler<Querry, Result<RecipesDTO>>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;
            private readonly IUserAccessor _userAccessor;

            public Handler(DataContext context, IMapper mapper, IUserAccessor userAccessor)
            {
                _context = context;
                _mapper = mapper;
                _userAccessor = userAccessor;
            }

            public async Task<Result<RecipesDTO>> Handle(
                Querry request,
                CancellationToken cancellationToken
            )
            {
                var user = await _context.Users.FirstOrDefaultAsync(
                    x => x.UserName == _userAccessor.GetUsername()
                );

                var favouriteRecipes = await _context.Recipes
                    .Where(x => x.FavouriteRecipes.Any(x => x.AppUserId == user.Id))
                    .Skip(request.From)
                    .Take(request.To - request.From)
                    .ProjectTo<RecipeDTO>(_mapper.ConfigurationProvider)
                    .ToListAsync();

                var recipesNumber = await _context.Recipes
                    .Where(x => x.FavouriteRecipes.Any(x => x.AppUserId == user.Id))
                    .CountAsync();

                var recipesDTO = new RecipesDTO
                {
                    Recipes = favouriteRecipes,
                    Count = recipesNumber
                };

                return Result<RecipesDTO>.Success(recipesDTO);
            }
        }
    }
}
