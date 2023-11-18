using Application.Activity;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class ActivityController : BaseApiController
    {
        [Authorize(Policy = "IsAdministrator")]
        [HttpGet]
        public async Task<IActionResult> GetActivities(string username, int from = 0, int to = 15)
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
