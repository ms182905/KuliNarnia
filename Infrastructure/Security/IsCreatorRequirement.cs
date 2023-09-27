using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Infrastructure.Security
{
    public class IsCreatorRequirement : IAuthorizationRequirement { }

    public class IsCreatorRequirementHandler : AuthorizationHandler<IsCreatorRequirement>
    {
        private readonly DataContext _dbContext;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public IsCreatorRequirementHandler(
            DataContext dbContext,
            IHttpContextAccessor httpContextAccessor
        )
        {
            _httpContextAccessor = httpContextAccessor;
            _dbContext = dbContext;
        }

        protected override Task HandleRequirementAsync(
            AuthorizationHandlerContext context,
            IsCreatorRequirement requirement
        )
        {
            var userId = context.User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (userId == null)
            {
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
