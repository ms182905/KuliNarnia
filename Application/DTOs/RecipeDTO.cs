using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain;

namespace Application.DTOs
{
    public class RecipeDTO
    {
        public Guid Id { get; set; }
        public string Title { get; set; }
        public DateTime Date { get; set; }
        public string CategoryName { get; set; }
        public Guid CategoryId { get; set; }
        public ICollection<TagDTO> Tags { get; set; }
        public string Description { get; set; }
        public string CreatorName { get; set; }
        public string CreatorId { get; set; }
        public ICollection<PhotoDTO> Photos { get; set; }
    }
}
