using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.DTOs;
using Application.UserSelection;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class UserSelectionController : BaseApiController
    {
        [HttpPost()]
        public async Task<IActionResult> UpdateUserSelection(UserSelectionPoint userSelectionPoint)
        {
            return HandleResult(await Mediator.Send(new Update.Command{UserSelectionPoint = userSelectionPoint}));
        }
    }
}