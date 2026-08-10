namespace src.DTOs;

public class BrandDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? LogoUrl { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

public class CreateBrandDto
{
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? LogoUrl { get; set; }
}