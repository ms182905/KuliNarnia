using Application.Core;
using Application.Interfaces;
using Domain;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;
using Application.DTOs;

namespace Application.UserSelection
{
    public class Update
    {
        public class Command : IRequest<Result<Unit>>
        {
            public UserSelectionPoint UserSelectionPoint { get; set; }
        }

        public class CommandValidator : AbstractValidator<Command> 
        {
            public CommandValidator()
            {
                RuleFor(x => x.UserSelectionPoint).SetValidator(new UserSelectionPointValidator());
            }
        }

        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
        private readonly DataContext _context;
        private readonly IUserAccessor _userAccessor;
            public Handler(DataContext context, IUserAccessor userAccessor)
            {
                _context = context;
                _userAccessor = userAccessor;
            }

            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var user = await _context.Users.FirstOrDefaultAsync(x => x.UserName == _userAccessor.GetUsername());
                var userSelection = await _context.UserSelectionStastics.FirstOrDefaultAsync(x => x.UserId == user.Id && x.CategoryId == request.UserSelectionPoint.CategoryId && x.TagId == request.UserSelectionPoint.TagId);

                if (userSelection != null)
                {
                    userSelection.Counter++;
                }
                else
                {
                    var newUserSelection = new UserSelectionStastic
                    {
                        UserId = user.Id,
                        CategoryId = request.UserSelectionPoint.CategoryId,
                        TagId = request.UserSelectionPoint.TagId,
                        Counter = 1
                    };

                    await _context.UserSelectionStastics.AddAsync(newUserSelection);
                }

                var result = await _context.SaveChangesAsync() > 0;

                if (!result)
                {
                    return Result<Unit>.Failure("Failed to update UserSelections");
                }
                else
                {
                    return Result<Unit>.Success(Unit.Value);
                }
            }
        }
    }
}