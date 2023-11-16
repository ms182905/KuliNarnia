using Application.DTOs;
using Application.Tags;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class TagsController : BaseApiController
    {
        [AllowAnonymous]
        [HttpGet]
        public async Task<IActionResult> GetTags()
        {
            return HandleResult(await Mediator.Send(new List.Querry()));
        }

        //[Authorize(Roles = "Administrator")]
        [AllowAnonymous]
        [HttpPost]
        public async Task<IActionResult> CreateTag(TagDTO TagDTO)
        {
            return HandleResult(await Mediator.Send(new Create.Command { TagDTO = TagDTO }));
        }

        //[Authorize(Roles = "Administrator")]
        [AllowAnonymous]
        [HttpPut("{id}")]
        public async Task<IActionResult> EditTag(Guid id, TagDTO TagDTO)
        {
            return HandleResult(
                await Mediator.Send(new Edit.Command { TagId = id, TagDTO = TagDTO })
            );
        }

        //[Authorize(Roles = "Administrator")]
        [AllowAnonymous]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTag(Guid id)
        {
            return HandleResult(await Mediator.Send(new Delete.Command { TagId = id }));
        }
    }
}
