using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Application.DTOs
{
    public class IngredientDTO
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public double Amount { get; set; }
        public MeasurementDTO Measurement { get; set; }
    }
}