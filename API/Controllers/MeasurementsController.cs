using Application.Measurements;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class MeasurementsController : BaseApiController
    {
        [AllowAnonymous]
        [HttpGet]
        public async Task<IActionResult> GetMeasurements()
        {
            return HandleResult(await Mediator.Send(new List.Querry()));
        }
    }
}