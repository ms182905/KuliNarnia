using System.Text;
using API.Services;
using Domain;
using Infrastructure.Security;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authorization.Infrastructure;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using Persistence;

namespace API.Extensions
{
    public static class IdentityServiceExtensions
    {
        public static IServiceCollection AddIdentityServices(
            this IServiceCollection services,
            IConfiguration config
        )
        {
            services
                .AddIdentityCore<AppUser>(opt =>
                {
                    opt.Password.RequireDigit = true;
                    opt.Password.RequireLowercase = true;
                    opt.Password.RequireUppercase = true;
                    opt.Password.RequireNonAlphanumeric = true;
                    opt.Password.RequiredLength = 6;
                    opt.User.RequireUniqueEmail = true;
                })
                .AddRoles<IdentityRole>()
                .AddEntityFrameworkStores<DataContext>();

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config["TokenKey"]));

            services
                .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(opt =>
                {
                    opt.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuerSigningKey = true,
                        IssuerSigningKey = key,
                        ValidateIssuer = false,
                        ValidateAudience = false
                    };
                });

            services.AddAuthorization(opt =>
            {
                opt.AddPolicy(
                    "IsCreator",
                    policy =>
                    {
                        policy.Requirements.Add(new IsCreatorRequirement());
                    }
                );
                opt.AddPolicy(
                    "IsCreatorOrAdministrator",
                    policy =>
                    {
                        policy.Requirements.Add(new IsCreatorOrAdministratorRequirement());
                    }
                );
                opt.AddPolicy(
                    "IsAdministrator",
                    policy =>
                    {
                        policy.Requirements.Add(new IsAdministratorRequirement());
                    }
                );
            });

            services.AddTransient<IAuthorizationHandler, IsCreatorRequirementHandler>();
            services.AddTransient<IAuthorizationHandler, IsCreatorOrAdministratorRequirementHandler>();
            services.AddTransient<IAuthorizationHandler, IsAdministratorRequirementHandler>();
            services.AddScoped<TokenService>();

            return services;
        }
    }
}
