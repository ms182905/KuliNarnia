using Application.Core;
using Application.DTOs;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Measurements
{
    public class List
    {
        public class Querry : IRequest<Result<List<MeasurementDTO>>> { }

        public class Handler : IRequestHandler<Querry, Result<List<MeasurementDTO>>>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;

            public Handler(DataContext context, IMapper mapper)
            {
                _context = context;
                _mapper = mapper;
            }

            public async Task<Result<List<MeasurementDTO>>> Handle(
                Querry request,
                CancellationToken cancellationToken
            )
            {
                var measurements = await _context.Measurements
                    .Where(c => c.Name != "Unknown")
                    .ToListAsync();

                return Result<List<MeasurementDTO>>.Success(
                    _mapper.Map<List<MeasurementDTO>>(measurements)
                );
            }
        }
    }
}
