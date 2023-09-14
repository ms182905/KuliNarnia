namespace Domain
{
    public class Measurement
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public ICollection<Ingredient> Ingredients { get; set; }
    }
}