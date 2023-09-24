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
        public class Querry : IRequest<Result<List<RecipeDTO>>> { }

        public class Handler : IRequestHandler<Querry, Result<List<RecipeDTO>>>
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

            public async Task<Result<List<RecipeDTO>>> Handle(
                Querry request,
                CancellationToken cancellationToken
            )
            {
                var user = await _context.Users.FirstOrDefaultAsync(
                    x => x.UserName == _userAccessor.GetUsername()
                );

                var favouriteRecipes = await _context.Recipes
                    .Where(x => x.FavouriteRecipes.Any(x => x.AppUserId == user.Id))
                    .ProjectTo<RecipeDTO>(_mapper.ConfigurationProvider)
                    .ToListAsync();

                return Result<List<RecipeDTO>>.Success(favouriteRecipes);
            }
        }
    }
}
