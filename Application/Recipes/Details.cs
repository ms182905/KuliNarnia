using Application.Core;
using Application.DTOs;
using Application.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
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
            private readonly IUserAccessor _userAccessor;

            public Handler(DataContext context, IMapper mapper, IUserAccessor userAccessor)
            {
                _context = context;
                _mapper = mapper;
                _userAccessor = userAccessor;
            }

            public async Task<Result<RecipeDetailsDTO>> Handle(
                Querry request,
                CancellationToken cancellationToken
            )
            {
                string userId = "";

                if (!_userAccessor.GetUsername().IsNullOrEmpty())
                {
                    var user = await _context.Users.FirstOrDefaultAsync(
                        x => x.UserName == _userAccessor.GetUsername()
                    );

                    if (user != null)
                    {
                        userId = user.Id;
                    }
                }

                var recipe = await _context.Recipes
                    .Where(r => r.Id == request.Id)
                    .ProjectTo<RecipeDetailsDTO>(_mapper.ConfigurationProvider)
                    .FirstOrDefaultAsync();

                if (recipe == null)
                {
                    return null;
                }

                if (!userId.IsNullOrEmpty())
                {
                    var inFavourites =
                        await _context.FavouriteRecipes.FirstOrDefaultAsync(
                            r => r.AppUserId == userId && r.RecipeId == request.Id
                        ) != null;
                    recipe.InFavourites = inFavourites;
                }
                else
                {
                    recipe.InFavourites = false;
                }

                return Result<RecipeDetailsDTO>.Success(recipe);
            }
        }
    }
}
