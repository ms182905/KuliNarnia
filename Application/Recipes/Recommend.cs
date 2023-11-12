using Application.Core;
using Application.DTOs;
using Application.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Recipes
{
    public class Recomend
    {
        public class Querry : IRequest<Result<RecipesDTO>> { }

        public class Handler : IRequestHandler<Querry, Result<RecipesDTO>>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;
            private readonly IUserAccessor _userAccessor;

            public Handler(DataContext context, IMapper mapper, IUserAccessor userAccessor)
            {
                _context = context;
                _mapper = mapper;
                _userAccessor = userAccessor;
            }

            public async Task<Result<RecipesDTO>> Handle(
                Querry request,
                CancellationToken cancellationToken
            )
            {
                var user = await _context.Users.FirstOrDefaultAsync(
                    x => x.UserName == _userAccessor.GetUsername()
                );

                var selectedRecipes = await _context.Recipes
                    .Where(
                        r =>
                            r.CreatorId != user.Id
                            && !_context.FavouriteRecipes.Any(
                                x => x.AppUserId == user.Id && x.RecipeId == r.Id
                            )
                    )
                    .ProjectTo<RecipeDetailsDTO>(_mapper.ConfigurationProvider)
                    .ToListAsync();

                var recipes = await getRecommendedRecipes(selectedRecipes, user.Id);

                var selectedRecipesToRecommend = recipes
                    .AsQueryable()
                    .ProjectTo<RecipeDTO>(_mapper.ConfigurationProvider)
                    .ToList();

                var recipesDTO = new RecipesDTO
                {
                    Recipes = selectedRecipesToRecommend,
                    Count = selectedRecipesToRecommend.Count
                };

                return Result<RecipesDTO>.Success(recipesDTO);
            }

            private async Task<List<RecipeDetailsDTO>> getRecommendedRecipes(
                List<RecipeDetailsDTO> recipes,
                string userId
            )
            {
                var categoryIds = recipes.Select(r => r.CategoryId).Distinct();
                var userSelectionStastics = await _context.UserSelectionStastics
                    .Where(u => u.UserId == userId && categoryIds.Contains(u.CategoryId))
                    .ToListAsync();

                if (userSelectionStastics == null)
                {
                    return new List<RecipeDetailsDTO>();
                }

                var sumOfTagSelections = userSelectionStastics.Sum(x => x.Counter);

                var recipeDistionary = new Dictionary<RecipeDetailsDTO, float>();
                foreach (var recipe in recipes)
                {
                    var userSelection = userSelectionStastics.Where(
                        x =>
                            x.CategoryId == recipe.CategoryId
                            && recipe.Tags.Any(t => t.Id == x.TagId)
                    );
                    recipeDistionary.Add(
                        recipe,
                        (float)userSelection.Sum(u => u.Counter) / sumOfTagSelections
                    );
                    System.Console.WriteLine(
                        (float)userSelection.Sum(u => u.Counter) / sumOfTagSelections
                    );
                }

                return recipeDistionary
                    .Where(r => r.Value > 0)
                    .OrderByDescending(r => r.Value)
                    .Select(r => r.Key)
                    .Take(7)
                    .ToList();
            }
        }
    }
}
