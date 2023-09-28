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

    public class RecipeDetailsDTOValidator : AbstractValidator<RecipeDetailsDTO>
    {
        public RecipeDetailsDTOValidator()
        {
            RuleFor(x => x.Id).NotEmpty();
            RuleFor(x => x.Title).NotEmpty();
            RuleFor(x => x.Description).NotEmpty();
            RuleFor(x => x.Date).NotEmpty();
            RuleFor(x => x.CategoryId).NotEmpty();
            //RuleFor(x => x.Ingredients).NotEmpty();
            //RuleFor(x => x.Tags).NotEmpty();
        }
        
    }
}