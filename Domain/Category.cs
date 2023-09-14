using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Domain
{
    public class Category
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public ICollection<Recipe> Recipes { get; set; }
    }
}