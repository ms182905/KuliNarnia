using Application.Core;
using Application.DTOs;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Categories
{
    public class List
    {
        public class Querry : IRequest<Result<List<CategoryDTO>>> { }

        public class Handler : IRequestHandler<Querry, Result<List<CategoryDTO>>>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;

            public Handler(DataContext context, IMapper mapper)
            {
                _context = context;
                _mapper = mapper;
            }

            public async Task<Result<List<CategoryDTO>>> Handle(
                Querry request,
                CancellationToken cancellationToken
            )
            {
                var categories = await _context.Categories
                    .Where(c => c.Name != "Unknown")
                    .ToListAsync();

                return Result<List<CategoryDTO>>.Success(
                    _mapper.Map<List<CategoryDTO>>(categories)
                );
            }
        }
    }
}
