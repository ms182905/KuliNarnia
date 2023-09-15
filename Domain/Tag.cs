namespace Domain
{
    public class Tag
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public ICollection<RecipeTags> RecipeTags { get; set; }
    }
}