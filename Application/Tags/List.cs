using Application.Core;
using Application.DTOs;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Tags
{
    public class List
    {
        public class Querry : IRequest<Result<List<TagDTO>>> { }

        public class Handler : IRequestHandler<Querry, Result<List<TagDTO>>>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;

            public Handler(DataContext context, IMapper mapper)
            {
                _context = context;
                _mapper = mapper;
            }

            public async Task<Result<List<TagDTO>>> Handle(
                Querry request,
                CancellationToken cancellationToken
            )
            {
                var tags = await _context.Tags.ToListAsync();

                return Result<List<TagDTO>>.Success(_mapper.Map<List<TagDTO>>(tags));
            }
        }
    }
}
