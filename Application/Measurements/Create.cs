using Application.Core;
using Application.DTOs;
using Domain;
using FluentValidation;
using MediatR;
using Persistence;

namespace Application.Measurements
{
    public class Create
    {
        public class Command : IRequest<Result<Unit>>
        {
            public MeasurementDTO MeasurementDTO { get; set; }
        }

        public class CommandValidator : AbstractValidator<Command>
        {
            public CommandValidator()
            {
                // RuleFor(x => x.RecipeDetailsDTO).SetValidator(new RecipeDetailsDTOValidator());
            }
        }

        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            private readonly DataContext _context;

            public Handler(DataContext context)
            {
                _context = context;
            }

            public async Task<Result<Unit>> Handle(
                Command request,
                CancellationToken cancellationToken
            )
            {
                var measurement = new Measurement
                {
                    Id = request.MeasurementDTO.Id,
                    Name = request.MeasurementDTO.Name
                };

                await _context.Measurements.AddAsync(measurement);

                var result = await _context.SaveChangesAsync() > 0;
                if (!result)
                {
                    return Result<Unit>.Failure("Failed to create measurement");
                }

                return Result<Unit>.Success(Unit.Value);
            }
        }
    }
}
