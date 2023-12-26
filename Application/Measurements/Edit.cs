using Application.Core;
using Application.DTOs;
using FluentValidation;
using MediatR;
using Persistence;

namespace Application.Measurements
{
    public class Edit
    {
        public class Command : IRequest<Result<Unit>>
        {
            public Guid MeasurementId { get; set; }
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
                var measurement = await _context.Measurements.FindAsync(request.MeasurementId);
                if (measurement == null)
                {
                    return null;
                }

                measurement.Name = request.MeasurementDTO.Name;

                var result = await _context.SaveChangesAsync() > 0;
                if (!result)
                {
                    return Result<Unit>.Failure("Failed to update measurement");
                }

                return Result<Unit>.Success(Unit.Value);
            }
        }
    }
}
