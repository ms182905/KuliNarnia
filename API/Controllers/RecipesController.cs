using Application.DTOs;
using Application.Recipes;
using Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class RecipesController : BaseApiController
    {
        [AllowAnonymous]
        [HttpGet]
        public async Task<IActionResult> GetRecipes()
        {
            return HandleResult(await Mediator.Send(new List.Querry()));
        }

        [AllowAnonymous]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetRecipe(Guid id)
        {
            return HandleResult<Recipe>(await Mediator.Send(new Details.Querry{Id = id}));
        }

        [HttpPost]
        public async Task<IActionResult> CreateRecipe(RecipeDTO recipe)
        {
            return HandleResult(await Mediator.Send(new Create.Command{RecipeDTO = recipe}));
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