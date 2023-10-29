using Application.Core;
using Application.DTOs;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
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
                var categoryToFilter = Uri.UnescapeDataString(request.CategoryFilter);
                var searchQuerry = Uri.UnescapeDataString(request.SearchQuerry).ToLower();
                List<string> tagsToFilter = request.TagsFilter
                    .Split(new char[] { ' ' }, StringSplitOptions.RemoveEmptyEntries)
                    .ToList();

                var tagIdsToFilter = tagsToFilter.Select(tag => tag).ToList();

                var recipesQuery = _context.Recipes.Where(
                    r =>
                        (
                            categoryToFilter.IsNullOrEmpty()
                            || r.CategoryId.ToString() == categoryToFilter
                        )
                        && (
                            tagsToFilter.IsNullOrEmpty()
                            || r.RecipeTags.Any(rt => tagIdsToFilter.Contains(rt.TagId.ToString()))
                        )
                        && (
                            searchQuerry.IsNullOrEmpty()
                            || r.Title.ToLower().Contains(searchQuerry)
                            || r.Ingredients.Any(i => i.Name.ToLower().Contains(searchQuerry))
                        )
                );

                int recipesNumber = recipesQuery.Count();

                var recipes = await recipesQuery
                    .Skip(request.From)
                    .Take(request.To - request.From)
                    .ProjectTo<RecipeDTO>(_mapper.ConfigurationProvider)
                    .ToListAsync(cancellationToken: cancellationToken);

                foreach (var recipe in recipes)
                {
                    var photo = await _context.Photos.FirstOrDefaultAsync(
                        x => x.RecipeId == recipe.Id,
                        cancellationToken: cancellationToken
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
