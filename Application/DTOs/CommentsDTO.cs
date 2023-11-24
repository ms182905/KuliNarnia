namespace Application.DTOs
{
    public class CommentsDTO
    {
        public ICollection<CommentDTO> Comments { get; set; }
        public int Count { get; set; }
    }
}
