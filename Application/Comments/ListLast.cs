using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
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
        public class Querry : IRequest<Result<List<CommentDTO>>>
        {
        }

        public class Handler : IRequestHandler<Querry, Result<List<CommentDTO>>>
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

            public async Task<Result<List<CommentDTO>>> Handle(
                Querry request,
                CancellationToken cancellationToken
            )
            {
                var user = await _context.Users.FirstOrDefaultAsync(
                    x => x.UserName == _userAccessor.GetUsername()
                );

                var comments = await _context.Comments
                    .Where(x => x.AppUserId == user.Id)
                    .Take(12)
                    .ProjectTo<CommentDTO>(_mapper.ConfigurationProvider)
                    .ToListAsync();

                return Result<List<CommentDTO>>.Success(comments);
            }
        }
    }
}