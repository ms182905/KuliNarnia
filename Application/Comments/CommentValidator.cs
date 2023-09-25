using Application.DTOs;
using FluentValidation;

namespace Application.Comments
{
    public class CommentDTOValidator : AbstractValidator<CommentDTO>
    {
        public CommentDTOValidator()
        {
            RuleFor(x => x.Id).NotEmpty();
            RuleFor(x => x.Text).NotEmpty();
            RuleFor(x => x.Date).NotEmpty();
            RuleFor(x => x.RecipeId).NotEmpty();
        }
    }
}
