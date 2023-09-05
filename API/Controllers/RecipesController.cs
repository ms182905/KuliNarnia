using Application.Recipes;
using Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class RecipesController : BaseApiController
    {
        [HttpGet]
        public async Task<IActionResult> GetRecipes()
        {
            return HandleResult(await Mediator.Send(new List.Querry()));
        }

        [Authorize]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetRecipe(Guid id)
        {
            return HandleResult<Recipe>(await Mediator.Send(new Details.Querry{Id = id}));
        }

        [HttpPost]
        public async Task<IActionResult> CreateRecipe(Recipe recipe)
        {
            return HandleResult(await Mediator.Send(new Create.Command{Recipe = recipe}));
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> EditRecipe(Guid id, Recipe recipe)
        {
            recipe.Id = id;
            return HandleResult(await Mediator.Send(new Edit.Command{Recipe = recipe}));
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRecipe(Guid id)
        {
            return HandleResult(await Mediator.Send(new Delete.Command{Id = id}));
        }
    }
}