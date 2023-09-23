using Application.DTOs;
using AutoMapper;
using Domain;

namespace Application.Core
{
    public class MappingProfiles : Profile
    {
        public MappingProfiles()
        {
            CreateMap<Recipe, RecipeDTO>()
                .ForMember(x => x.Id, o => o.MapFrom(s => s.Id))
                .ForMember(x => x.CategoryName, o => o.MapFrom(s => s.Category.Name))
                .ForMember(x => x.CreatorName, o => o.MapFrom(s => s.Creator.DisplayName));
            CreateMap<Instruction, InstructionDTO>();
            CreateMap<Category, CategoryDTO>();
            CreateMap<Ingredient, IngredientDTO>()
                .ForMember(x => x.MeasurementName, o => o.MapFrom(s => s.Measurement.Name));
            CreateMap<Comment, CommentDTO>()
                .ForMember(x => x.AppUserDisplayName, o => o.MapFrom(s => s.AppUser.DisplayName));
            CreateMap<RecipeTags, TagDTO>()
                .ForMember(x => x.Name, o => o.MapFrom(s => s.Tag.Name));
        }
    }
}
