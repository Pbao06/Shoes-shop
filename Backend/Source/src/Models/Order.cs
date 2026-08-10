using System.Collections.Generic;

namespace src.Models;

public class Order
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public int? AddressId { get; set; }
    public string OrderNumber { get; set; } = string.Empty;
    public decimal Subtotal { get; set; }
    public decimal ShippingFee { get; set; }
    public decimal TotalAmount { get; set; }
    public string Status { get; set; } = "Pending";
    public string PaymentStatus { get; set; } = "Unpaid";
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public User? User { get; set; }
    public Address? Address { get; set; }
    public ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
    public ICollection<Payment> Payments { get; set; } = new List<Payment>();
}
