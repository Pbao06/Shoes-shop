namespace src.Models;

public class Size
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }

    public ICollection<ProductVariant> ProductVariants { get; set; } = new List<ProductVariant>();
}
