using Application.DTOs;
using FluentValidation;

namespace Application.UserSelection
{
    public class UserSelectionPointValidator : AbstractValidator<UserSelectionPoint>
    {
        public UserSelectionPointValidator()
        {
            RuleFor(x => x.CategoryId).NotEmpty();
            RuleFor(x => x.TagIds).NotEmpty();
        }
    }
}
