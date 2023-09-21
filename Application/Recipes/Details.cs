using Application.Core;
using Application.DTOs;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Recipes
{
    public class Details
    {
        public class Querry : IRequest<Result<RecipeDTO>>
        {
            public Guid Id { get; set; }
        }

        public class Handler : IRequestHandler<Querry, Result<RecipeDTO>>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;

            public Handler(DataContext context, IMapper mapper)
            {
                _context = context;
                _mapper = mapper;
            }

            public async Task<Result<RecipeDTO>> Handle(
                Querry request,
                CancellationToken cancellationToken
            )
            {
                var comments = await _context.Comments
                    .Where(i => i.RecipeId == request.Id)
                    .ProjectTo<CommentDTO>(_mapper.ConfigurationProvider)
                    .ToListAsync();

                var ingredients = await _context.Ingredients
                    .Where(i => i.RecipeId == request.Id)
                    .ProjectTo<IngredientDTO>(_mapper.ConfigurationProvider)
                    .ToListAsync();

                var instructions = await _context.Instructions
                    .Where(i => i.RecipeId == request.Id)
                    .ProjectTo<InstructionDTO>(_mapper.ConfigurationProvider)
                    .ToListAsync();

                var recipe = await _context.Recipes
                    .Where(r => r.Id == request.Id)
                    .ProjectTo<RecipeDTO>(_mapper.ConfigurationProvider)
                    .FirstAsync();

                var tags = await _context.RecipeTags
                    .Where(t => t.RecipeId == request.Id)
                    .ProjectTo<TagDTO>(_mapper.ConfigurationProvider)
                    .ToListAsync();

                recipe.Instructions = instructions;
                recipe.Ingredients = ingredients;
                recipe.Comments = comments;
                recipe.Tags = tags;

                return Result<RecipeDTO>.Success(recipe);
            }
        }
    }
}
