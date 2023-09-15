using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Domain
{
    public class RecipeTags
    {
        public Guid TagId { get; set; }
        public Tag Tag { get; set; }
        public Guid RecipeId { get; set; }
        public Recipe Recipe { get; set; }
    }
}