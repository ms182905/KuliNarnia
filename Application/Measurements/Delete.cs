using Application.Core;
using Application.DTOs;
using Domain;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Measurements
{
    public class Delete
    {
        public class Command : IRequest<Result<Unit>>
        {
            public Guid MeasurementId { get; set; }
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

                var ingredients = await _context.Ingredients
                    .Where(r => r.MeasurementId == request.MeasurementId)
                    .ToListAsync();
                if (ingredients.Count > 0)
                {
                    var unknownMeasurement = await _context.Measurements
                        .Where(c => c.Name == "Unknown")
                        .FirstAsync();
                    foreach (var ingredient in ingredients)
                    {
                        ingredient.MeasurementId = unknownMeasurement.Id;
                    }

                    var changeMeasurmentResults = await _context.SaveChangesAsync() > 0;
                    if (!changeMeasurmentResults)
                    {
                        return Result<Unit>.Failure("Failed to delete measurement");
                    }
                }

                _context.Measurements.Remove(measurement);

                var result = await _context.SaveChangesAsync() > 0;
                if (!result)
                {
                    return Result<Unit>.Failure("Failed to delete measurement");
                }

                return Result<Unit>.Success(Unit.Value);
            }
        }
    }
}
