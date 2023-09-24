using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.FavouriteRecipes;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class FavouriteRecipesController : BaseApiController
    {
        [HttpGet]
        public async Task<IActionResult> GetFavourites()
        {
            return HandleResult(await Mediator.Send(new List.Querry()));
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> AddToFavourites(Guid id)
        {
            return HandleResult(await Mediator.Send(new Add.Command{Id = id}));
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> RemoveFromFavourites(Guid id)
        {
            return HandleResult(await Mediator.Send(new Delete.Command{Id = id}));
        }
    }
}