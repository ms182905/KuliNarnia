namespace Domain
{
    public class Category
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public ICollection<Recipe> Recipes { get; set; }
        public ICollection<UserSelectionStastic> UserSelectionStastics { get; set; }
    }
}