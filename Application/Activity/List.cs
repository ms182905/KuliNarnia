using Application.Core;
using Application.DTOs;
using Application.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Persistence;

namespace Application.Activity
{
    public class List
    {
        public class Querry : IRequest<Result<ActivitiesDTO>>
        {
            public string UserName { get; set; }
            public int From { get; set; }
            public int To { get; set; }
        }

        public class Handler : IRequestHandler<Querry, Result<ActivitiesDTO>>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;

            public Handler(DataContext context, IMapper mapper)
            {
                _context = context;
                _mapper = mapper;
            }

            public async Task<Result<ActivitiesDTO>> Handle(
                Querry request,
                CancellationToken cancellationToken
            )
            {
                IQueryable<Recipe> recipeQuery = _context.Recipes;
                IQueryable<Comment> commentQuerry = _context.Comments;

                if (!string.IsNullOrEmpty(request.UserName))
                {
                    var creatorId = await _context.Users
                        .Where(x => x.UserName == request.UserName)
                        .Select(x => x.Id)
                        .FirstOrDefaultAsync(cancellationToken: cancellationToken);

                    recipeQuery = recipeQuery.Where(recipe => recipe.CreatorId == creatorId);
                    commentQuerry = commentQuerry.Where(comment => comment.AppUserId == creatorId);
                }
                var recipes = await recipeQuery
                    .ProjectTo<ActivityDTO>(_mapper.ConfigurationProvider)
                    .ToListAsync(cancellationToken: cancellationToken);

                var comments = await commentQuerry
                    .ProjectTo<ActivityDTO>(_mapper.ConfigurationProvider)
                    .ToListAsync(cancellationToken: cancellationToken);

                var activities = recipes.Concat(comments).ToList();

                int activitiesNumber = activities.Count;

                var selectedActivities = activities
                    .OrderByDescending(r => r.Date)
                    .Skip(request.From)
                    .Take(request.To - request.From)
                    .ToList();

                var activitiesDTO = new ActivitiesDTO
                {
                    Activities = selectedActivities,
                    Count = activitiesNumber
                };

                return Result<ActivitiesDTO>.Success(activitiesDTO);
            }
        }
    }
}
