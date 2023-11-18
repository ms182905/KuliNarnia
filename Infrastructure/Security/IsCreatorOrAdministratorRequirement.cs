using System.Security.Claims;
using Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Infrastructure.Security
{
    public class IsCreatorOrAdministratorRequirement : IAuthorizationRequirement { }

    public class IsCreatorOrAdministratorRequirementHandler
        : AuthorizationHandler<IsCreatorOrAdministratorRequirement>
    {
        private readonly DataContext _dbContext;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly UserManager<AppUser> _userManager;

        public IsCreatorOrAdministratorRequirementHandler(
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
            IsCreatorOrAdministratorRequirement requirement
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
                return Task.CompletedTask;
            }

            var recipeId = Guid.Parse(
                _httpContextAccessor.HttpContext?.Request.RouteValues
                    .SingleOrDefault(x => x.Key == "id")
                    .Value?.ToString()
            );

            var recipe = _dbContext.Recipes
                .AsNoTracking()
                .SingleOrDefaultAsync(x => x.Id == recipeId)
                .Result;

            if (recipe == null)
            {
                return Task.CompletedTask;
            }

            if (recipe.CreatorId == userId)
            {
                context.Succeed(requirement);
            }

            return Task.CompletedTask;
        }
    }
}
