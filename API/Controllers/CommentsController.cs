using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Comments;
using Application.DTOs;
using Microsoft.AspNetCore.Authorization;
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