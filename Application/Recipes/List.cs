using Application.Core;
using Application.DTOs;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Recipes
{
    public class List
    {
        public class Querry : IRequest<Result<RecipesDTO>>
        {
            public int From { get; set; }
            public int To { get; set; }
            public string CategoryFilter { get; set; }
            public string TagsFilter { get; set; }
            public string SearchQuerry { get; set; }
        }

        public class Handler : IRequestHandler<Querry, Result<RecipesDTO>>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;

            public Handler(DataContext context, IMapper mapper)
            {
                _context = context;
                _mapper = mapper;
            }

            public async Task<Result<RecipesDTO>> Handle(
                Querry request,
                CancellationToken cancellationToken
            )
            {
                System.Console.WriteLine("-------------------------");
                System.Console.WriteLine(request.CategoryFilter);
                System.Console.WriteLine(request.TagsFilter);
                System.Console.WriteLine(request.SearchQuerry);

                var recipes = await _context.Recipes
                    .Skip(request.From)
                    .Take(request.To - request.From)
                    .ProjectTo<RecipeDTO>(_mapper.ConfigurationProvider)
                    .ToListAsync();
                var recipesNumber = await _context.Recipes.CountAsync();

                foreach (var recipe in recipes)
                {
                    var photo = await _context.Photos.FirstOrDefaultAsync(
                        x => x.RecipeId == recipe.Id
                    );
                    if (photo == null)
                    {
                        continue;
                    }
                    recipe.Photo = new PhotoDTO
                    {
                        Id = photo.Id,
                        IsMain = true,
                        Url = photo.Url
                    };
                }

                var recipesDTO = new RecipesDTO { Recipes = recipes, Count = recipesNumber };

                return Result<RecipesDTO>.Success(recipesDTO);
            }
        }
    }
}
