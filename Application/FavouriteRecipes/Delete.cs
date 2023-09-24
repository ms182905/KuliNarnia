using Application.Core;
using Application.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.FavouriteRecipes
{
    public class Delete
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

            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var user = await _context.Users.FirstOrDefaultAsync(
                    x => x.UserName == _userAccessor.GetUsername()
                );
                var recipe = await _context.FavouriteRecipes.FirstOrDefaultAsync(x => x.AppUserId == user.Id && x.RecipeId == request.Id);
                
                if (recipe == null) 
                {
                    return Result<Unit>.Failure("No such recipe in favourites");
                }
                
                _context.FavouriteRecipes.Remove(recipe);

                var result = await _context.SaveChangesAsync() > 0;

                if (!result)
                {
                    return Result<Unit>.Failure("Failed to Remove from favourites");
                }

                return Result<Unit>.Success(Unit.Value);
            }
        }
    }
}