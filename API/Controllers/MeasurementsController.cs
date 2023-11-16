using Application.DTOs;
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

        //[Authorize(Roles = "Administrator")]
        [AllowAnonymous]
        [HttpPost]
        public async Task<IActionResult> CreateMeasurement(MeasurementDTO MeasurementDTO)
        {
            return HandleResult(
                await Mediator.Send(new Create.Command { MeasurementDTO = MeasurementDTO })
            );
        }

        //[Authorize(Roles = "Administrator")]
        [AllowAnonymous]
        [HttpPut("{id}")]
        public async Task<IActionResult> EditMeasurement(Guid id, MeasurementDTO MeasurementDTO)
        {
            return HandleResult(
                await Mediator.Send(
                    new Edit.Command { MeasurementId = id, MeasurementDTO = MeasurementDTO }
                )
            );
        }

        //[Authorize(Roles = "Administrator")]
        [AllowAnonymous]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMeasurement(Guid id)
        {
            return HandleResult(await Mediator.Send(new Delete.Command { MeasurementId = id }));
        }
    }
}
