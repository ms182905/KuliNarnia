namespace Domain
{
    public class Ingredient
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public double Amount { get; set; }
        public Guid RecipeId { get; set; }
        public Recipe Recipe { get; set; }
        public Guid MeasurementId { get; set; }
        public Measurement Measurement { get; set; }
        public Guid CategoryId { get; set; }
        public Category Category { get; set; }
    }
}