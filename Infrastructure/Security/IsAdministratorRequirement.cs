using System.Security.Claims;
using Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Infrastructure.Security
{
    public class IsAdministratorRequirement : IAuthorizationRequirement { }

    public class IsAdministratorRequirementHandler
        : AuthorizationHandler<IsAdministratorRequirement>
    {
        private readonly DataContext _dbContext;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly UserManager<AppUser> _userManager;

        public IsAdministratorRequirementHandler(
            DataContext dbContext,
            IHttpContextAccessor httpContextAccessor,
            UserManager<AppUser> userManager
        )
        {
            _httpContextAccessor = httpContextAccessor;
            _dbContext = dbContext;
            _userManager = userManager;
        }

        protected override Task HandleRequirementAsync(
            AuthorizationHandlerContext context,
            IsAdministratorRequirement requirement
        )
        {
            var userId = context.User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (userId == null)
            {
                return Task.CompletedTask;
            }

            var user = _userManager.FindByIdAsync(userId).Result;

            if (user == null)
            {
                return Task.CompletedTask;
            }

            var roles = _userManager.GetRolesAsync(user).Result;

            if (roles.Contains("Administrator"))
            {
                context.Succeed(requirement);
            }

            return Task.CompletedTask;
        }
    }
}
