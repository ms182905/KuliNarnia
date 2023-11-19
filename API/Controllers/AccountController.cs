using System.Security.Claims;
using API.DTOs;
using API.Services;
using Application.Core;
using Application.Interfaces;
using Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AccountController : ControllerBase
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly TokenService _tokenService;
        private readonly DataContext _context;
        private readonly IPhotoAccessor _photoAccessor;

        public AccountController(
            UserManager<AppUser> userManager,
            RoleManager<IdentityRole> roleManager,
            TokenService tokenService,
            DataContext context,
            IPhotoAccessor photoAccessor
        )
        {
            _tokenService = tokenService;
            _roleManager = roleManager;
            _userManager = userManager;
            _context = context;
            _photoAccessor = photoAccessor;
        }

        [AllowAnonymous]
        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
        {
            var user = await _userManager.FindByEmailAsync(loginDto.Email);

            if (user == null)
            {
                return Unauthorized();
            }

            // await _roleManager.CreateAsync(new IdentityRole("Administrator"));

            // await _userManager.AddToRoleAsync(user, "PortalUser");

            // await _userManager.DeleteAsync(user);
            // return Unauthorized();

            var result = await _userManager.CheckPasswordAsync(user, loginDto.Password);

            if (result)
            {
                return await CreateUserObject(user);
            }

            return Unauthorized();
        }

        [AllowAnonymous]
        [HttpPost("register")]
        public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto)
        {
            if (await _userManager.Users.AnyAsync(x => x.UserName == registerDto.Username))
            {
                ModelState.AddModelError("username", "Username taken");
                return ValidationProblem();
            }

            if (await _userManager.Users.AnyAsync(x => x.Email == registerDto.Email))
            {
                ModelState.AddModelError("email", "Email taken");
                return ValidationProblem();
            }

            var user = new AppUser
            {
                DisplayName = registerDto.DisplayName,
                Email = registerDto.Email,
                UserName = registerDto.Username
            };

            var result = await _userManager.CreateAsync(user, registerDto.Password);

            if (result.Succeeded)
            {
                await _userManager.AddToRoleAsync(user, "PortalUser");
                return await CreateUserObject(user);
            }

            return BadRequest(result.Errors);
        }

        [Authorize(Policy = "IsAdministrator")]
        [HttpGet("usernames")]
        public async Task<ActionResult<List<string>>> GetUsernames()
        {
            var users = await _userManager.Users.Select(u => u.UserName).ToListAsync();
            return Ok(users);
        }

        [Authorize(Policy = "IsAdministrator")]
        [HttpDelete("{userName}")]
        public async Task<IActionResult> DeleteUser(string userName)
        {
            var user = await _userManager.FindByNameAsync(userName);

            if (user == null)
            {
                return NotFound();
            }

            var comments = await _context.Comments.Where(c => c.AppUserId == user.Id).ToListAsync();
            var selectionStatistics = await _context.UserSelectionStastics
                .Where(c => c.UserId == user.Id)
                .ToListAsync();
            var favourites = await _context.FavouriteRecipes
                .Where(c => c.AppUserId == user.Id)
                .ToListAsync();
            var recipes = await _context.Recipes.Where(c => c.CreatorId == user.Id).ToListAsync();
            var photos = await _context.Photos.Where(c => recipes.Any(r => r.Id == c.RecipeId)).ToListAsync();
            var photoIds = photos.Select(p => p.Id).ToList();

            if (user.PhotoId != null)
            {
                photoIds.Add(user.PhotoId);
            }

            foreach (var photoId in photoIds)
            {
                var photoDeletingResult = await _photoAccessor.DeletePhoto(photoId);

                if (photoDeletingResult == null)
                {
                    return BadRequest("Problem deleting photo");
                }
            }

            _context.Comments.RemoveRange(comments);
            _context.UserSelectionStastics.RemoveRange(selectionStatistics);
            _context.FavouriteRecipes.RemoveRange(favourites);
            _context.Photos.RemoveRange(photos);
            _context.Recipes.RemoveRange(recipes);

            var result = await _context.SaveChangesAsync() > 0;
            if (!result)
            {
                return BadRequest("Failed to delete user data");
            }

            _context.Users.Remove(user);
            result = await _context.SaveChangesAsync() > 0;
            if (!result)
            {
                return BadRequest("Failed to delete user");
            }

            return Ok();
        }

        [Authorize]
        [HttpGet]
        public async Task<ActionResult<UserDto>> GetCurrentUser()
        {
            var user = await _userManager.FindByEmailAsync(User.FindFirstValue(ClaimTypes.Email));

            return await CreateUserObject(user);
        }

        [AllowAnonymous]
        [HttpGet("profilePhoto/{userName}")]
        public async Task<ActionResult<string>> GetUserPhotoUrl(string userName)
        {
            var user = await _userManager.FindByNameAsync(userName);

            return user.PhotoUrl;
        }

        private async Task<UserDto> CreateUserObject(AppUser user)
        {
            var roles = await _userManager.GetRolesAsync(user);
            var role = roles.FirstOrDefault();

            return new UserDto
            {
                DisplayName = user.DisplayName,
                Image = null,
                Token = _tokenService.CreateToken(user),
                Username = user.UserName,
                Role = role,
                PhotoUrl = user.PhotoUrl
            };
        }
    }
}
