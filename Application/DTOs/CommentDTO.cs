namespace Application.DTOs
{
    public class CommentDTO
    {
        public string Text { get; set; }
        public DateTime Date { get; set; }
        public string AppUserId { get; set; }
        public string AppUserDisplayName { get; set; }
    }
}