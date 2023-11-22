namespace Application.DTOs
{
    public class CommentDTO
    {
        public Guid Id { get; set; }
        public string Text { get; set; }
        public DateTime Date { get; set; }
        public string AppUserId { get; set; }
        public string AppUserDisplayName { get; set; }
        public string AppUserPhotoUrl { get; set; }
        public Guid RecipeId { get; set; }
    }
}