namespace Application.DTOs
{
    public class UserSelectionPoint
    {
        public Guid CategoryId { get; set; }
        public ICollection<Guid> TagIds { get; set; }
    }
}