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
        public async Task<IActionResult> GetRecipes(int from = 0, int to = 7)
        {
            return HandleResult(await Mediator.Send(new List.Querry{From = from, To = to}));
        }

        [AllowAnonymous]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetRecipe(Guid id)
        {
            return HandleResult(await Mediator.Send(new Details.Querry{Id = id}));
        }

        [AllowAnonymous]
        [HttpGet("userRecipes")]
        public async Task<IActionResult> GetRecipesByUser(int from = 0, int to = 7)
        {
            return HandleResult(await Mediator.Send(new ListByUser.Querry{From = from, To = to}));
        }

        [HttpPost]
        public async Task<IActionResult> CreateRecipe(RecipeDetailsDTO recipe)
        {
            return HandleResult(await Mediator.Send(new Create.Command{RecipeDetailsDTO = recipe}));
        }

        [Authorize(Policy = "IsCreator")]
        [HttpPut("{id}")]
        public async Task<IActionResult> EditRecipe(Guid id, RecipeDetailsDTO recipe)
        {
            //recipe.Id = id;
            return HandleResult(await Mediator.Send(new Edit.Command{RecipeDetailsDTO = recipe}));
        }

        [Authorize(Policy = "IsCreator")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRecipe(Guid id)
        {
            return HandleResult(await Mediator.Send(new Delete.Command{Id = id}));
        }
    }
}