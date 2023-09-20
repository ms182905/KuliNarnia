using Application.Core;
using Application.Interfaces;
using Domain;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;
using Application.DTOs;

namespace Application.Recipes
{
    public class Create
    {
        public class Command : IRequest<Result<Unit>>
        {
            public RecipeDTO RecipeDTO { get; set; }
        }

        public class CommandValidator : AbstractValidator<Command> 
        {
            public CommandValidator()
            {
                //RuleFor(x => x.Recipe).SetValidator(new RecipeValidator());
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
                var category = await _context.Categories.FirstOrDefaultAsync(x => x.Name == request.RecipeDTO.CategoryName);

                // @TODO
                // Add automapper

                var recipe = new Recipe
                {
                    Id = request.RecipeDTO.Id,
                    Title = request.RecipeDTO.Title,
                    Description = request.RecipeDTO.Description,
                    Creator = user,
                    Category = category,
                };

                _context.Recipes.Add(recipe);

                var result = await _context.SaveChangesAsync() > 0;

                if (!result)
                {
                    return Result<Unit>.Failure("Failed to create recipe");
                }
                else
                {
                    return Result<Unit>.Success(Unit.Value);
                }
            }
        }
    }
}