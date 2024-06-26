using Application.DTOs;
using Application.Recipes;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class RecipesController : BaseApiController
    {
        [AllowAnonymous]
        [HttpGet]
        public async Task<IActionResult> GetRecipes(
            int from = 0,
            int to = 7,
            string category = "",
            string tags = "",
            string querry = ""
        )
        {
            return HandleResult(
                await Mediator.Send(
                    new List.Querry
                    {
                        From = from,
                        To = to,
                        CategoryFilter = category,
                        TagsFilter = tags,
                        SearchQuerry = querry
                    }
                )
            );
        }

        [AllowAnonymous]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetRecipe(Guid id)
        {
            return HandleResult(await Mediator.Send(new Details.Querry { Id = id }));
        }

        [AllowAnonymous]
        [HttpGet("userRecipes")]
        public async Task<IActionResult> GetRecipesByUser(string username, int from = 0, int to = 7)
        {
            return HandleResult(
                await Mediator.Send(
                    new ListByUser.Querry
                    {
                        UserName = username,
                        From = from,
                        To = to
                    }
                )
            );
        }

        [HttpGet("recommendedRecipes")]
        public async Task<IActionResult> GetRecommendedRecipes()
        {
            return HandleResult(await Mediator.Send(new Recomend.Querry()));
        }

        [HttpPost]
        public async Task<IActionResult> CreateRecipe(RecipeDetailsDTO recipe)
        {
            return HandleResult(
                await Mediator.Send(new Create.Command { RecipeDetailsDTO = recipe })
            );
        }

        [Authorize(Policy = "IsCreator")]
        [HttpPut("{id}")]
        public async Task<IActionResult> EditRecipe(Guid id, RecipeDetailsDTO recipe)
        {
            //recipe.Id = id;
            return HandleResult(
                await Mediator.Send(new Edit.Command { RecipeDetailsDTO = recipe })
            );
        }

        [Authorize(Policy = "IsCreatorOrAdministrator")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRecipe(Guid id)
        {
            return HandleResult(await Mediator.Send(new Delete.Command { Id = id }));
        }
    }
}
