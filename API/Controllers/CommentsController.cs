using Application.Comments;
using Application.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class CommentsController : BaseApiController
    {
        [HttpPost]
        public async Task<IActionResult> CreateComment(CommentDTO comment)
        {
            return HandleResult(await Mediator.Send(new Create.Command { CommentDTO = comment }));
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            return HandleResult(await Mediator.Send(new Delete.Command { Id = id }));
        }

        [AllowAnonymous]
        [HttpGet("userComments/{username}")]
        public async Task<IActionResult> GetLast(string username)
        {
            return HandleResult(await Mediator.Send(new ListLast.Querry { UserName = username }));
        }
    }
}
