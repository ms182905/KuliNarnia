using Application.DTOs;
using Application.Recipes;
using Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class RecipesController : BaseApiController
    {
        //[AllowAnonymous]
        [HttpGet]
        public async Task<IActionResult> GetRecipes()
        {
            return HandleResult(await Mediator.Send(new List.Querry()));
        }

        [AllowAnonymous]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetRecipe(Guid id)
        {
            return HandleResult(await Mediator.Send(new Details.Querry{Id = id}));
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