using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Application.DTOs
{
    public class InstructionDTO
    {
        public Guid Id { get; set; }
        public string Text { get; set; }
        public int Position { get; set; }
    }
}