using AutoMapper;
using Domain;
using MediatR;
using Persistence;

namespace Application.Recipes
{
    public class Edit
    {
        public class Command : IRequest
        {
            public Recipe Recipe { get; set; }
        }

        public class Handler : IRequestHandler<Command>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;
            public Handler(DataContext context, IMapper mapper)
            {
                _mapper = mapper;
                _context = context;
            }

            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {
                var recipe = await _context.Recipes.FindAsync(request.Recipe.Id);

                _mapper.Map(request.Recipe, recipe);

                await _context.SaveChangesAsync();
                
                return Unit.Value;
            }
        }
    }
}