using Application.Core;
using Application.DTOs;
using Application.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Comments
{
    public class ListLast
    {
        public class Querry : IRequest<Result<CommentsDTO>>
        {
            public string UserName { get; set; }
        }

        public class Handler : IRequestHandler<Querry, Result<CommentsDTO>>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;

            public Handler(DataContext context, IMapper mapper)
            {
                _context = context;
                _mapper = mapper;
            }

            public async Task<Result<CommentsDTO>> Handle(
                Querry request,
                CancellationToken cancellationToken
            )
            {
                var user = await _context.Users.FirstOrDefaultAsync(
                    x => x.DisplayName == request.UserName
                );

                if (user == null)
                {
                    user = await _context.Users.FirstOrDefaultAsync(
                        x => x.UserName == request.UserName);

                    if (user == null)
                    {
                        return null;
                    }
                }

                var comments = await _context.Comments
                    .Where(x => x.AppUserId == user.Id)
                    .OrderByDescending(c => c.Date)
                    .ToListAsync();

                var numberOfComments = comments.Count;

                var lastComments = comments
                    .AsQueryable()
                    .Take(12)
                    .ProjectTo<CommentDTO>(_mapper.ConfigurationProvider)
                    .ToList();

                var commentsDTO = new CommentsDTO
                {
                    Comments = lastComments,
                    Count = numberOfComments
                };

                return Result<CommentsDTO>.Success(commentsDTO);
            }
        }
    }
}
