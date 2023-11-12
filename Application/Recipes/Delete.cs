using Application.Core;
using Application.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Recipes
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
            private readonly IPhotoAccessor _photoAccessor;

            public Handler(DataContext context, IPhotoAccessor photoAccessor)
            {
                _context = context;
                _photoAccessor = photoAccessor;
            }

            public async Task<Result<Unit>> Handle(
                Command request,
                CancellationToken cancellationToken
            )
            {
                var recipe = await _context.Recipes.FindAsync(request.Id);

                if (recipe == null)
                {
                    return null;
                }

                var recipePhotos = await _context.Photos
                    .Where(p => p.RecipeId == request.Id)
                    .ToListAsync();
                foreach (var photo in recipePhotos)
                {
                    var photoDeletingResult = await _photoAccessor.DeletePhoto(photo.Id);

                    if (photoDeletingResult == null)
                    {
                        return Result<Unit>.Failure("Problem deleting photo");
                    }

                    _context.Photos.Remove(photo);
                }

                _context.Recipes.Remove(recipe);

                var result = await _context.SaveChangesAsync() > 0;

                if (!result)
                {
                    return Result<Unit>.Failure("Failed to delete the recipe");
                }

                return Result<Unit>.Success(Unit.Value);
            }
        }
    }
}
