namespace Domain
{
    public class Comment
    {
        public string Text { get; set; }
        public DateTime Date { get; set; }
        public string AppUserId { get; set; }
        public AppUser AppUser { get; set; }
        public Guid RecipeId { get; set; }
        public Recipe Recipe { get; set; }
    }
}