using Application.Core;
using Application.Interfaces;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.FavouriteRecipes
{
    public class Add
    {
        public class Command : IRequest<Result<Unit>>
        {
            public Guid Id { get; set; }
        }

        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            private readonly DataContext _context;
            private readonly IUserAccessor _userAccessor;

            public Handler(DataContext context, IUserAccessor userAccessor)
            {
                _context = context;
                _userAccessor = userAccessor;
            }

            public async Task<Result<Unit>> Handle(
                Command request,
                CancellationToken cancellationToken
            )
            {
                var user = await _context.Users.FirstOrDefaultAsync(
                    x => x.UserName == _userAccessor.GetUsername()
                );
                if (user == null)
                {
                    return null;
                }

                var recipe = await _context.FavouriteRecipes.FirstOrDefaultAsync(
                    x => x.AppUserId == user.Id && x.RecipeId == request.Id
                );
                if (recipe != null)
                {
                    return Result<Unit>.Failure("Recipe already in favourites");
                }

                var favouriteRecipe = new FavouriteRecipe
                {
                    RecipeId = request.Id,
                    AppUserId = user.Id
                };

                _context.FavouriteRecipes.Add(favouriteRecipe);

                var result = await _context.SaveChangesAsync() > 0;

                if (!result)
                {
                    return Result<Unit>.Failure("Failed to add to favourites");
                }
                else
                {
                    return Result<Unit>.Success(Unit.Value);
                }
            }
        }
    }
}
