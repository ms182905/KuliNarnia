using Application.Activity;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class ActivityController : BaseApiController
    {
        [Authorize(Roles = "Administrator")]
        [HttpGet]
        public async Task<IActionResult> GetCategories(string username, int from = 0, int to = 15)
        {
            return HandleResult(
                await Mediator.Send(
                    new List.Querry
                    {
                        UserName = username,
                        From = from,
                        To = to
                    }
                )
            );
        }
    }
}
