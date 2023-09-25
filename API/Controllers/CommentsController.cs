using Application.Comments;
using Application.DTOs;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class CommentsController : BaseApiController
    {
        [HttpPost]
        public async Task<IActionResult> CreateRecipe(CommentDTO comment)
        {
            return HandleResult(await Mediator.Send(new Create.Command{CommentDTO = comment}));
        }
    }
}