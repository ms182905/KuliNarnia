using Application.Core;
using MediatR;
using Domain;
using Microsoft.AspNetCore.Http;
using Persistence;
using Application.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Application.Photos
{
    public class Add
    {
        public class Command : IRequest<Result<Photo>>
        {
            public Guid Id { get; set; }
            public IFormFile File { get; set; }
        }

        public class Handler : IRequestHandler<Command, Result<Photo>>
        {
            private readonly DataContext _context;
            private readonly IPhotoAccessor _photoAccessor;

            public Handler(DataContext context, IPhotoAccessor photoAccessor)
            {
                _context = context;
                _photoAccessor = photoAccessor;
            }

            public async Task<Result<Photo>> Handle(Command request, CancellationToken cancellationToken)
            {
                var recipe = _context.Recipes.AsNoTracking().FirstOrDefault( x => x.Id == request.Id);
                if (recipe == null)
                {   
                    return null;
                }

                var photos = await _context.Photos.Where(x => x.RecipeId == request.Id).ToListAsync();

                var photoUploadResult = await _photoAccessor.AddPhoto(request.File);

                var photo = new Photo
                {
                    Url = photoUploadResult.Url,
                    Id = photoUploadResult.PublicId,
                    RecipeId = request.Id
                };

                if (photos.Count() == 0)
                {
                    photo.IsMain = true;
                }

                await _context.Photos.AddAsync(photo);

                var result = await _context.SaveChangesAsync() > 0;
                if (result)
                {
                    return Result<Photo>.Success(photo);
                }

                return Result<Photo>.Failure("Problem adding photo");
            }
        }
    }
}