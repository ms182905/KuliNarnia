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
                .ForMember(x => x.Category, o => o.MapFrom(s => s.Category.Name))
                .ForMember(x => x.CreatorName, o => o.MapFrom(s => s.Creator.DisplayName));
            CreateMap<Instruction, InstructionDTO>();
        }
    }
}