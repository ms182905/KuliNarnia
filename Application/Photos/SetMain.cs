using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Core;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Photos
{
    public class SetMain
    {
        public class Command : IRequest<Result<Unit>>
        {
            public string Id { get; set; }
        }

        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
        private readonly DataContext _context;
            public Handler(DataContext context)
            {
                _context = context;
            }
            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var photo = await _context.Photos.FindAsync(request.Id);
                if (photo == null)
                {
                    return null;
                }

                var oldMainPhoto = await _context.Photos.FirstOrDefaultAsync(x => x.RecipeId == photo.RecipeId && x.IsMain == true);
                oldMainPhoto.IsMain = false;

                photo.IsMain = true;

                var result = await _context.SaveChangesAsync() > 0;

                if (result)
                {
                    return Result<Unit>.Success(Unit.Value);
                }

                return Result<Unit>.Failure("Cannot change main photo");
            }
        }
    }
}