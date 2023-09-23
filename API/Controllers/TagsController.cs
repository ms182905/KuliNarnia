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
    }
}