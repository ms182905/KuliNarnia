using Application.Core;
using MediatR;
using Domain;
using Microsoft.AspNetCore.Http;
using Persistence;
using Application.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace Application.Photos
{
    public class ChangeUserProfilePhoto
    {
        public class Command : IRequest<Result<Photo>>
        {
            public IFormFile File { get; set; }
        }

        public class Handler : IRequestHandler<Command, Result<Photo>>
        {
            private readonly DataContext _context;
            private readonly IPhotoAccessor _photoAccessor;
            private readonly IUserAccessor _userAccessor;

            public Handler(DataContext context, IPhotoAccessor photoAccessor, IUserAccessor userAccessor)
            {
                _context = context;
                _photoAccessor = photoAccessor;
                _userAccessor = userAccessor;
            }

            public async Task<Result<Photo>> Handle(Command request, CancellationToken cancellationToken)
            {
                var user = await _context.Users.FirstOrDefaultAsync(
                    x => x.UserName == _userAccessor.GetUsername()
                );

                if (user == null)
                {
                    return null;
                }

                if (!user.PhotoId.IsNullOrEmpty())
                {
                    var photoDeletingResult = await _photoAccessor.DeletePhoto(user.PhotoId);
            
                    if (photoDeletingResult == null)
                    {
                        return null;
                    }
                }

                var photoUploadResult = await _photoAccessor.AddPhoto(request.File);

                var photo = new Photo
                {
                    Url = photoUploadResult.Url
                };

                user.PhotoUrl = photoUploadResult.Url;
                user.PhotoId = photoUploadResult.PublicId;

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