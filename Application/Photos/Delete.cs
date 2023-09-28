using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Core;
using Application.Interfaces;
using MediatR;
using Persistence;

namespace Application.Photos
{
    public class Delete
    {
        public class Command : IRequest<Result<Unit>>
        {
            public string Id { get; set; }
        }

        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
        private readonly IPhotoAccessor _photoAccessor;
        private readonly DataContext _context;
            public Handler (DataContext context, IPhotoAccessor photoAccessor)
            {
                _photoAccessor = photoAccessor;
                _context = context;
            }

            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var photo = _context.Photos.FirstOrDefault(x => x.Id == request.Id);
                
                if (photo == null)
                {
                    return null;
                }

                if (photo.IsMain)
                {
                    return Result<Unit>.Failure("Cannot delete main photo");
                }

                var result = await _photoAccessor.DeletePhoto(request.Id);
            
                if (result == null)
                {
                    return Result<Unit>.Failure("Problem deleting photo");
                }

                _context.Photos.Remove(photo);

                var success = await _context.SaveChangesAsync() > 0;

                if (success)
                {
                    return Result<Unit>.Success(Unit.Value);
                }

                    return Result<Unit>.Failure("Problem deleting photo from API");
            }
        }
    }
}