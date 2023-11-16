using Application.Categories;
using Application.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class CategoriesController : BaseApiController
    {
        [AllowAnonymous]
        [HttpGet]
        public async Task<IActionResult> GetCategories()
        {
            return HandleResult(await Mediator.Send(new List.Querry()));
        }

        //[Authorize(Roles = "Administrator")]
        [AllowAnonymous]
        [HttpPost]
        public async Task<IActionResult> CreateCategory(CategoryDTO categoryDTO)
        {
            return HandleResult(
                await Mediator.Send(new Create.Command { CategoryDTO = categoryDTO })
            );
        }

        //[Authorize(Roles = "Administrator")]
        [AllowAnonymous]
        [HttpPut("{id}")]
        public async Task<IActionResult> EditCategory(Guid id, CategoryDTO categoryDTO)
        {
            return HandleResult(
                await Mediator.Send(new Edit.Command { CategoryId = id, CategoryDTO = categoryDTO })
            );
        }

        //[Authorize(Roles = "Administrator")]
        [AllowAnonymous]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCategory(Guid id)
        {
            return HandleResult(await Mediator.Send(new Delete.Command { CategoryId = id }));
        }
    }
}
