using Application.DTOs;
using Domain;
using FluentValidation;

namespace Application.Recipes
{
    public class RecipeValidator : AbstractValidator<Recipe>
    {
        public RecipeValidator()
        {
            RuleFor(x => x.Title).NotEmpty();
            RuleFor(x => x.Description).NotEmpty();
            RuleFor(x => x.Date).NotEmpty();
            RuleFor(x => x.Category).NotEmpty();
        }
    }

    public class RecipeDTOValidator : AbstractValidator<RecipeDTO>
    {
        public RecipeDTOValidator()
        {
            RuleFor(x => x.Title).NotEmpty();
            RuleFor(x => x.Description).NotEmpty();
            RuleFor(x => x.Date).NotEmpty();
            RuleFor(x => x.CategoryName).NotEmpty();
        }
        
    }
}