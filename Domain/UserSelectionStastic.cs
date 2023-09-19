using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Domain
{
    public class UserSelectionStastic
    {
        public int Counter { get; set; }
        public AppUser User { get; set; }
        public string UserId { get; set; }
        public Category Category { get; set; }
        public Guid CategoryId { get; set; }
        public Tag Tag { get; set; }
        public Guid TagId { get; set; }
    }
}