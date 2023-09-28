using Application.Photos;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class PhotosController : BaseApiController
    {
        [HttpPost("{id}")]
        public async Task<IActionResult> Add(Guid id, IFormFile File)
        {
            return HandleResult(await Mediator.Send(new Add.Command{File = File, Id = id}));
        }
    }
}