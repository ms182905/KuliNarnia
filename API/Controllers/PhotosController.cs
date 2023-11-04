using Application.Photos;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class PhotosController : BaseApiController
    {
        [HttpPost("{id}")]
        public async Task<IActionResult> Add(Guid id, IFormFile File)
        {
            return HandleResult(await Mediator.Send(new Add.Command { File = File, Id = id }));
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            return HandleResult(await Mediator.Send(new Delete.Command { Id = id }));
        }

        [HttpPost("{id}/setMain")]
        public async Task<IActionResult> SetMain(string id)
        {
            return HandleResult(await Mediator.Send(new SetMain.Command { Id = id }));
        }
    }
}
