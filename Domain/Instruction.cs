namespace Domain
{
    public class Instruction
    {
        public Guid Id { get; set; }
        public string Text { get; set; }
        public int Position { get; set; }
        public Guid RecipeId { get; set; }
        public Recipe Recipe { get; set; }
    }
}