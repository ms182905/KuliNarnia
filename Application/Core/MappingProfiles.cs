using Application.DTOs;
using AutoMapper;
using Domain;

namespace Application.Core
{
    public class MappingProfiles : Profile
    {
        public MappingProfiles()
        {
            CreateMap<Recipe, RecipeDetailsDTO>()
                .ForMember(x => x.CategoryName, o => o.MapFrom(s => s.Category.Name))
                .ForMember(x => x.CreatorName, o => o.MapFrom(s => s.Creator.DisplayName))
                .ForMember(x => x.Tags, o => o.MapFrom(s => s.RecipeTags));
            CreateMap<Recipe, RecipeDTO>()
                .ForMember(x => x.CategoryName, o => o.MapFrom(s => s.Category.Name))
                .ForMember(x => x.CreatorName, o => o.MapFrom(s => s.Creator.DisplayName));
            CreateMap<Recipe, ActivityDTO>()
                .ForMember(x => x.Type, o => o.MapFrom(s => (s.Date == s.LastModificationDate) ? "RecipeCreated" : "RecipeEdited"))
                .ForMember(x => x.Date, o => o.MapFrom(s => s.LastModificationDate))
                .ForMember(x => x.Text, o => o.MapFrom(s => ((s.Date == s.LastModificationDate) ? "Stworzono przepis: " : "Zmodyfikowano przepis: ") + s.Title))
                .ForMember(x => x.RecipeId, o => o.MapFrom(s => s.Id))
                .ForMember(x => x.UserName, o => o.MapFrom(s => s.Creator.DisplayName));
                
            CreateMap<Comment, ActivityDTO>()
                .ForMember(x => x.Type, o => o.MapFrom(s => "CommentAdded"))
                .ForMember(x => x.Date, o => o.MapFrom(s => s.Date))
                .ForMember(x => x.Text, o => o.MapFrom(s => "Dodano komentarz: " + s.Text))
                .ForMember(x => x.RecipeId, o => o.MapFrom(s => s.RecipeId))
                .ForMember(x => x.UserName, o => o.MapFrom(s => s.AppUser.DisplayName));
            CreateMap<RecipeDetailsDTO, RecipeDTO>();
            CreateMap<Instruction, InstructionDTO>();
            CreateMap<Measurement, MeasurementDTO>();
            CreateMap<Category, CategoryDTO>();
            CreateMap<Tag, TagDTO>();
            CreateMap<Photo, PhotoDTO>();
            CreateMap<Ingredient, IngredientDTO>()
                .ForMember(x => x.Measurement, o => o.MapFrom(s => s.Measurement));
            CreateMap<Comment, CommentDTO>()
                .ForMember(x => x.AppUserPhotoUrl, o => o.MapFrom(s => s.AppUser.PhotoUrl))
                .ForMember(x => x.AppUserDisplayName, o => o.MapFrom(s => s.AppUser.DisplayName));
            CreateMap<RecipeTags, TagDTO>()
                .ForMember(x => x.Name, o => o.MapFrom(s => s.Tag.Name))
                .ForMember(x => x.Id, o => o.MapFrom(s => s.TagId));
        }
    }
}
