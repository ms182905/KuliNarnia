namespace Application.DTOs
{
    public class ActivitiesDTO
    {
        public ICollection<ActivityDTO> Activities { get; set; }
        public int Count { get; set; }
    }
}
