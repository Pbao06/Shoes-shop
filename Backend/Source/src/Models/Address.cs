namespace src.Models;

public class Address
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public string RecipientName { get; set; } = string.Empty;
    public string PhoneNumber { get; set; } = string.Empty;
    public string Street { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public string State { get; set; } = string.Empty;
    public string PostalCode { get; set; } = string.Empty;
    public string Country { get; set; } = string.Empty;
    public bool IsDefault { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public User? User { get; set; }
    public ICollection<Order> Orders { get; set; } = new List<Order>();
}
