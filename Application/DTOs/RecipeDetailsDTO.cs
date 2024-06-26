using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain;

namespace Application.DTOs
{
    public class RecipeDetailsDTO
    {
        public Guid Id { get; set; }
        public string Title { get; set; }
        public DateTime Date { get; set; }
        public string CategoryName { get; set; }
        public Guid CategoryId { get; set; }
        public string Description { get; set; }
        public string CreatorName { get; set; }
        public string CreatorId { get; set; }
        public bool InFavourites { get; set; }
        public ICollection<IngredientDTO> Ingredients { get; set; }
        public ICollection<TagDTO> Tags { get; set; }
        public ICollection<CommentDTO> Comments { get; set; }
        public ICollection<InstructionDTO> Instructions { get; set; }
        public ICollection<PhotoDTO> Photos { get; set; }
    }
}
