namespace src.Models;

public class Payment
{
    public int Id { get; set; }
    public int OrderId { get; set; }
    public string PaymentMethod { get; set; } = string.Empty;
    public string Status { get; set; } = "Pending";
    public decimal Amount { get; set; }
    public string? TransactionId { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public Order? Order { get; set; }
}
